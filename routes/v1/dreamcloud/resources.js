var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

router.get('/', function(req, res, next) {
    var client = req.app.get('elastic'),
      json = {};

    client.get({
        index: 'mf',
        type: 'resources',
        id: 'current_state'
    }, function(error, response) {
        if (error) {
            res.status(500)
            return next(error);
        } else {
            json = response._source;
        }
        res.json(json);
    });
});

router.put('/', function(req, res, next) {
    var id = "current_state",
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic');

    var now = new Date();
    now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    req.body['@timestamp'] = now;

    client.index({
        index: 'mf',
        type: 'resources',
        id: id,
        body: req.body
    },function(error, response) {
        if (error !== 'undefined') {
            var json = {};
            json.href = mf_server + '/resources/';
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

module.exports = router;
