(function ($, doc, win) {
  var
    $win = $(win),
    $greet = $('#greet'),
    contributorEmail = '',
    $madLibForm = $('#mad-lib-form'),
    $signupForm = $('#guided-landing-2014');

  function parseQueryString() {
    var
      i, qsKeyValue,
      queryString = {},
      queryStringRaw = win.location.search.substr(1).split('&');
    for (i = 0; i < queryStringRaw.length; i++) {
      qsKeyValue = queryStringRaw[i].split('=');
      queryString[qsKeyValue[0]] = qsKeyValue[1];
    }
    return queryString;
  }

  function hideSignup() {
    $greet.slideUp(400);
    win.setTimeout($greet.remove, 400);
  }

  function retrieveEmailAddress() {
    contributorEmail = parseQueryString().email || sessionStorage.getItem('wmEmail') || 'privatecontributor@webmaker.org';
    if (contributorEmail === 'privatecontributor@webmaker.org') {
      $greet.slideDown();
    } else {
      hideSignup();
    }
  }

  function submitSignup() {
    var
      payload = {
        email: $('[name="email"]').val(),
        'custom-2722': $('[name="custom-2722"]').val(),
        opt_in: 1
      },
      request = $.ajax({
        type: 'post',
        url: 'https://sendto.webmaker.org/page/signup/webmaker-firefox-snippet-survey',
        data: payload
      }),
      success = function (data, status, jqXHR) {},
      error = function (data, status, jqXHR) {},
      complete = function () {
        contributorEmail = payload.email;
        hideSignup();
      };
    request.then(success, error).always(complete);
  }

  function displayMakersteps() {
    if ($greet.length > 0) {
      hideSignup();
    }
    $('.mad-lib').hide();
    $('.post-mad-lib').slideDown();
    $('.makersteps-list').show();
    $win.scrollTop(0);
  }

  function submitContributors() {
    var
      friendname = $('[name="friendname"]').val(),
      $optInChecked = $('[name="opt_in"]:checked'),
      $email = $('[name="email"]'),
      alertTemplate = function (name) {
        return '<div class="alert alert-success"><p><span class="fa fa-check"></span> Great! We hope you' + (name ? ' and ' + name : '') + ' enjoy making together. Now get started with Step 1 below.</p></div>';
      },
      payload = {
        // double-check if a person is attempting to submit the email form and
        // the mad lib form at the same time
        email: ($email.val() !== '' && $optInChecked.length > 0) ? $email.val() : contributorEmail,
        'custom-2843': 1
      },
      request = $.ajax({
        type: 'post',
        url: 'https://sendto.webmaker.org/page/signup/2014-wm-ff-snippet-low-bar-cta-contributors',
        data: payload
      }),
      success = function (data, status, jqXHR) {
        displayMakersteps();
        $('.post-mad-lib').prepend(alertTemplate(friendname));
      },
      error = function (jqXHR, status, error) {
        $('body').append('<form id="backup-madlib-form" method="post" action="https://sendto.webmaker.org/page/signup/2014-wm-ff-snippet-low-bar-cta-contributors"><input type="hidden" value="' + payload.email + '" name="email" /><input type="hidden" value="1" name="custom-2843" /></form>');
        $('#backup-madlib-form').submit();
      };

    if ($email.val() !== '' && $optInChecked.length > 0) {
      submitSignup();
      request.then(success, error);
    } else {
      request.then(success, error).always(success);
    }
  }

  function submitMadLibs() {
    // Only submit anonymous data from MadLibs
    var
      payload = {
        'custom-2773': $('[name="placename"]').val(),
        'custom-2774': $('[name="whattolearn"]').val(),
        'custom-2775': $('[name="reasonstolearn"]').val(),
        'custom-2776': $('[name="whythewebisgreat"]').val()
      },
      request = $.ajax({
        url: '',
        data: payload
      }),
      success = function (data, status, jqXHR) {},
      error = function (data, status, jqXHR) {},
      complete = function () {};
    request.then(success, error).always(complete);
  }

  function applyListeners() {
    $madLibForm.on('submit', function (e) {
      e.preventDefault();
      submitContributors();

      // we currently aren't storing *any* mad lib data because we need to find
      // a safer, more anonymous place to put it, but if we were:
      //    win.submitMadLibs();

    });
    $('[rel="dismiss-mad-lib"]').on('click', function (e) {
      e.preventDefault();
      $('.mad-lib').hide();
      displayMakersteps();
    });
    $signupForm.on('click', '[rel="dismiss-signup"]', function (e) {
      e.preventDefault();
      hideSignup();
    });
    $signupForm.on('submit', function (e) {
      e.preventDefault();
      submitSignup();
    });
  }

  function initMadLib() {
    win.submitMadLibs = submitMadLibs;
    $('.makersteps-list').hide();
    $('.post-mad-lib').hide();
    $('#greet').hide();
    retrieveEmailAddress();
    applyListeners();
  }

  if (doc.getElementsByClassName('mad-lib').length > 0) {
    initMadLib();
  }

})(jQuery, document, window);
