var express = require('express');
var router = express.Router();
var async = require('async');
var dateFormat = require('dateformat');

router.get('/', function(req, res, next) {
    res.redirect('/v2/dreamcloud/mf/workflows?users');
});

router.get('/:id', function(req, res, next) {
    res.redirect('/v2/dreamcloud/mf/workflows/' + req.params.id + '?users');
});

/**
 * @api {put} /users/:id Register/Update a user's information
 * @apiVersion 1.0.0
 * @apiName PutUsers
 * @apiGroup Users
 *
 * @apiParam {String} id User identifier
 * @apiSuccess {String} href Link to the registered/updated user
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "href":"http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix"
 *     }
 *
 */
router.put('/:id', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        mf_server = req.app.get('mf_server') + '/mf',
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
        json.href = mf_server + '/users/' + id;
        res.json(json);
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

/**
 * @api {post} /users/:id/create Create a user and associated experiment
 * @apiVersion 1.0.0
 * @apiName PostUsers
 * @apiGroup Users
 *
 * @apiParam {String} id User identifier
 * @apiSuccess {String} experimentID Experiment identifier
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix/create
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          AVX9O-3oz5chEwIt8_M9
 *     }
 *
 */
router.post('/:id/create', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
    var id = req.params.id.toLowerCase(),
        client = req.app.get('elastic');

    var data = req.body;
    if (data.application) {
        data.application = data.application.replace(' ', '_');
    }
    var experiment_id;

    var created_on = {};
    var now = new Date();
    now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    created_on.created_on = now;

    if (!is_defined(data['@timestamp'])) {
        data['@timestamp'] = now;
    }

    async.series([
        /* (1) register workflow, if not exists yet */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'workflows',
                id: id,
                body: created_on
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
/**
 * @api {post} /users/:uid/:eid/create Create a user and associated experiment with an experiment ID
 * @apiVersion 1.0.0
 * @apiName PostUserExperiment
 * @apiGroup Users
 *
 * @apiParam {String} uid User identifier
 * @apiParam {String} eid Experiment identifier
 * @apiSuccess {String} eid The specified experiment identifier
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix/AVX9O-3oz5chEwIt8_M9/create
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          AVX9O-3oz5chEwIt8_M9
 *     }
 *
 */
router.post('/:uid/:eid/create', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
    var uid = req.params.uid.toLowerCase(),
        eid = req.params.eid,
        client = req.app.get('elastic');

    var data = req.body;
    if (data.application) {
        data.application = data.application.replace(' ', '_');
    }
    var experiment_id;

    var created_on = {};
    var now = new Date();
    now = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    created_on.created_on = now;

    if (!is_defined(data['@timestamp'])) {
        data['@timestamp'] = now;
    }

    async.series([
        /* (1) register workflow, if not exists yet */
        function(series_callback) {
            client.index({
                index: 'mf',
                type: 'workflows',
                id: uid,
                body: created_on
            }, function(error, response) {
                if (error) {
                    return series_callback(error);
                }

                series_callback(null);
            });
        },
        /* (2) create experiment ID on the fly */
        function(series_callback) {
            client.exists({
                index: 'mf',
                type: 'experiments',
                id: eid,
                routing: uid
            }, function (error, exists) {
                if (exists === true) {
                    experiment_id = eid;
                    series_callback(null);
                } else {
                    client.index({
                        index: 'mf',
                        type: 'experiments',
                        parent: uid,
                        id: eid,
                        body: data
                    }, function(error, response){
                        if(error) {
                            res.json(error);
                        } else {
                            experiment_id = response._id;
                            series_callback(null);
                        }
                    });
                }
            });
        }
    ], function(error) {
        if (error) {
            res.status(500);
            return next(error);
        }
        res.send(experiment_id);
    });
});

module.exports = router;
