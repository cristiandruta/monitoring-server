var express = require('express');
var router = express.Router();

router.get('/:workflowID', function(req, res, next) {
    var workflowID = req.params.workflowID.toLowerCase(),
        index = workflowID + '_*';

    return handle_response(req, res, next, index);
});

router.get('/:workflowID/:taskID', function(req, res, next) {
    var workflowID = req.params.workflowID.toLowerCase(),
      taskID = req.params.taskID.toLowerCase(),
      index = workflowID + '_' + taskID;

    return handle_response(req, res, next, index);
});

function handle_response(req, res, next, index) {
    var client = req.app.get('elastic'),
      mf_server = req.app.get('mf_server') + '/dreamcloud/mf',
      workflowID = req.params.workflowID.toLowerCase(),
      filter = req.query.filter,
      metric = req.query.metric,
      from = req.query.from,
      to = req.query.to,
      body = aggregation_by(metric);

     if (!is_defined(metric)) {
        var error = {
            'error': {
                'message': 'parameter metric is missing'
            }
        };
        res.json(error);
        return;
    }

    if (is_defined(filter)) {
        if (filter.indexOf("==") >= 0) {
            var terms = filter.split("==");
            body = filter_and_aggregate_by(terms[0], terms[1], metric, from, to);
        } else {
            var error_message= {
                'error': {
                    'message': 'only the operator == is supported'
                }
            };
            res.json(error_message);
            return;
        }
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

        answer.workflow = {};
        answer.workflow.href = mf_server + '/workflows/' + workflowID;
        answer.metric = metric;

        if (is_defined(filter)) {
            answer.filter = filter;
            aggs = aggs.filtered_stats;
        }
        answer.statistics = aggs[metric + '_Stats'];
        answer.min = aggs['Minimum_' + metric].hits.hits[0]._source;
        answer.max = aggs['Maximum_' + metric].hits.hits[0]._source;
        res.json(answer);
    });
}

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function filter_and_aggregate_by(term_key, term_filter, field_name, from, to) {
    return '{' +
        '"aggs": {' +
            '"filtered_stats": {' +
                '"filter": {' +
                    '"and": [' +
                        '{' +
                            '"term": {' +
                                '"' + term_key + '": "' + term_filter.toLowerCase() + '"' +
                            '}' +
                        '}' +
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
            ',{ ' +
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

function aggregation_by(field_name) {
    return '{' +
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
