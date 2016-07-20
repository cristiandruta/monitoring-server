var express = require('express');
var router = express.Router();
/**
 * @api {get} /units Request a list of registered units
 * @apiVersion 1.0.0
 * @apiName GetUnits
 * @apiGroup Units
 *
 * @apiSuccess {Object} metric Metric object
 * @apiSuccess {String} metric.name Name of the metric
 * @apiSuccess {String} metric.plugin Plugin, to whom the metric belong
 * @apiSuccess {String} metric.unit Unit of the metric
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://mf.excess-project.eu:3030/v1/mf/units
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "CPU0_Core 13":
 *                {"name":"CPU0_Core 13",
 *                 "plugin":"mf_plugin_sensors",
 *                 "unit":"°c"},
 *          "CPU1_Core 5":
 *                {"name":"CPU1_Core 5",
 *                 "plugin":"mf_plugin_sensors",
 *                 "unit":"°c"},
 *          "VDDIO":
 *                {"name":"VDDIO",
 *                 "plugin":"mf_plugin_movidius",
 *                 "unit":"mA"}
 *     }
 *
 * @apiError NotFound Not Found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "error": "Not Found."
 *     }
 */
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
/**
 * @api {put} /units/:metric_id Register a unit of a metric
 * @apiVersion 1.0.0
 * @apiName PutUnits
 * @apiGroup Units
 *
 * @apiParam {String} metric_id Metric identifier
 * @apiSuccess {String} href Link to the registered metric and its unit
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://mf.excess-project.eu:3030/v1/mf/units/GPU1:MEM_used
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "href":"http://fangli-ThinkPad-T450s:3030/v1/v1/mf/units/GPU1:MEM_used"
 *     }
 *
 */
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
