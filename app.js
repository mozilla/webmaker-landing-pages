var Habitat = require('habitat');

Habitat.load();

var env = new Habitat();
var config = {
  loginURL: env.get('LOGIN_URL'),
  secretKey: env.get('SECRET_KEY'),
  authLoginURL: env.get('AUTH_LOGIN_URL'),
  domain: env.get('COOKIE_DOMAIN'), // default undefined
  forceSSL: env.get('FORCE_SSL') // default false
};

var server = require('./server')(config);

server.listen(env.get('PORT'), function() {
  console.info('Landing pages server listening at http://localhost:%d', env.get('PORT'));
});
