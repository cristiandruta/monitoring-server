var express = require('express');
var router = express.Router();

router.get('/:workflowID/:taskID', function(req, res, next) {
    var workflowID = req.params.workflowID.toLowerCase(),
      taskID = req.params.taskID.toLowerCase(),
      index = workflowID + '_' + taskID;

    return handle_response(req, res, next, index);
});

router.get('/:workflowID/:taskID/:experimentID', function(req, res, next) {
    var workflowID = req.params.workflowID.toLowerCase(),
      taskID = req.params.taskID.toLowerCase(),
      type = req.params.experimentID,
      index = workflowID + '_' + taskID;

    return handle_response(req, res, next, index, type);
});

function handle_response(req, res, next, index, type) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server') + '/mf',
      workflowID = req.params.workflowID.toLowerCase(),
      host = req.query.host,
      metric = req.query.metric,
      from = req.query.from,
      to = req.query.to,
      body = aggregation_by(metric, type);

     if (!is_defined(metric)) {
        var error = {
            'error': {
                'message': 'parameter metric is missing'
            }
        }
        res.json(error);
        return;
    }

    if (is_defined(from) && is_defined(to)) {
        body = filter_and_aggregate_by(metric, from, to, type, host);
    }

    client.indices.refresh({
        index: index
    }, function(error, response) {
        if (error) {
            res.json(error);
            return;
        }
        client.search({
            index: index,
            searchType: 'count',
            body: body
        }, function(error, response) {
            if (error) {
                res.json(error);
                return;
            }
            var metrics = [],
                answers = [];
            if (typeof(metric) == "string") {
                metrics[0] = metric;
            }
            else {
                metrics = metric;
            }
            for (var key in metrics) {
                var answer = {},
                    aggs = response.aggregations;
                answer['user'] = {};
                answer['user'].href = mf_server + '/users/' + workflowID;
                answer['metric'] = metrics[key];

                if (is_defined(from) && is_defined(to)) {
                    aggs = aggs['filtered_stats'];
                }
                if(aggs['Minimum_' + metrics[key]]['hits']['total'] == 0) {
                        var json = {};
                        json.error = "response is empty for the metric";
                        answers.push(json);
                }
                else {
                    answer['statistics'] = aggs[metrics[key] + '_Stats'];
                    answer['min'] = aggs['Minimum_' + metrics[key]]['hits']['hits'][0]['_source'];
                    answer['max'] = aggs['Maximum_' + metrics[key]]['hits']['hits'][0]['_source'];
                    answers.push(answer);
                }
            }
            res.json(answers);
        });
    });
}

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function filter_and_aggregate_by(field_name, from, to, type, host) {
    var filter_type = '';
    if (is_defined(type)) {
        filter_type = '{ ' +
                        '"type": { "value": "' + type + '" }' +
                    '},';
    }
    if(is_defined(host)) {
        filter_type += '{ ' +
                        '"prefix": { "host": "' + host + '" }' +
                    '},';
    }
    return '{' +
        '"aggs": {' +
            '"filtered_stats": {' +
                '"filter": {' +
                    '"and": [' +
                        filter_type +
                        date_filter(from, to) +
                    ']' +
                '},' +
                aggregation_by(field_name).slice(1, -1) +
            '}' +
        '}' +
    '}';
}

function date_filter(from, to) {
    var filter = '';

    if (is_defined(from) && is_defined(to)) {
        filter =
            '{ ' +
                '"range": {' +
                    '"@timestamp": {' +
                        '"from": "' + from + '",' +
                        '"to": "' + to + '"' +
                    '}' +
                '}' +
            '}';
    }

    return filter;
}

function type_filter(type) {
    var filter = '';

    if (is_defined(type)) {
        filter =
            '"query": {' +
                '"filtered": {' +
                    '"filter": {' +
                        '"type": { "value": "' + type + '" }' +
                    '}' +
                '}' +
            '},';
    }

    return filter;
}

function aggregation_by(field_name, type) {
    var fields = [];
    var query_msg = '{' + type_filter(type) +
        '"aggs": {';
    if(typeof(field_name) == "string") {
        fields[0] = field_name;
    }
    else {
        fields = field_name;
    }
    for (var key in fields) {
        query_msg +=
            '"' + fields[key] + '_Stats" : {' +
                '"extended_stats" : {' +
                    '"field" : "' + fields[key] + '"' +
                '}' +
            '},' +
            '"Minimum_' + fields[key] + '": {' +
                '"top_hits": {' +
                    '"size": 1,' +
                    '"sort": [' +
                        '{' +
                            '"' + fields[key] + '": {' +
                                '"order": "asc"' +
                            '}' +
                        '}' +
                    ']' +
                '}' +
            '},' +
            '"Maximum_' + fields[key] + '": {' +
                '"top_hits": {' +
                    '"size": 1,' +
                    '"sort": [' +
                        '{' +
                            '"' + fields[key] + '": {' +
                                '"order": "desc"' +
                            '}' +
                        '}' +
                    ']' +
                '}' +
            '},'
    }
    query_msg = query_msg.slice(0, -1);
    query_msg +=
        '}' +
    '}';
    return query_msg;
}

module.exports = router;