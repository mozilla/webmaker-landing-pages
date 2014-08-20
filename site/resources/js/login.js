/* global WebmakerAuthClient */
(function (doc, win, $) {
  "use strict";

  win.webmaker = win.webmaker || {};
  win.webmaker.person = win.webmaker.person || {};

  var
    $login = $('#log-in-button'),
    $signup = $('#create-account-button');

  function webmakerAuth() {
    var
      auth = new WebmakerAuthClient({
        host: '',
        paths: {
          authenticate: '/authenticate',
          create: '/create',
          verify: '/verify',
          logout: '/logout'
        },
        audience: window.location.origin,
        prefix: 'webmaker-', // for local storage
        timeout: 10,
        handleNewUserUI: true // Do you want to auto-open/close the new user UI?
      });

    auth.on('login', function (userData, message) {
      win.webmaker.person = userData;

      if (message === undefined || 'user created') {
        console.log('// Continue signup path here');
      }
    });

    auth.on('logout', function () {
      win.webmaker.person = {};
    });

    win.webmaker.auth = auth;
  }

  function init() {
    webmakerAuth();
    $login.add($signup).on('click', win.webmaker.auth.login);
    $(doc).on('load', win.webmaker.auth.verify);
  }

  if (doc.getElementById('signup-page-info') !== null) {
    init();
  }

})(document, window, jQuery);
