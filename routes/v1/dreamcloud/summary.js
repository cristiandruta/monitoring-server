var express = require('express');
var router = express.Router();

router.get('/:workflow/:task/:platform:/:deployment', function(req, res, next) {
    var client = req.app.get('elastic'),
      workflow = req.params.workflow.toLowerCase(),
      task = req.params.task.toLowerCase(),
      platform = req.params.platform.toLowerCase(),
      deployment = req.params.deployment, /* we keep the original case */
      mf_server = req.app.get('mf_server'),
      expand = req.query.expand,
      json = {};

    /* retrieve all experiment summaries that have this deployment */

    /* (1) get deployment plan */
    /* (2) get hash value */
    /* (3) find all experiments having this deployment plan */
    res.json(json);
});

module.exports = router;
