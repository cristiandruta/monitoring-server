var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require("os");
var elasticsearch = require('elasticsearch');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var elastic = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

/* root */
var routes = require('./routes/v2/index');

/* excess */
var users = require('./routes/v2/users');
var runtime = require('./routes/v2/runtime');
var statistics = require('./routes/v2/statistics');

/* dreamcloud */
var workflows = require('./routes/v2/dreamcloud/workflows');
var runtime_dreamcloud = require('./routes/v2/dreamcloud/runtime');
var progress = require('./routes/v2/dreamcloud/progress');
var energy = require('./routes/v2/dreamcloud/energy');
var deployments = require('./routes/v2/dreamcloud/deployments');
var statistics_dreamcloud = require('./routes/v2/dreamcloud/statistics');
var resources = require('./routes/v2/dreamcloud/resources');
var status = require('./routes/v2/dreamcloud/status');
var report = require('./routes/v2/dreamcloud/report');
var summary = require('./routes/v2/dreamcloud/summary');

/* excess and dreamcloud */
var experiments = require('./routes/v2/experiments');
var profiles = require('./routes/v2/profiles');
var profiles_dreamcloud = require('./routes/v2/dreamcloud/profiles');
var metrics = require('./routes/v2/metrics');
var units = require('./routes/v2/units');
var servertime = require('./routes/v2/servertime');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('elastic', elastic);
app.set('version', '16.6');
var port = '3030',
  hostname = os.hostname();
// redirect backend hostname to front-end
hostname = hostname.replace('be.excess-project.eu', 'mf.excess-project.eu');
app.set('mf_server', 'http://' + hostname + ':' + port + '/v2');
app.set('pwm_idx', 'power_dreamcloud');

//app.use(logger('combined'));
app.use(logger('combined', {
  skip: function (req, res) { return res.statusCode < 400; }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/* root */
app.use('/', routes);
app.use('/v2/mf', routes);
app.use('/v2/dreamcloud/mf', routes);

/* excess */
app.use('/v2/mf/users', users);
app.use('/v2/mf/runtime', runtime);
app.use('/v2/mf/statistics', statistics);

/* dreamcloud */
app.use('/v2/dreamcloud/mf/workflows', workflows);
app.use('/v2/dreamcloud/mf/runtime', runtime_dreamcloud);
app.use('/v2/dreamcloud/mf/progress', progress);
app.use('/v2/dreamcloud/mf/energy', energy);
app.use('/v2/dreamcloud/mf/deployments', deployments);
app.use('/v2/dreamcloud/mf/statistics', statistics_dreamcloud);
app.use('/v2/dreamcloud/mf/resources', resources);
app.use('/v2/dreamcloud/mf/status', status);
app.use('/v2/dreamcloud/mf/report', report);
app.use('/v2/dreamcloud/mf/summary', summary);

/* both */
app.use('/v2/mf/time', servertime);
app.use('/v2/mf/experiments', experiments);
app.use('/v2/mf/profiles', profiles);
app.use('/v2/mf/metrics', metrics);
app.use('/v2/mf/units', units);
app.use('/v2/dreamcloud/mf/experiments', experiments);
app.use('/v2/dreamcloud/mf/profiles', profiles_dreamcloud);
app.use('/v2/dreamcloud/mf/metrics', metrics);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    var error = {};
    error.error = err;
    res.json(error);
  });
}

// production error handler
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  var error = {};
  error.error = err;
  res.json(error);
});

module.exports = app;
