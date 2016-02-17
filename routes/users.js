var express = require('express');
var router = express.Router();
var async = require('async');

router.put('/:id', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        mf_server = req.app.get('mf_server'),
        client = req.app.get('elastic');

    client.index({
        index: 'mf',
        type: 'workflows',
        id: id,
        body: req.body
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        var json = {};
        json.href = mf_server + '/workflows/' + id;
        res.json(json);
    });
});

router.get('/:id/create', function(req, res, next) {
    res.json("{ 'hello': 'world'}");
});

router.post('/:id/create', function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        mf_server = req.app.get('mf_server'),
        client = req.app.get('elastic');

    var data = req.body;
    var experiment_id;

    async.series([
        /* (1) register workflow, if not exists yet */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'workflows',
                id: id
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }

                series_callback(null);
            });
        },
        /* (2) create experiment ID on the fly */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'experiments',
                parent: id,
                body: data
            }, function(error, response) {
                if (error) {
                    res.json(error);
                } else {
                    experiment_id = response._id;
                    series_callback(null);
                }
            });
        },
    ], function(error) {
        if (error) {
            res.status(500);
            return next(error);
        }
        res.send(experiment_id);
    });
});

module.exports = router;
