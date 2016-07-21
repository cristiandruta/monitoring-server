var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

router.get('/', function(req, res, next) {
    var client = req.app.get('elastic'),
        mf_server = req.app.get('mf_server'),
        details = req.query.expand,
        size = 1000,
        json = {};

    client.search({
        index: 'mf',
        type: 'resources',
        searchType: 'count'
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response.hits != undefined) {
            size = response.hits.total;
        }

        client.search({
            index: 'mf',
            type: 'resources',
            size: size
        }, function(error, response) {
            if (error) {
                res.status(500);
                return next(error);
            }
            if (response.hits != undefined) {
                var results = response.hits.hits;
                if (is_defined(details)) {
                    json = get_details(results);
                } else {
                    json = get_resource(mf_server, results);
                }
            }
            res.json(json);
        });
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

function get_details(results) {
    var keys = Object.keys(results),
      item = {},
      response = {};
    keys.forEach(function(key) {
        item = results[key]._source;
        response[results[key]._id] = item;
    });
    return response;
}

function get_resource(mf_server, results) {
    var keys = Object.keys(results),
      platform = '',
      response = {};
    keys.forEach(function(key) {
        platform = results[key]._id
        var json = {};
        json.href = mf_server + '/dreamcloud/mf/resources/' + platform;
        response[platform] = json;
    });
    return response;
}

router.get('/:id', function(req, res, next) {
    var client = req.app.get('elastic'),
      id = req.params.id.toLowerCase(),
      json = {};

    client.get({
        index: 'mf',
        type: 'resources',
        id: id
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

router.put('/:id', function(req, res, next) {
    var mf_server = req.app.get('mf_server'),
      id = req.params.id.toLowerCase(),
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
            json.href = mf_server + '/dreamcloud/mf/resources/' + id;
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

module.exports = router;
