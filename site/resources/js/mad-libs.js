(function ($, doc, win) {
  var
    $win = $(win),
    contributorEmail = '',
    optIn = false,
    $madLibForm = $('#mad-lib-form'),
    $signupForm = $('#guided-landing-2014');

  function parseQueryString() {
    var i, qsArray, qs = {},
      qsRaw = win.location.search.substr(1).split('&');
    for (i = 0; i < qsRaw.length; i++) {
      qsArray = qsRaw[i].split('=');
      qs[qsArray[0]] = qsArray[1];
    }
    return qs;
  }

  function retrieveEmailAddress() {
    // Immediately on pageload see if we stored email address in survey or check
    // to see if it's in querystring

    contributorEmail = parseQueryString().email || sessionStorage.getItem('wmEmail') || 'privatecontributor@webmaker.org';

    if (contributorEmail === 'privatecontributor@webmaker.org') {
      $('#greet').slideDown();
    } else {
      optIn = true;
    }
  }

  function submitContributors() {
    var
      $greet = $('#greet'),
      email = optIn === true ? $('[name="email"]').val() !== '' || contributorEmail : 'privatecontributor@webmaker.org',
      payload = {
        email: email,
        'custom-2843': 1
      },
      request = $.ajax({
        type: 'get',
        url: 'https://sendto.webmaker.org/page/signup/2014-wm-ff-snippet-low-bar-cta-contributors',
        data: payload
      }),
      success = function (data, status, jqXHR) {
        if ($greet.length > 0) {
          $greet.remove();
        }
        $('.post-mad-lib').slideDown();
        $('.makersteps-list').show();
        $win.scrollTop(0);
      },
      error = function (data, status, jqXHR) {
        $('body').append('<form id="backup-madlib-form" method="post" action="https://sendto.webmaker.org/page/signup/2014-wm-ff-snippet-low-bar-cta-contributors"><input type="hidden" value="' + email + '" name="email" /><input type="hidden" value="1" name="custom-2843" /></form>');
        $('#backup-madlib-form').submit();
      };
    request.then(success, error);
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
        url: 'https://sendto.mozilla.org/page/signup/2014-wm-ff-snippet-thanks-for-trying-out-thimble',
        data: payload
      }),
      success = function (data, status, jqXHR) {},
      error = function (data, status, jqXHR) {},
      complete = function () {};
    request.then(success, error).always(complete);
  }

  function hideSignup(e) {
    e.preventDefault();
    var
      $greet = $('#greet'),
      $email = $('[name="email"]').val();
    contributorEmail = $email.val() !== '' ? $email.val() : contributorEmail;
    optIn = optIn === false ? $('[name="opt_in"]:checked').length > 0 === true : true;

    $greet.slideUp(400);
    win.setTimeout($greet.remove, 400);
  }

  function moveToMakersteps() {
    var
      friendname = $('[name="friendname"]').val(),
      alertTemplate = function (name) {
        return '<div class="alert alert-success"><p><span class="fa fa-check"></span> Great! We hope you' + (name ? ' and ' + name : '') + ' enjoy making together. Now get started with Step 1 below.</p></div>';
      };
    submitContributors();
    // we currently aren't storing *any* mad lib data because we need to find
    // a safer, more anonymous place to put it
    //    win.submitMadLibs();
    $('.mad-lib').hide(0);
    $('.post-mad-lib').prepend(alertTemplate(friendname));
  }

  function applyListeners() {
    $madLibForm.on('submit', function (e) {
      e.preventDefault();
      moveToMakersteps();
    });
    $('[rel="close-mad-lib"]').on('click', function (e) {
      e.preventDefault();
      moveToMakersteps();
    });
    $signupForm.on('click', '[rel="dismiss-signup"]', hideSignup);
  }

  function initMadLib() {
    win.submitMadLibs = submitMadLibs;
    $('.makersteps-list').hide(0);
    $('.post-mad-lib').hide(0);
    $('#greet').hide(0);
    retrieveEmailAddress();
    applyListeners();
  }

  if (doc.getElementsByClassName('mad-lib').length > 0) {
    initMadLib();
  }

})(jQuery, document, window);
