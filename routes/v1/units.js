var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var client = req.app.get('elastic'),
      json = {},
      size = 1000;
    
    client.search({
        index: 'mf',
        type: 'metrics',
        size: size
    }, function(error, response) {
    	if (error) {
    		json = "No current units of metrics available.";
    		return next(json);
    	}
    	else {
    		var results = response.hits.hits;
    		var keys = Object.keys(results);
    		keys.forEach(function(key) {
        			var item = results[key]._source;
        			var id = results[key]._id;
        			json[id] = item;
        		});
    		res.json(json);
    	}
    });
});

router.put('/:metric_id', function(req, res, next) {
    var mf_server = req.app.get('mf_server'),
      metric_id = req.params.metric_id,
      client = req.app.get('elastic');

    client.index({
        index: 'mf',
        type: 'metrics',
        id: metric_id,
        body: req.body
    },function(error, response) {
    	if (error) {
    		res.status(500);
    		return next(error);
    	}
        var json = {};
        json.href = mf_server + '/v1/mf' + '/units/' + metric_id;
        res.json(json);
    });
});

module.exports = router;
