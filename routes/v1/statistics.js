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
      mf_server = req.app.get('mf_server') + '/v1/mf',
      workflowID = req.params.workflowID.toLowerCase(),
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
        body = filter_and_aggregate_by(metric, from, to, type);
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
        var answer = {},
          aggs = response.aggregations;

        answer['user'] = {}
        answer['user'].href = mf_server + '/users/' + workflowID;
        answer['metric'] = metric;

        if (is_defined(from) && is_defined(to)) {
            aggs = aggs['filtered_stats'];
        }
        answer['statistics'] = aggs[metric + '_Stats'];
        answer['min'] = aggs['Minimum_' + metric]['hits']['hits'][0]['_source'];
        answer['max'] = aggs['Maximum_' + metric]['hits']['hits'][0]['_source'];
        res.json(answer);
    });
}

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function filter_and_aggregate_by(field_name, from, to, type) {
    var filter_type = '';
    if (is_defined(type)) {
        filter_type = '{ ' +
                        '"type": { "value": "' + type + '" }' +
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
    return '{' + type_filter(type) +
        '"aggs": {' +
            '"' + field_name + '_Stats" : {' +
                '"extended_stats" : {' +
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