var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');

router.get('/', function(req, res, next) {
    var client = req.app.get('elastic'),
        mf_server = req.app.get('mf_server'),
        details = req.query.details,
        excess = req.query.users,
        size = 1000,
        json = {};

    if (is_defined(excess)) {
        mf_server = mf_server + '/v1/mf';
    } else {
        mf_server = mf_server + '/v1/dreamcloud/mf';
    }

    client.search({
        index: 'mf',
        type: 'workflows',
        searchType: 'count'
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response.hits !== undefined) {
            size = response.hits.total;
        }

        client.search({
            index: 'mf',
            type: 'workflows',
            size: size
        }, function(error, response) {
            if (error) {
                res.status(500);
                return next(error);
            }
            if (response.hits !== undefined) {
                var results = response.hits.hits;
                if (is_defined(details)) {
                    json = get_details(results);
                } else {
                    json = get_workflows(results, mf_server, excess);
                }
            }
            res.json(json);
        });
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function get_details(results) {
    var keys = Object.keys(results),
        response = {};
    keys.forEach(function(key) {
        var source = results[key]._source,
            item = JSON.parse(JSON.stringify(source));
        if (is_defined(source.tasks)) {
            item.tasks = [];
            for (var i in source.tasks) {
                item.tasks.push(source.tasks[i].name);
            }
        }
        response[results[key]._id] = item;
    });
    return response;
}

function get_workflows(results, mf_server, excess) {
    var keys = Object.keys(results),
        workflow = '',
        response = {},
        path = 'workflows';
    if (is_defined(excess)) {
        path = 'users';
    }
    keys.forEach(function(key) {
        workflow = results[key]._id;
        var json = {};
        json.href = mf_server + '/' + path + '/' + workflow;
        response[workflow] = json;
    });
    return response;
}

router.get('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        client = req.app.get('elastic'),
        json = {};

    client.get({
        index: 'mf',
        type: 'workflows',
        id: id
    }, function(error, response) {
        if (response.found) {
            json = response._source;
        } else {
            json.error = error;
        }
        res.json(json);
    });
});

router.put('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        mf_server = req.app.get('mf_server'),
        client = req.app.get('elastic');

    client.index({
        index: 'mf',
        type: 'workflows',
        id: id,
        body: req.body
    }, function(error, response) {
        if (error !== 'undefined') {
            var json = {};
            json.href = mf_server + '/workflows/' + id;
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

router.put('/', function(req, res, next) {
    var mf_server = req.app.get('mf_server'),
        client = req.app.get('elastic');

    var workflow = req.body;
    if (workflow.wf_id === undefined) {
        var message = {};
        message.error = "Please provide a workflow ID (wf_id).";
        res.status(500);
        return next(message);
    }
    workflow.wf_id = workflow.wf_id.toLowerCase();
    id = workflow.wf_id;

    var workflow_response = {};

    async.series([
        /* REGISTER WORKFLOW */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'workflows',
                id: id,
                body: workflow
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }

                workflow_response.workflow = {};
                workflow_response.workflow.id = id;
                workflow_response.workflow.href = mf_server + '/workflows/' + id;
                series_callback(null);
            });
        },
        /* CREATE EXPERIMENT ID */
        function(series_callback) {
            var body = {};
            var now = new Date();
            now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
            body['@timestamp'] = now;

            client.index({
                index: 'mf',
                type: 'experiments',
                parent: id,
                body: body
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }
                workflow_response.experiment = {};
                workflow_response.experiment.id = response._id;
                workflow_response.experiment.href = mf_server +
                    '/experiments/' + response._id + '?workflow=' + id;
                series_callback(null);
            });
        },
    ], function(error) {
        if (error) {
            res.status(500);
            return next(error);
        }
        res.json(workflow_response);
    });
});

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
       return true;
    }
}

router.put('/:workflowID/:experimentID', function(req, res, next) {
    var mf_server = req.app.get('mf_server'),
        client = req.app.get('elastic'),
        workflowID = req.params.workflowID.toLowerCase(),
        experimentID = req.params.experimentID,
        workflow_response = {},
        data = {};

    /* set the body message */
    if (!Object.keys(req.body).length) {
        data.wf_id = workflowID;
    } else {
        data = req.body;
    }

    async.series([
        /* register the given workflow */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'workflows',
                id: workflowID,
                body: data
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }

                workflow_response.workflow = {};
                workflow_response.workflow.id = workflowID;
                workflow_response.workflow.href = mf_server +
                    '/workflows/' + workflowID;

                series_callback(null);
            });
        },
        /* create new experiment using an existing id */
        function(series_callback) {
            var body = {};
            var now = new Date();
            now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
            body['@timestamp'] = now;

            client.index({
                index: 'mf',
                type: 'experiments',
                parent: workflowID,
                id: experimentID,
                body: body
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }

                var json = {};
                workflow_response.experiment = {};
                workflow_response.experiment.id = response._id;
                workflow_response.experiment.href = mf_server +
                    '/experiments/' + response._id + '?workflow=' + workflowID;

                series_callback(null);
            });
        },
    ], function(error) {
        if (error) {
            res.status(500);
            return next(error);
        }
        res.json(workflow_response);
    });
});

module.exports = router;
