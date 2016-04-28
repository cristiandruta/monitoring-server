var express = require('express');
var async = require('async');
var router = express.Router();
var dateFormat = require('dateformat');

router.get('/:workID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
        workflow = req.params.workID,
        experiment = req.params.expID,
        dreamcloud_pwm_idx = req.app.get('pwm_idx'),
        json = {};

    workflow = workflow.toLowerCase();
    json.workflow = {};
    json.workflow.id = workflow;
    json.workflow.runtime = {};
    json.tasks = {};

    client.indices.getAliases({
        index: workflow + '*',
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response !== undefined) {
            var earliest_start = "2200-01-01T00:00:00.000";
            var latest_end = 0;

            var tasks = Object.keys(response);
            async.each(tasks, function(task, callback) {
                var index = task;
                var type = experiment;

                client.search({
                    index: index,
                    type: type,
                    size: 1,
                    sort: ["@timestamp:asc"],
                }, function(err, result) {
                    var start;
                    var end;

                    if (err) {
                        json.tasks[task] = "Task to be scheduled";
                        callback(null);
                        return;
                    }
                    if (result.hits != undefined) {
                        var only_results = result.hits.hits;
                        var keys = Object.keys(only_results);
                        keys.forEach(function(key) {
                            var metric_data = only_results[key]._source;
                            start = metric_data['@timestamp'];
                            start = start.replace(/\s/g, '0');
                            if ((new Date(start)) < (new Date(earliest_start))) {
                                earliest_start = start;
                            }
                        });
                    }

                    client.search({
                        index: index,
                        type: type,
                        size: 1,
                        sort: ["@timestamp:desc"],
                    }, function(err, result) {
                        var hostname;

                        if (err) {
                            json.tasks[task] = "Task to be scheduled";
                            callback(null);
                            return;
                        }
                        if (result.hits != undefined) {
                            var only_results = result.hits.hits;
                            var keys = Object.keys(only_results);
                            keys.forEach(function(key) {
                                var metric_data = only_results[key]._source;
                                hostname = metric_data['host'];
                                end = metric_data['@timestamp'];
                                end = end.replace(/\s/g, '0');
                                if (new Date(end) > new Date(latest_end)) {
                                    latest_end = end;
                                }
                            });
                        }

                        if (!is_defined(start) || !is_defined(end)) {
                            callback(null);
                            return;
                        }

                        json.tasks[task] = {};
                        json.tasks[task].host = hostname;
                        json.tasks[task].runtime = {};
                        json.tasks[task].runtime.start = start;
                        json.tasks[task].runtime.end = end;
                        json.tasks[task].runtime.seconds = (new Date(end) - new Date(start)) / 1000;
                        if (!json.tasks[task].runtime.seconds) {
                            json.tasks[task].runtime.seconds = 0;
                        }

                        var body = compute_average_on("NODE01", "NODE02", "NODE03", start, end);

                        client.search({
                            index: dreamcloud_pwm_idx,
                            searchType: 'count',
                            body: body
                        }, function(error, response) {
                            if (error) {
                                return next(error);
                            }
                            var answer = {},
                                aggs = response.aggregations;

                            json.tasks[task].energy = {};

                            var power_data = {};
                            var average = aggs['power_metrics']['NODE01'].value;
                            json.tasks[task].energy = {};
                            json.tasks[task].energy["NODE01"] = {};
                            json.tasks[task].energy["NODE01"].avg_watt_consumption = average;
                            var duration = (new Date(end) - new Date(start)) / 1000;
                            var joule = average * duration;
                            json.tasks[task].energy["NODE01"].total_energy_consumption = joule;

                            average = aggs['power_metrics']['NODE02'].value;
                            json.tasks[task].energy["NODE02"] = {};
                            json.tasks[task].energy["NODE02"].avg_watt_consumption = average;
                            joule = average * duration;
                            json.tasks[task].energy["NODE02"].total_energy_consumption = joule;

                            average = aggs['power_metrics']['NODE03'].value;
                            json.tasks[task].energy["NODE03"] = {};
                            json.tasks[task].energy["NODE03"].avg_watt_consumption = average;
                            joule = average * duration;
                            json.tasks[task].energy["NODE03"].total_energy_consumption = joule;

                            callback(null);
                        });
                    });
                });

            }, function(error) {
                if (error) {
                    res.status(500);
                    return next(error);
                }

                json.workflow.runtime.start = earliest_start;
                json.workflow.runtime.end = latest_end;
                json.workflow.runtime.seconds = (new Date(latest_end) - new Date(earliest_start)) / 1000;

                var body = compute_average_on("NODE01", "NODE02", "NODE03", earliest_start, latest_end);

                client.search({
                    index: dreamcloud_pwm_idx,
                    searchType: 'count',
                    body: body
                }, function(error, response) {
                    if (error) {
                        return next(error);
                    }
                    var answer = {},
                        aggs = response.aggregations;

                    json.workflow.energy = {};
                    var power_data = {};
                    var average = aggs['power_metrics']["NODE01"].value;
                    json.workflow.energy["NODE01"] = {};
                    json.workflow.energy["NODE01"].avg_watt_consumption = average;
                    var duration = (new Date(latest_end) - new Date(earliest_start)) / 1000;
                    var joule = average * duration;
                    json.workflow.energy["NODE01"].total_energy_consumption = joule;

                    average = aggs['power_metrics']["NODE02"].value;
                    json.workflow.energy["NODE02"] = {};
                    json.workflow.energy["NODE02"].avg_watt_consumption = average;
                    joule = average * duration;
                    json.workflow.energy["NODE02"].total_energy_consumption = joule;

                    average = aggs['power_metrics']["NODE03"].value;
                    json.workflow.energy["NODE03"] = {};
                    json.workflow.energy["NODE03"].avg_watt_consumption = average;
                    joule = average * duration;
                    json.workflow.energy["NODE03"].total_energy_consumption = joule;

                    res.json(json);
                });
            });
        }
    })
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
    }
    return query;
}

module.exports = router;
