var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');

router.get('/:workflow/:task/:platform/:deployment', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workflow.toLowerCase(),
      task = req.params.task.toLowerCase(),
      platform = req.params.platform.toLowerCase(),
      deployment = req.params.deployment, // we keep the original case
      mf_server = req.app.get('mf_server'),
      dreamcloud_pwm_idx = req.app.get('pwm_idx'),
      expand = req.query.expand,
      experiments = [],
      json = [];

    /* (1) get deployment plan for the given hashvalue */
    client.get({
        index: 'deployment_on_' + platform,
        type: workflow + '_' + task,
        id: deployment
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        /* parse all experiments that use this deployment plan */
        if (response.found) {
            var source = response._source;
            experiments = source.experiments;
        } else {
            var message = {};
            message.error = "Could not find deployment plan in the database";
            res.json(message);
            return;
        }

        var index = workflow + '_' + task;
        async.forEachOf(experiments, function(value, experiment, callback) {
            /* get start of experiment */
            client.search({
                index: index,
                type: experiment,
                size: 1,
                sort: ['@timestamp:asc']
            }, function(error, response) {
                if (error) {
                    callback(null);
                    return;
                }
                var start, end;
                if (response.hits !== undefined) {
                    var only_results = response.hits.hits;
                    var keys = Object.keys(only_results);
                    keys.forEach(function(key) {
                        var metric_data = only_results[key]._source;
                        start = metric_data['@timestamp'];
                        start = start.replace(/\s/g, '0');
                    });
                }

                /* get end of experiment */
                client.search({
                    index: index,
                    type: experiment,
                    size: 1,
                    sort: ['@timestamp:desc']
                }, function(error, response) {
                    if (error) {
                        callback(null);
                        return;
                    }
                    if (response.hits !== undefined) {
                        var only_results = response.hits.hits;
                        var keys = Object.keys(only_results);
                        keys.forEach(function(key) {
                            var metric_data = only_results[key]._source;
                            end = metric_data['@timestamp'];
                            end = end.replace(/\s/g, '0');
                        });
                    }

                    if (!is_defined(start) || !is_defined(end)) {
                        callback(null);
                        return;
                    }

                    /* add runtime statistics to response object */
                    var data = {};
                    data.experiment = experiment;
                    data.workflow = workflow;
                    data.task = task;
                    data.deployment = deployment;
                    data.runtime = {};
                    data.runtime.start = start;
                    data.runtime.end = end;
                    data.runtime.actual = (new Date(end) - new Date(start)) / 1000;
                    if (!data.runtime.actual) {
                        data.runtime.actual = 0;
                    }

                    /* get energy measurments */
                    var body = compute_average_on("NODE01", "NODE02", "NODE03", start, end);
                    client.search({
                        index: dreamcloud_pwm_idx,
                        searchType: 'count',
                        body: body
                    }, function(error, response) {
                        if (error) {
                            callback(null);
                            return;
                        }
                        var answer = {},
                            aggs = response.aggregations;

                        data.energy = {};
                        var power_data = {};
                        var average = aggs.power_metrics.NODE01.value;
                        data.energy.NODE01 = {};
                        data.energy.NODE01.avg_watt_consumption = average;
                        var duration = (new Date(end) - new Date(start)) / 1000;
                        var joule = average * duration;
                        data.energy.NODE01.total_energy_consumption = joule;

                        average = aggs.power_metrics.NODE02.value;
                        data.energy.NODE02 = {};
                        data.energy.NODE02.avg_watt_consumption = average;
                        joule = average * duration;
                        data.energy.NODE02.total_energy_consumption = joule;

                        average = aggs.power_metrics.NODE03.value;
                        data.energy.NODE03 = {};
                        data.energy.NODE03.avg_watt_consumption = average;
                        joule = average * duration;
                        data.energy.NODE03.total_energy_consumption = joule;

                        /* no energy measurements available */
                        if (!is_defined(average) || average === null) {
                            data.energy = [];
                        }

                        /* retrieve all metric counters as a set */
                        var index = workflow + '_' + task;
                        var metric_keys = {};
                        client.search({
                            index: index,
                            type: experiment,
                            size: 20 /* should be enough results to capture all metrics */
                        }, function(error, response) {
                            if (error) {
                                callback(null);
                                return;
                            }
                            if (response.hits !== undefined) {
                                var results = response.hits.hits,
                                  keys = Object.keys(results),
                                  items = {};
                                /* filter keys like @timestamp, host, task, and type */
                                keys.forEach(function(key) {
                                    items = results[key]._source;
                                    if (items.type == 'progress') {
                                        return;
                                    }
                                    delete items['@timestamp'];
                                    delete items.host;
                                    delete items.task;
                                    delete items.type;
                                    for (var item in items) {
                                        metric_keys[item] = item;
                                    }
                                });

                                data.metrics = {};
                                /* compute statistics for each identified metric */
                                async.each(metric_keys, function(metric, inner_callback) {
                                    client.search({
                                        index: index,
                                        type: experiment,
                                        searchType: 'count',
                                        body: aggregation_by(metric)
                                    }, function(error, response) {
                                        if (error) {
                                            inner_callback(null);
                                            return;
                                        }
                                        var aggs = response.aggregations;
                                        data.metrics[metric] = aggs[metric + '_Stats'];
                                        inner_callback(null);
                                    });
                                }, function(error) {
                                    json.push(data);
                                });
                            }
                            /* finished */
                            callback(null);
                        });
                    });
                });
            });
        }, function(error) {
            if (error) {
                res.status(500);
                return next(error);
            }

            res.json(json);
        });
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function compute_average_on(metric_name_a, metric_name_b, metric_name_c, from, to) {
    var query = {
        "aggs": {
            "power_metrics": {
                "filter": {
                    "and": [{
                        "or": [{
                            "exists": {
                                "field": metric_name_a
                            }
                        }, {
                            "exists": {
                                "field": metric_name_b
                            }
                        }, {
                            "exists": {
                                "field": metric_name_c
                            }
                        }]
                    }, {
                        "range": {
                            "@timestamp": {
                                "gte": from.toString(),
                                "lte": to.toString()
                            }
                        }
                    }]
                },
                "aggs": {
                    "NODE01": {
                        "avg": {
                            "field": metric_name_a
                        }
                    },
                    "NODE02": {
                        "avg": {
                            "field": metric_name_b
                        }
                    },
                    "NODE03": {
                        "avg": {
                            "field": metric_name_c
                        }
                    }
                }
            }
        }
    };
    return query;
}


function aggregation_by(field_name) {
    return '{' +
        '"aggs": {' +
            '"' + field_name + '_Stats" : {' +
                '"stats" : {' +
                    '"field" : "' + field_name + '"' +
                '}' +
            '},' +
            '"Minimum_' + field_name + '": {' +
                '"top_hits": {' +
                    '"size": 1,' +
                    '"sort": [' +
                        '{' +
                            '"' + field_name + '": {' +
                                '"order": "asc"' +
                            '}' +
                        '}' +
                    ']' +
                '}' +
            '},' +
            '"Maximum_' + field_name + '": {' +
                '"top_hits": {' +
                    '"size": 1,' +
                    '"sort": [' +
                        '{' +
                            '"' + field_name + '": {' +
                                '"order": "desc"' +
                            '}' +
                        '}' +
                    ']' +
                '}' +
            '}' +
        '}' +
    '}';
}

module.exports = router;
