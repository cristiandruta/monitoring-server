var express = require('express');
var async = require('async');
var router = express.Router();

router.get('/:workID/:taskID/:expID', function(req, res, next) {
    var wID = req.params.workID,
        tID = req.params.taskID,
        eID = req.params.expID;
    res.redirect('/v1/mf/runtime/' + wID + '/' + tID + '/' + eID);
});

router.get('/:workID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
        workflow = req.params.workID,
        experiment = req.params.expID,
        size = 1000,
        json = [];

    workflow = workflow.toLowerCase();

    client.get({
        index: 'mf',
        type: 'workflows',
        id: workflow
    }, function(err, result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        if (result != undefined) {
            var es_result = {};
            es_result.workflow = workflow;
            var earliest_start = Number.MAX_VALUE;
            var latest_end = 0;

            var tasks = result._source.tasks;
            es_result.tasks = [];
            async.each(tasks, function(task, callback) {
                    task = task.name;
                    var resource = workflow + "_" + task;
                    resource = resource.toLowerCase();

                    client.search({
                        index: resource,
                        type: experiment,
                        size: 1,
                        sort: ["@timestamp:asc"],
                    }, function(err, result) {
                        var start;
                        var end;

                        if (err) {
                            res.status(500);
                            return next(err);
                        } else {
                            if (result.hits != undefined) {
                                var only_results = result.hits.hits;
                                var keys = Object.keys(only_results);
                                keys.forEach(function(key) {
                                    var metric_data = only_results[key]._source;
                                    start = metric_data['@timestamp'];
                                    start = start.replace(/\s/g, '0');
                                    start = new Date(start);
                                    start = start.getTime() / 1000;
                                    if (start < earliest_start) {
                                        earliest_start = start;
                                    }
                                });
                            }
                        }

                        client.search({
                            index: resource,
                            type: experiment,
                            size: 1,
                            sort: ["@timestamp:desc"],
                        }, function(err, result) {
                            var hostname;

                            if (err) {
                                res.status(500);
                                return next(err);
                            } else {
                                if (result.hits != undefined) {
                                    var only_results = result.hits.hits;
                                    var keys = Object.keys(only_results);
                                    keys.forEach(function(key) {
                                        var metric_data = only_results[key]._source;
                                        host = metric_data['host'];
                                        end = metric_data['@timestamp'];
                                        end = end.replace(/\s/g, '0');
                                        end = new Date(end);
                                        end = end.getTime() / 1000;
                                        if (end > latest_end) {
                                            latest_end = end;
                                        }
                                    });
                                }
                            }

                            var json = {};
                            json.task = task;
                            json.host = hostname;
                            json.data = {};
                            json.data.start = start;
                            json.data.end = end;
                            json.data.runtime = (end - start);
                            if (!json.data.runtime) {
                                json.data.runtime = 0;
                            }
                            es_result.tasks.push(json);

                            callback();
                        });
                    });
                },
                function(err) {
                    var total_runtime = latest_end - earliest_start;
                    es_result.start = earliest_start;
                    es_result.end = latest_end;
                    es_result.total_runtime = total_runtime;
                    res.send(es_result);
                }
            );
        } else {
            res.status(500);
            return next(err);
        }
    });
});

module.exports = router;
