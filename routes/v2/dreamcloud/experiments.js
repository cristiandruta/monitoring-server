var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();


router.get('/', function(req, res, next) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server'),
      details = req.query.details,
      workflows = req.query.workflows,
      json = {},
      query = '',
      size = 1000;

    query = '{ "query": { "match_all": {} } }';
    if (typeof workflows !== 'undefined') {
        query = '{ "query": { "term": { "_parent": "' + workflows + '" } } }'
    }

    client.search({
        index: 'mf',
        type: 'experiments',
        searchType: 'count'
    }, function(error, response) {
        if (response.hits != undefined) {
            size = response.hits.total;
        }

        client.search({
            index: 'mf',
            type: 'experiments',
            fields: '_parent,_source',
            body: query,
            size: size,
            sort: '@timestamp:desc'
        }, function(error, response) {
            if (response.hits != undefined) {
                var results = response.hits.hits;
                if (is_defined(details)) {
                    json = get_details(results);
                } else {
                    json = get_workflows(mf_server, results);
                }
            } else {
                json.error = error;
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
      item = {},
      response = {};
    keys.forEach(function(key) {
        item = results[key]._source;
        if (typeof item.timestamp !== 'undefined') {
            item.date = item.timestamp.split('-')[0];
            item.date = item.date.replace(/\./g, '-');
            item.started = item.timestamp;
            var secs = item.started.split('-');
            if (secs.length == 2) {
                secs[0] = secs[0].replace(/\./g, '-');
                secs[1] = secs[1].replace(/\./g, ':');
                item.started = secs.join('T');
            }
            delete item.timestamp;
        }
        item.workflow = results[key]._parent;
        response[results[key]._id] = item;
    });
    return response;
}

function get_workflows(mf_server, results) {
    var keys = Object.keys(results),
      experimentID = '',
      workflow = '',
      response = {};
    keys.forEach(function(key) {
        experimentID = results[key]._id
        workflow = results[key]._parent;
        var json = {};
        json.href = mf_server + '/dreamcloud/mf/experiments/' + experimentID + '?workflow=' + workflow;
        response[experimentID] = json;
    });
    return response;
}

router.get('/:id', function(req, res, next) {
    var client = req.app.get('elastic'),
      id = req.params.id,
      workflow = req.query.workflow,
      extend = req.query.extends,
      json = {},
      size = 1000;

    workflow = workflow.toLowerCase();

    if (typeof workflow == 'undefined') {
        json.error = "URL parameter 'workflow' is missing";
        res.json(json);
        return;
    }

    client.get({
        index: 'mf',
        type: 'experiments',
        id: id,
        parent: workflow
    }, function(error, response) {
        if (response.found) {
            json = response._source;
            if (json['@timestamp'] !== 'undefined') {
                delete json['timestamp'];
            }
            if (is_defined(extend)) {
                client.get({
                    index: 'mf',
                    type: 'workflows',
                    id: workflow
                }, function(error, response) {
                    if (response.found) {
                        var source = response._source;
                        json.tasks = [];
                        for (var i in source.tasks) {
                            json.tasks.push(source.tasks[i].name);
                        };
                    } else {
                        json.error = error;
                    }
                    res.json(json);
                });
            } else {
                res.json(json);
            }
        } else {
            res.json(error);
        }
    });
});

router.post('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic');

    var body = req.body;
    var now = new Date();
    now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    body['@timestamp'] = now;

    client.index({
        index: 'mf',
        type: 'experiments',
        parent: id,
        body: body
    },function(error, response) {
        if (error) {
            res.json(error);
        } else {
            var json = {};
            json[response._id] = {};
            json[response._id].href = mf_server + '/dreamcloud/mf/experiments/' + response._id + '?workflow=' + id;
            res.json(json);
        }
    });
});

module.exports = router;