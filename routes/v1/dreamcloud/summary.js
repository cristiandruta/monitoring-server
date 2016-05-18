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

    /* (1) get deployment plan for the given hashvalue */
    /* (2) parse key experiments */
    /* (3) for each experiment, get
     *   (a)
     * */
    res.json(json);
});

module.exports = router;
