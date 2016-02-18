var express = require('express');
var async = require('async');
var moment = require('moment');
var router = express.Router();

var skip_fields = [ 'Timestamp', 'type', 'hostname' ];

router.get('/:workflowID/:experimentID', function(req, res, next) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server'),
      workflow = req.params.workflowID.toLowerCase(),
      experiment = req.params.experimentID,
      dreamcloud_pwm_idx = req.app.get('pwm_idx'),
      json = {};

    client.get({
        index: 'mf',
        type: 'workflows',
        id: workflow
    }, function (error, result) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (result != undefined) {
            var es_result = {},
                ranges = {};
            es_result.workflow = workflow;
            var tasks = result._source.tasks;
            es_result.tasks = [];

            /* FOR EACH TASK */
            async.each(tasks, function(task, callback) {
                task = task.name;
                var resource = workflow + "_" + task;
                resource = resource.toLowerCase();
                ranges[task] = {};

                async.series([
                    /* GET START DATE OF TASK */
                    function(series_callback) {
                        client.search({
                            index: resource,
                            type: experiment,
                            size: 1,
                            sort: [ "@timestamp:asc" ],
                        }, function(error, result) {
                            if (error) {
                                return series_callback(error);
                            }
                            if (result.hits != undefined) {
                                var only_results = result.hits.hits,
                                    keys = Object.keys(only_results),
                                    start = 0;
                                keys.forEach(function(key) {
                                    var metric_data = only_results[key]._source;
                                    start = metric_data['@timestamp'];
                                    start = start.replace(/\s/g, '0');
                                    start = new Date(start);
                                    start = start.getTime() / 1000;
                                });

                                ranges[task].start = start - 3600;
                                series_callback(null);
                            }
                        });
                    },
                    /* GET END DATE OF TASK */
                    function(series_callback) {
                        client.search({
                            index: resource,
                            type: experiment,
                            size: 1,
                            sort: [ "@timestamp:desc" ],
                        }, function(error, result) {
                            if (error) {
                                return series_callback(error);
                            }
                            if (result.hits != undefined) {
                                var only_results = result.hits.hits,
                                    keys = Object.keys(only_results),
                                    end = 0;
                                keys.forEach(function(key) {
                                    var metric_data = only_results[key]._source;
                                    end = metric_data['@timestamp'];
                                    end = end.replace(/\s/g, '0');
                                    end = new Date(end);
                                    end = end.getTime() / 1000;
                                });

                                ranges[task].end = end - 3600;
                                series_callback(null);
                            }
                        });
                    },
                    function(series_callback) {
                        client.search({
                            index: dreamcloud_pwm_idx,
                            body: {
                                query: {
                                    constant_score: {
                                        filter: {
                                            range: {
                                                "Timestamp": {
                                                    "gte": ranges[task].start.toString(),
                                                    "lte": ranges[task].end.toString()
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            searchType: 'count'
                        }, function(error, response) {
                            if (error) {
                                return series_callback(error);
                            }
                            if (response.hits != undefined) {
                                size = response.hits.total;
                                ranges[task].size = size;
                            }

                            series_callback(null);
                        });
                    },
                    /* ENERGY RANGE QUERY */
                    function(series_callback) {
                        client.search({
                            index: dreamcloud_pwm_idx,
                            body: {
                                query: {
                                    constant_score: {
                                        filter: {
                                            range: {
                                                "Timestamp": {
                                                    "gte": ranges[task].start.toString(),
                                                    "lte": ranges[task].end.toString()
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            size: ranges[task].size,
                            sort: [ "Timestamp:asc" ],
                        }, function(error, result) {
                            if (error) {
                                return series_callback(error);
                            }

                            if (result.hits != undefined) {
                                var only_results = result.hits.hits;
                                var es_result = [];
                                var keys = Object.keys(only_results);
                                var power_result = {};

                                keys.forEach(function(key) {
                                    var data = only_results[key]._source;
                                    if (data.type != "power") {
                                        es_result.push(data);
                                        return;
                                    }
                                    var processed = false;
                                    for (var key in data) {
                                        if (processed)
                                            return;
                                        if (data.hasOwnProperty(key)) {
                                            if (skip_fields.indexOf(key) > -1 || key == '')
                                                continue;
                                            var value = parseInt(data[key]);
                                            var time = data['Timestamp']; // 1430646029.762737460
                                            time = moment.unix(parseFloat(time));
                                            time = time.add(1, 'h');
                                            time = time.valueOf() / 1000;
                                            time = time.toString().substring(0, 13); // 1430646029.76
                                            var metrics = power_result[time];
                                            if (!metrics) {
                                                metrics = {};
                                                metrics['@timestamp'] = time;
                                                metrics.type = "pwm";//data.type;
                                            }
                                            metrics[key] = value;
                                            power_result[time] = metrics;
                                            processed = true;
                                        }
                                    }
                                });
                                for (var key in power_result) {
                                    es_result.push(power_result[key]);
                                }
                                json[task] = es_result;
                            } else {
                                var message = {};
                                message.error = "No data found";
                                json[task] = message;
                            }

                            series_callback(null);
                        });
                    }
                ], function(error) {
                    if (error) {
                        return callback();
                    }
                    json = json;
                    callback(null);
                });
            }, function(error) {
                if (error) {
                    res.status(500);
                    return next(error);
                }
                res.json(json);
            });
        }
    });
});

router.get('/:workflowID/:taskID/:experimentID', function(req, res, next) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server'),
      workflow = req.params.workflowID.toLowerCase(),
      task = req.params.taskID.toLowerCase(),
      experiment = req.params.experimentID,
      dreamcloud_pwm_idx = req.app.get('pwm_idx'),
      json = {};

    var es_result = {},
        ranges = {};
    es_result.workflow = workflow;
    es_result.tasks = [];

    /* FOR EACH TASK */
    async.each([ task ], function(task, callback) {
        var resource = workflow + "_" + task;
        resource = resource.toLowerCase();
        ranges[task] = {};

        async.series([
            /* GET START DATE OF TASK */
            function(series_callback) {
                client.search({
                    index: resource,
                    type: experiment,
                    size: 1,
                    sort: [ "@timestamp:asc" ],
                }, function(error, result) {
                    if (error) {
                        return series_callback(error);
                    }
                    if (result.hits != undefined) {
                        var only_results = result.hits.hits,
                            keys = Object.keys(only_results),
                            start = 0;
                        keys.forEach(function(key) {
                            var metric_data = only_results[key]._source;
                            start = metric_data['@timestamp'];
                            start = start.replace(/\s/g, '0');
                            start = new Date(start);
                            start = start.getTime() / 1000;
                        });

                        ranges[task].start = start - 3600;
                        series_callback(null);
                    }
                });
            },
            /* GET END DATE OF TASK */
            function(series_callback) {
                client.search({
                    index: resource,
                    type: experiment,
                    size: 1,
                    sort: [ "@timestamp:desc" ],
                }, function(error, result) {
                    if (error) {
                        return series_callback(error);
                    }
                    if (result.hits != undefined) {
                        var only_results = result.hits.hits,
                            keys = Object.keys(only_results),
                            end = 0;
                        keys.forEach(function(key) {
                            var metric_data = only_results[key]._source;
                            end = metric_data['@timestamp'];
                            end = end.replace(/\s/g, '0');
                            end = new Date(end);
                            end = end.getTime() / 1000;
                        });

                        ranges[task].end = end - 3600;
                        series_callback(null);
                    }
                });
            },
            function(series_callback) {
                client.search({
                    index: dreamcloud_pwm_idx,
                    body: {
                        query: {
                            constant_score: {
                                filter: {
                                    range: {
                                        "Timestamp": {
                                            "gte": ranges[task].start.toString(),
                                            "lte": ranges[task].end.toString()
                                        }
                                    }
                                }
                            }
                        }
                    },
                    searchType: 'count'
                }, function(error, response) {
                    if (error) {
                        return series_callback(error);
                    }
                    if (response.hits != undefined) {
                        size = response.hits.total;
                        ranges[task].size = size;
                    }

                    series_callback(null);
                });
            },
            /* ENERGY RANGE QUERY */
            function(series_callback) {
                client.search({
                    index: dreamcloud_pwm_idx,
                    body: {
                        query: {
                            constant_score: {
                                filter: {
                                    range: {
                                        "Timestamp": {
                                            "gte": ranges[task].start.toString(),
                                            "lte": ranges[task].end.toString()
                                        }
                                    }
                                }
                            }
                        }
                    },
                    size: ranges[task].size,
                    sort: [ "Timestamp:asc" ],
                }, function(error, result) {
                    if (error) {
                        return series_callback(error);
                    }

                    if (result.hits != undefined) {
                        var only_results = result.hits.hits;
                        var es_result = [];
                        var keys = Object.keys(only_results);
                        var power_result = {};

                        keys.forEach(function(key) {
                            var data = only_results[key]._source;
                            if (data.type != "power") {
                                es_result.push(data);
                                return;
                            }
                            var processed = false;
                            for (var key in data) {
                                if (processed)
                                    return;
                                if (data.hasOwnProperty(key)) {
                                    if (skip_fields.indexOf(key) > -1 || key == '')
                                        continue;
                                    var value = parseInt(data[key]);
                                    var time = data['Timestamp']; // 1430646029.762737460
                                    time = moment.unix(parseFloat(time));
                                    time = time.add(1, 'h');
                                    time = time.valueOf() / 1000;
                                    time = time.toString().substring(0, 13); // 1430646029.76
                                    var metrics = power_result[time];
                                    if (!metrics) {
                                        metrics = {};
                                        metrics['@timestamp'] = time;
                                        metrics.type = "pwm";//data.type;
                                    }
                                    metrics[key] = value;
                                    power_result[time] = metrics;
                                    processed = true;
                                }
                            }
                        });
                        for (var key in power_result) {
                            es_result.push(power_result[key]);
                        }
                        json[task] = es_result;
                    } else {
                        var message = {};
                        message.error = "No data found";
                        json[task] = message;
                    }

                    series_callback(null);
                });
            }
        ], function(error) {
            if (error) {
                res.status(500);
                return next(error);
            }
            res.json(json);
        });
    });
});

module.exports = router;
