var express = require('express');
var router = express.Router();
var async = require('async');

router.get('/:workID', function(req, res, next) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server'),
      workflow = req.params.workID.toLowerCase(),
      dreamcloud = req.query.dreamcloud,
      json = {};

    if (is_defined(dreamcloud)) {
        mf_server = mf_server + '/v1/dreamcloud/mf';
    } else {
        mf_server = mf_server + '/v1/mf';
    }

    client.indices.getSettings({
        index: workflow + '*',
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response !== undefined) {
            var results = Object.keys(response);

            async.map(results, function(index, callback) {
                var task = index;
                task = task.replace(workflow + '_', '');
                // please remove for production mode
                if (task.indexOf("2015") > -1) {
                    return callback(null, json);
                }

                client.indices.getMapping({
                    index: index,
                }, function(error, response) {
                    if (error == undefined) {
                        var mappings = response[index].mappings;
                        mappings = Object.keys(mappings);
                        if (json[task] == undefined) {
                            json[task] = {};
                        }
                        for (var i in mappings) {
                            var item = {};
                            // remove in prod. mode
                            if (typeof task !== 'undefined') {
                                item.href = mf_server + '/profiles/' + workflow + '/' + task + '/' + mappings[i];
                                json[task][mappings[i]] = item;
                            } else {
                                item.href = mf_server +  '/profiles/' + workflow + '/' + mappings[i];
                                json[mappings[i]] = item;
                            }
                        }
                        return callback(null, json);
                    } else {
                        json.error = error;
                    }
                });
            }, function(err, results) {
                // remove in production mode
                if (typeof results[0] == 'undefined') {
                    res.status(500);
                    var msg = {};
                    msg.error = "No results found.";
                    res.json(msg);
                } else {
                    for (var key in results[0]) {
                        if (isEmpty(results[0][key])) {
                            delete results[0][key];
                        }
                    }
                    res.json(results[0]);
                }
            });
        }
    });
});

function isEmpty(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

router.get('/:workID/:taskID', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workID.toLowerCase(),
      mf_server = req.app.get('mf_server'),
      dreamcloud = req.query.dreamcloud,
      task = req.params.taskID,
      size = 1000,
      json = {};

    if (is_defined(dreamcloud)) {
        mf_server = mf_server + '/v1/dreamcloud/mf';
    } else {
        mf_server = mf_server + '/v1/mf';
    }

    // assign default taskID when application has no workflow
    if (!is_defined(task)) {
        res.status(500);
        json.error = "Task not found";
        res.json(json);
        return;
    }
    var index = workflow + '_' + task;
    index = index.toLowerCase()

    client.indices.getMapping({
        index: index,
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response !== undefined) {
            var mappings = response[index].mappings;
            mappings = Object.keys(mappings);
            async.map(mappings, function(experimentID, callback) {
                client.get({
                    index: 'mf',
                    type: 'experiments',
                    id: experimentID,
                    parent: workflow
                }, function(error, response) {
                    if (response.found) {
                        var result = response._source,
                          timestamp = result.timestamp,
                          href = mf_server + '/profiles/' + workflow + '/' + task + '/' + experimentID;
                        var element = {};
                        element.href = href;
                        if (typeof timestamp !== 'undefined') {
                            timestamp = timestamp.split('-')[0]
                            timestamp = timestamp.replace(/\./g, '-')
                            if (json[timestamp] == undefined) {
                                json[timestamp] = {};
                            }
                        } else if (typeof result['@timestamp'] !== 'undefined') {
                            timestamp = result['@timestamp'].split('T')[0]
                            if (json[timestamp] == undefined) {
                                json[timestamp] = {};
                            }
                        }
                        json[timestamp][experimentID] = element;
                    } else {
                        json.error = error;
                    }
                    return callback(null, json);
                });
            }, function(err, results) {
                if (typeof results[0] == 'undefined') {
                    res.status(500);
                    var msg = {};
                    msg.error = "No results found.";
                    res.json(msg);
                } else {
                    res.json(results[0]);
                }
            });
        }
    });
});


router.get('/:workID/:taskID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workID.toLowerCase(),
      task = req.params.taskID,
      experiment = req.params.expID,
      filter = req.query.filter,
      size = 1000,
      json = [];

    var index = workflow + '_' + task;

    client.search({
        index: index,
        type: experiment,
        searchType: 'count'
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response.hits != undefined) {
            size = response.hits.total;
        }

        client.search({
            index: index,
            type: experiment,
            size: size
        }, function(error, response) {
            if (error) {
                res.status(500);
                return next(error);
            }
            if (response.hits !== undefined) {
                var results = response.hits.hits,
                  keys = Object.keys(results),
                  item = {};
                keys.forEach(function(key) {
                    item = results[key]._source;
                    if (typeof item['@timestamp'] !== 'undefined') {
                        item['@timestamp'] = item['@timestamp'].replace(/\s/g, '0');
                    }
                    json.push(item);
                });
            }

            if (typeof json[0] == 'undefined') {
                res.status(500);
                var msg = {};
                msg.error = "No results found.";
                res.json(msg);
            } else {
                res.json(json);
            }
        });
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

module.exports = router;