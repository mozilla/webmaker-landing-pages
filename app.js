var Habitat = require('habitat');

Habitat.load();

var env = new Habitat();
var config = {
  LOGIN_URL: env.get('LOGIN_URL'),
  SECRET_KEY: env.get('SECRET_KEY'),
  AUTH_LOGIN_URL: env.get('AUTH_LOGIN_URL'),
  DOMAIN: env.get('COOKIE_DOMAIN'), // default undefined
  FORCE_SSL: env.get('FORCE_SSL') // default false
};

var server = require('./server')(config);

server.listen(env.get('PORT'), function() {
  console.info('Landing pages server listening at http://localhost:%d', env.get('PORT'));
});
