var express = require('express');
var router = express.Router();

router.get('/:workID/:taskID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workID.toLowerCase(),
      task = req.params.taskID.toLowerCase(),
      experiment = req.params.expID,
      latest = req.query.latest,
      size = 2000,
      sort = [ "@timestamp:asc" ];

    var index = workflow + "_" + task;

    if (is_defined(latest)) {
        size = 1;
        sort = [ "@timestamp:desc" ]
    }

    return client.search({
        index: index,
        type: experiment,
        size: size,
        body: { "query": { "term": { "type": "progress" } } },
        sort: sort,
    }, function(err, result) {
        if (result.hits != undefined){
            var only_results = result.hits.hits;
            var es_result = [];
            var keys = Object.keys(only_results);
            keys.forEach(function(key){
                es_result.push(only_results[key]._source);
            });
            res.send(es_result);
        } else {
            res.send('{ error: "No data found in the database" }');
        }
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

module.exports = router;