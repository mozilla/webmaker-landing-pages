/* global WebmakerLogin */
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
    var auth = win.webmaker.auth = new WebmakerLogin({
      showCTA: false,
      paths: {
        authenticate: "/auth/authenticate",
        verify: "/auth/verify",
        logout: "/auth/logout"
      }
    });

    function login(userData) {
      win.webmaker.person = userData;
      continueSignupPath();
    }

    function logout() {
      win.webmaker.person = {};
    }

    auth.on('login', login);

    auth.on('verified', function (userData) {
      if (!userData) {
        return logout();
      }
      login(userData);
    });

    auth.on('logout', logout);
  }

  function init() {
    $login.on('click', function () {
      win.webmaker.auth.login();
    });

    $signup.on('click', function () {
      win.webmaker.auth.create();
    });
  }

  webmakerAuth();

  if (doc.getElementById('log-in-button') !== null) {
    init();
  }

})(document, window, jQuery);
