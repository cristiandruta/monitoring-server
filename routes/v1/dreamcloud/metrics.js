var express = require('express');
var http = require('http');
var async = require('async');
var router = express.Router();

router.post('/', function(req, res, next) {
    var data = req.body,
      mf_server = req.app.get('mf_server'),
      client = req.app.get('elastic'),
      bulk_data = [];

    var tmp = {};
    tmp.index = {};
    for (i = 0; i != data.length; ++i) {
        var action = JSON.parse(JSON.stringify(tmp));
        var index = data[i].WorkflowID;
        if (data[i].TaskID) {
          index = index + '_' + data[i].TaskID;
        } else {
          index = index + '_all';
        }
        action.index._index = index.toLowerCase();
        action.index._type = data[i].ExperimentID;
        delete data[i].WorkflowID;
        delete data[i].ExperimentID;
        bulk_data.push(action);
        bulk_data.push(data[i]);
    }

    client.bulk({
        body: bulk_data
    },function(error, response) {
        if (error !== 'undefined') {
            var json = [];
            for (var i in response.items) {
                json.push(mf_server +
                  '/profiles/' +
                  response.items[i].create._index.replace('_all', '/all') +
                  '/' + response.items[i].create._type);
            }
            res.json(json);
        } else {
            res.json(error);
        }
    });
});

router.post('/:workflowID/:experimentID', function(req, res, next) {
    var workflowID = req.params.workflowID.toLowerCase(),
      experimentID = req.params.experimentID,
      mf_server = req.app.get('mf_server'),
      taskID = req.query.task.toLowerCase(),
      client = req.app.get('elastic'),
      index_missing = false;

    var index = workflowID;
    if (typeof taskID == 'undefined') {
        taskID = '_all';
    }

    index = workflowID + '_' + taskID;

    async.series([
        function(callback) {
            client.indices.exists({
                index: index
            }, function(error, response) {
                index_missing = !response;
                callback(null, '1=' + index_missing);
            });
        },
        function(callback) {
            var created = false;
            if (index_missing) {
                var headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': bodyString.length
                };

                var options = {
                    host: 'localhost',
                    path: '/' + index,
                    port: 9200,
                    method: 'PUT',
                    headers: headers
                };

                var http_request = http.request(options, function(res) {
                    res.setEncoding('utf-8');
                    res.on('data', function(data) {
                        console.log('incoming: ' + data);
                    });
                    res.on('end', function() {
                        callback(null, '2=created');
                    });
                });

                http_request.on('error', function(e) {
                    callback(null, '2=not_created');
                });

                http_request.write(bodyString);
                http_request.end();
            } else {
                callback(null, '2=exists');
            }
        },
        function(callback) {
            /* work-around for plug-ins sending the old timestamp format */
            if (req.body.Timestamp) {
                req.body['@timestamp'] = req.body.Timestamp;
                delete req.body.Timestamp;
            }
            client.index({
                index: index,
                type: experimentID,
                body: req.body
            },function(error, response) {
                if (error !== 'undefined') {
                    var json = {};
                    json[response._id] = {};
                    json[response._id].href = mf_server + '/profiles/' + workflowID;
                    if (typeof taskID !== 'undefined') {
                        json[response._id].href += '/' + taskID;
                    }
                    json[response._id].href += '/' + experimentID;
                    res.json(json);
                } else {
                    res.json(error);
                }
                callback(null, '3');
            });
        }
    ],
    function(err, results){
        //console.log(results);
    });
});

var bodyString =
'{' +
   '"dynamic_templates": [' +
      '{' +
         '"string_fields": {' +
            '"mapping": {' +
               '"index": "analyzed",' +
               '"omit_norms": true,' +
               '"type": "string",' +
               '"fields": {' +
                  '"raw": {' +
                     '"index": "not_analyzed",' +
                     '"ignore_above": 256,' +
                     '"type": "string"' +
                  '}' +
               '}' +
            '},' +
            '"match": "*",' +
            '"match_mapping_type": "string"' +
         '}' +
      '}' +
   '],' +
   '"_all": {' +
      '"enabled": true' +
   '},' +
   '"properties": {' +
      '"@timestamp": {' +
         '"enabled" : true,' +
         '"type":"date",' +
         '"format": "date_hour_minute_second_millis",' +
         '"store": true,' +
         '"path": "@timestamp"' +
      '},' +
      '"host": {' +
         '"type": "string",' +
         '"norms": {' +
            '"enabled": false' +
         '},' +
         '"fields": {' +
            '"raw": {' +
               '"type": "string",' +
               '"index": "not_analyzed",' +
               '"ignore_above": 256' +
            '}' +
         '}' +
      '},' +
      '"name": {' +
         '"type": "string",' +
         '"norms": {' +
            '"enabled": false' +
         '},' +
         '"fields": {' +
            '"raw": {' +
               '"type": "string",' +
               '"index": "not_analyzed",' +
               '"ignore_above": 256' +
            '}' +
         '}' +
      '},' +
      '"value": {' +
         '"type": "long",' +
         '"norms": {' +
            '"enabled": false' +
         '},' +
         '"fields": {' +
            '"raw": {' +
               '"type": "long",' +
               '"index": "not_analyzed",' +
               '"ignore_above": 256' +
            '}' +
         '}' +
      '}' +
   '}' +
'}';

module.exports = router;
