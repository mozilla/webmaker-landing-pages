/* global WebmakerAuthClient */
(function (doc, win, $) {
  "use strict";

  win.webmaker = win.webmaker || {};
  win.webmaker.person = win.webmaker.person || {};

  var
    $login = $('#log-in-button'),
    $signup = $('#create-account-button');

  function continueSignupPath() {
    // upon successful login or completed signup redirect to corresponding
    // redirect page from template

    var
      $body = $('body');

    if ($body.data('redirect') !== undefined) {
      win.location.href = win.location.protocol + '//' + win.location.host + $body.data('redirect');
    }
  }

  function webmakerAuth() {
    var
      auth = new WebmakerAuthClient({
        host: '',
        paths: {
          authenticate: '/auth/authenticate',
          checkUsername: '/auth/check-username',
          create: '/auth/create',
          logout: '/auth/logout',
          verify: '/auth/verify'
        },
        audience: window.location.origin,
        prefix: 'webmaker-', // for local storage
        timeout: 10,
        handleNewUserUI: true // Do you want to auto-open/close the new user UI?
      });

    auth.on('login', function (userData, message) {
      win.webmaker.person = userData;
      continueSignupPath();
    });

    auth.on('logout', function () {
      win.webmaker.person = {};
    });

    win.webmaker.auth = auth;
  }

  function init() {
    $login.add($signup).on('click', win.webmaker.auth.login);
  }

  webmakerAuth();
  win.webmaker.auth.verify();

  if (doc.getElementById('webmaker-login-new-user') !== null) {
    init();
  }

})(document, window, jQuery);
