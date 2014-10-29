var express = require('express');
var path = require('path');
var WebmakerLogin = require('webmaker-auth');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');

module.exports = function(config) {
  var app = express();

  var login = new WebmakerLogin(config);

  app.use(morgan('dev'));
  app.use(compression());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.use(login.cookieParser());
  app.use(login.cookieSession());

  app.post('/auth/authenticate', login.handlers.authenticate);
  app.post('/auth/logout', login.handlers.logout);
  app.post('/auth/verify', login.handlers.verify);
  app.post('/auth/v2/create', login.handlers.createUser);
  app.post('/auth/v2/uid-exists', login.handlers.uidExists);
  app.post('/auth/v2/request', login.handlers.request);
  app.post('/auth/v2/authenticateToken', login.handlers.authenticateToken);
  app.post('/auth/v2/verify-password', login.handlers.verifyPassword);
  app.post('/auth/v2/request-reset-code', login.handlers.requestResetCode);
  app.post('/auth/v2/reset-password', login.handlers.resetPassword);

  app.use('/', express.static(path.join(__dirname, '../.server')));

  return app;
};
