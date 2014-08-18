var express = require('express');
var path = require('path');
var WebmakerLogin = require('webmaker-auth');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');

module.exports = function(config) {
  var app = express();

  var login = new WebmakerLogin({
    loginURL: config.LOGIN_URL,
    secretKey: config.SECRET_KEY,
    authLoginURL: config.AUTH_LOGIN_URL,
    domain: config.COOKIE_DOMAIN, // default undefined
    forceSSL: config.FORCE_SSL, // default false
    refreshTime: 1000 * 60 * 5 // default 15 minutes
  });

  app.use(morgan('dev'));
  app.use(compression());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.use(login.cookieParser());
  app.use(login.cookieSession());

  app.post('/verify', login.handlers.verify);
  app.post('/authenticate', login.handlers.authenticate);
  app.post('/create', login.handlers.create);
  app.post('/logout', login.handlers.logout);
  app.post('/check-username', login.handlers.exists);

  app.use('/', express.static(path.join(__dirname, '../.server')));

  return app;
};
