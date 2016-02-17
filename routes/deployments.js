var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic'),
      size = 1000,
      json = {};

    client.search({
        index: 'mf',
        type: 'deployments',
        searchType: 'count'
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        } else {
            size = response.hits.total;
        }

        client.search({
            index: 'mf',
            type: 'deployments',
            size: size
        }, function(error, response) {
            if (error) {
                res.status(500);
                return next(error);
            } else {
                var results = response.hits.hits;
                json = get_deployments(results, mf_server);
            }
            res.json(json);
        });
    });
});

function get_deployments(results, mf_server) {
    var keys = Object.keys(results),
      workflow = '',
      response = {};
    keys.forEach(function(key) {
        workflow = results[key]._id
        var json = {}
        json.href = mf_server + '/deployments/' + workflow;
        response[workflow] = json;
    });
    return response;
}

router.get('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
      client = req.app.get('elastic'),
      json = {};

    client.get({
        index: 'mf',
        type: 'deployments',
        id: id
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        } else {
            json = response._source;
        }
        res.json(json);
    });
});

router.put('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic');

    client.index({
        index: 'mf',
        type: 'deployments',
        id: id,
        body: req.body
    },function(error, response) {
        if (error !== 'undefined') {
            var json = {};
            json.href = mf_server + '/deployments/' + id;
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

router.post('/', function(req, res, next) {
    var data = req.body,
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic'),
      bulk_data = [];

    var tmp = {};
    tmp.index = {};
    tmp.index['_index'] = 'mf';
    tmp.index['_type'] = 'deployments';
    for (i = 0; i != data.length; ++i) {
        var action = JSON.parse(JSON.stringify(tmp));
        action.index['_id'] = data[i]['DeploymentID'].toLowerCase();
        delete data[i]['DeploymentID'];
        bulk_data.push(action);
        bulk_data.push(data[i]);
    }

    client.bulk({
        body: bulk_data
    },function(error, response) {
        if (error !== 'undefined') {
            var json = [];
            for (i in response.items) {
                console.log(response.items[i]);
                json.push(mf_server + '/deployments/' + response.items[i].index['_id']);
            }
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

module.exports = router;