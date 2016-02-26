var express = require('express');
var async = require('async');
var router = express.Router();

router.get('/:workID/:taskID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
        workflow = req.params.workID.toLowerCase(),
        task = req.params.taskID.toLowerCase(),
        experiment = req.params.expID;

    var index = workflow + '_' + task;

    return client.search({
        index: index,
        type: experiment,
        size: 1,
        sort: ["@timestamp:asc"],
    }, function(err, result) {
        var start;
        var end;
        var start_original;
        var end_original;

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
                    start_original = start;
                    start = start.replace(/\s/g, '0');
                    start = new Date(start);
                    start = start.getTime() / 1000;
                });
            }
        }

        client.search({
            index: index,
            type: experiment,
            size: 1,
            sort: ["@timestamp:desc"],
        }, function(err, result) {
            var host;
            var response;
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
                        end_original = end;
                        end = end.replace(/\s/g, '0');
                        end = new Date(end);
                        end = end.getTime() / 1000;
                    });
                }
            }

            var response = {};
            response.start = start_original;
            response.end = end_original;
            response.runtime = (end - start);
            response.host = host;
            res.send(response);
        });
    });
});

module.exports = router;
