var express = require('express');
var router = express.Router();
var async = require('async');

router.get('/:workID', function(req, res, next) {
    var wID = req.params.workID;
    res.redirect('/v1/mf/profiles/' + wID + '?dreamcloud');
});

router.get('/:workID/:taskID', function(req, res, next) {
    var wID = req.params.workID,
        tID = req.params.taskID;
    res.redirect('/v1/mf/profiles/' + wID + '/' + tID + '?dreamcloud');
});


router.get('/:workID/:taskID/:expID', function(req, res, next) {
    var wID = req.params.workID,
        tID = req.params.taskID,
        eID = req.params.expID;
    res.redirect('/v1/mf/profiles/' + wID + '/' + tID + '/' + eID);
});

module.exports = router;