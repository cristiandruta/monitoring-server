var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

router.get('/:workID/:expID', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workID.toLowerCase(),
      experiment = req.params.expID;
      json = {};

    var documentId = workflow + '_' + experiment;

    client.get({
        index: 'mf',
        type: 'status',
        id: documentId
    }, function(error, response) {
    	if (error) {
    	    json = "No current status report available.";
            return next(json);
        }
        if (response.found) {
            json = response._source;
        }
        res.json(json);
    });
});

router.put('/:workID/:expID', function(req, res, next) {
    var mf_server = req.app.get('mf_server') + '/dreamcloud/mf',
      workflow = req.params.workID.toLowerCase(),
      experiment = req.params.expID,
      client = req.app.get('elastic');

    var documentId = workflow + '_' + experiment;

    var now = new Date();
    now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    req.body['@timestamp'] = now;

    client.index({
        index: 'mf',
        type: 'status',
        id: documentId,
        body: req.body
    },function(error, response) {
    	if (error) {
    		res.status(500);
    		return next(error);
    	}
        var json = {};
        json.href = mf_server + '/status/' + workflow + '/' + experiment;
        res.json(json);
    });
});

module.exports = router;
