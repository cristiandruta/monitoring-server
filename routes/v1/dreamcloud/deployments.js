var crypto = require('crypto');
var express = require('express');
var router = express.Router();

router.get('/:workflow/:task/:platform', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workflow.toLowerCase(),
      task = req.params.task.toLowerCase(),
      platform = req.params.platform.toLowerCase(),
      mf_server = req.app.get('mf_server'),
      expand = req.query.expand,
      size = 1000,
      json = {};

    client.search({
        index: 'deployment_on_' + platform,
        type: workflow + '_' + task,
        searchType: 'count'
    }, function(error, response) {
        if (response.hits !== undefined) {
            size = response.hits.total;
        }

        client.search({
            index: 'deployment_on_' + platform,
            type: workflow + '_' + task,
            size: size,
        }, function(error, response) {
            if (error) {
                res.status(500);
                return next(error);
            }
            var results = response.hits.hits;
            var keys = Object.keys(results);
            keys.forEach(function(key) {
                var next_deployment = {};
                if (!is_defined(expand)) {
                    next_deployment.href = mf_server + '/dreamcloud/mf/deployments/' +
                        workflow + '/' + task + '/' + platform + '/' + results[key]._id;
                } else {
                    next_deployment = results[key]._source;
                }
                json[results[key]._id] = next_deployment;
            });
            res.json(json);
        });
    });
});

router.get('/:workflow/:task/:platform/:experiment', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workflow.toLowerCase(),
      task = req.params.task.toLowerCase(),
      platform = req.params.platform.toLowerCase(),
      experiment = req.params.experiment, /* we keep the original case */
      deployment = req.params.deployment,
      json = {};

    client.get({
        index: 'deployment_on_' + platform,
        type: workflow + '_' + task,
        id: experiment
    }, function(error, response) {
        if (error) {
            res.status(500);
            return next(error);
        }
        if (response.found) {
            json = response._source;
        } else {
            json = "Could not find the deployment plan for the given workflow";
        }
        res.json(json);
    });
});

router.put('/:workflow/:task/:platform/:experiment', function(req, res, next) {
    var workflow = req.params.workflow.toLowerCase(),
      task = req.params.task.toLowerCase(),
      platform = req.params.platform.toLowerCase(),
      experiment = req.params.experiment, /* we keep the original case */
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic'),
      hashvalue = '',
      json = {};

    /* generate hash for the request body */
    if (is_defined(req.body)) {
        var hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(req.body));
        hashvalue = hash.digest('hex');
    } else {
        res.json("body is missing");
        return;
    }

    client.exists({
        index: 'deployment_on_' + platform,
        type: workflow + '_' + task,
        id: hashvalue
    }, function(error, exists) {
        if (exists === true) {
            client.get({
                index: 'deployment_on_' + platform,
                type: workflow + '_' + task,
                id: hashvalue
            }, function(error, response) {
                /* add experiment to source.experiments array */
                var source = response._source;
                var experiments = source.experiments;
                experiments = ( typeof experiments != 'undefined' &&
                                experiments instanceof Object ) ? experiments : {};
                experiments[experiment] = 1;
                source.experiments = experiments;
                /* update document */
                client.index({
                    index: 'deployment_on_' + platform,
                    type: workflow + '_' + task,
                    id: hashvalue,
                    body: source
                },function(error, response) {
                    if (error) {
                        res.status(500);
                        return next(error);
                    }
                    json.deployment_id = hashvalue;
                    json.predicted_time = source.estimatedTime;
                    json.href = mf_server + '/dreamcloud/mf/deployments/' +
                        workflow + '/' + task + '/' + platform + '/' + hashvalue;
                    res.json(json);
                });
            });
        } else { /* index new deployment plan */
            var source = req.body;
            source.experiments = { experiment: 1 };
            client.index({
                index: 'deployment_on_' + platform,
                type: workflow + '_' + task,
                id: hashvalue,
                body: source
            },function(error, response) {
                if (error) {
                    res.status(500);
                    return next(error);
                }
                json.deployment_id = hashvalue;
                json.predicted_time = source.estimatedTime;
                json.href = mf_server + '/dreamcloud/mf/deployments/' +
                    workflow + '/' + task + '/' + platform + '/' + hashvalue;
                res.json(json);
            });
        }
    });
});

function is_defined(variable) {
    return (typeof variable !== 'undefined');
}

module.exports = router;
