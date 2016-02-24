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
  log: 'error'
});

/* root */
var routes = require('./routes/v1/index');

/* excess */
var users = require('./routes/v1/users');
var runtime = require('./routes/v1/runtime');
var statistics = require('./routes/v1/statistics');

/* dreamcloud */
var workflows = require('./routes/v1/dreamcloud/workflows');
var runtime_dreamcloud = require('./routes/v1/dreamcloud/runtime');
var progress = require('./routes/v1/dreamcloud/progress');
var energy = require('./routes/v1/dreamcloud/energy');
var deployments = require('./routes/v1/dreamcloud/deployments');
var statistics_dreamcloud = require('./routes/v1/dreamcloud/statistics');
var resources = require('./routes/v1/dreamcloud/resources');
var status = require('./routes/v1/dreamcloud/status');
var report = require('./routes/v1/dreamcloud/report');

/* excess and dreamcloud */
var experiments = require('./routes/v1/experiments');
var profiles = require('./routes/v1/profiles');
var profiles_dreamcloud = require('./routes/v1/dreamcloud/profiles');
var metrics = require('./routes/v1/metrics');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('elastic', elastic);
app.set('version', '1.0.2');
var port = '3030',
  hostname = os.hostname();
hostname = hostname.replace("http://fe", "http://mf");
app.set('mf_server', 'http://' + hostname + ':' + port);
app.set('pwm_idx', 'dreamcloud_pwm_idx');

//app.use(logger('combined'));
app.use(logger('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* root */
app.use('/', routes);
app.use('/v1/mf', routes);
app.use('/v1/dreamcloud/mf', routes);

/* excess */
app.use('/v1/mf/users', users);
app.use('/v1/mf/runtime', runtime);
app.use('/v1/mf/statistics', statistics);

/* dreamcloud */
app.use('/v1/dreamcloud/mf/workflows', workflows);
app.use('/v1/dreamcloud/mf/runtime', runtime_dreamcloud);
app.use('/v1/dreamcloud/mf/progress', progress);
app.use('/v1/dreamcloud/mf/energy', energy);
app.use('/v1/dreamcloud/mf/deployments', deployments);
app.use('/v1/dreamcloud/mf/statistics', statistics_dreamcloud);
app.use('/v1/dreamcloud/mf/resources', resources);
app.use('/v1/dreamcloud/mf/status', status);
app.use('/v1/dreamcloud/mf/report', report);

/* both */
app.use('/v1/mf/experiments', experiments);
app.use('/v1/mf/profiles', profiles);
app.use('/v1/mf/metrics', metrics);
app.use('/v1/dreamcloud/mf/experiments', experiments);
app.use('/v1/dreamcloud/mf/profiles', profiles_dreamcloud);
app.use('/v1/dreamcloud/mf/metrics', metrics);

/* catch 404 and forward to error handler */
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
