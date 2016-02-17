var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require("os");
var elasticsearch = require('elasticsearch');
var elastic = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'trace'
});

var routes = require('./routes/index');
var workflows = require('./routes/workflows');
var experiments = require('./routes/experiments');
var profiles = require('./routes/profiles');
var metrics = require('./routes/metrics');
var runtime = require('./routes/runtime');
var progress = require('./routes/progress');
var energy = require('./routes/energy');
var deployments = require('./routes/deployments');
var statistics = require('./routes/statistics');
var resources = require('./routes/resources');
var status = require('./routes/status');
var report = require('./routes/report');
var users = require('./routes/users');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('elastic', elastic);
app.set('version', '1.0.2');
var port = '3030',
  prefix = '/dreamcloud/mf',
  hostname = os.hostname();
hostname = hostname.replace("http://fe", "http://mf");
app.set('prefix', prefix);
app.set('mf_server', 'http://' + hostname + ':' + port + prefix);
app.set('pwm_idx', 'dreamcloud_pwm_idx');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dreamcloud/mf', routes);
app.use('/dreamcloud/mf/workflows', workflows);
app.use('/mf/experiments', experiments);
app.use('/mf/profiles', profiles);
app.use('/mf/metrics', metrics);
app.use('/dreamcloud/mf/runtime', runtime);
app.use('/dreamcloud/mf/progress', progress);
app.use('/dreamcloud/mf/energy', energy);
app.use('/dreamcloud/mf/deployments', deployments);
app.use('/dreamcloud/mf/statistics', statistics);
app.use('/dreamcloud/mf/resources', resources);
app.use('/dreamcloud/mf/status', status);
app.use('/dreamcloud/mf/report', report);
app.use('/mf/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
  res.status(err.status || 500);
    var error = {};
    error.error = err;
    res.json(error);
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var error = {};
  error.error = err;
  res.json(error);
});


module.exports = app;
