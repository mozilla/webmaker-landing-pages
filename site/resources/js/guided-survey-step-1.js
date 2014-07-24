(function ($, doc, win) {

  var
    baseUrl = win.location.protocol + '//' + win.location.host,
    mentorPath = '/for/mentors/',
    learnerPath = '/for/learners/',
    $form = $('#guided-landing-2014');

  function setRedirectUrl() {
    var
      response = $('[name="custom-2722"]:checked').val();
    if (response === 'yeshelplearn' || response === 'yesproteacher') {
      $('[name="redirect_url"]').val(baseUrl + mentorPath);
    } else {
      $('[name="redirect_url"]').val(baseUrl + learnerPath);
    }
  }

  function setNextStep() {
    var
      response = $('[name="custom-2722"]:checked').val();
    if (response === 'yeshelplearn' || response === 'yesproteacher') {
      return baseUrl + mentorPath;
    } else {
      return baseUrl + learnerPath;
    }
  }

  function postEmailAddress() {
    var
      payload = {
        email: $('#email-address').val(),
        'custom-2722': $('[name="custom-2722"]:checked').val(),
        opt_in: 1,
        redirect_url: $('[name="redirect_url"]').val()
      },
      request = $.ajax({
        type: 'post',
        url: 'https://sendto.webmaker.org/page/signup/webmaker-firefox-snippet-survey',
        data: payload
      }),
      success = function (data, status, jqXHR) {},
      error = function (data, status, jqXHR) {
        $form.off().submit();
      },
      complete = function () {
        sessionStorage.setItem('wmEmail', payload.email);
        win.location = setNextStep();
      };
    request.then(success, error).always(complete);
  }

  function init() {
    win.postEmailAddress = postEmailAddress;
    $form.on('change', '[name="custom-2722"]', setRedirectUrl);
    $form.on('submit', function (e) {
      e.preventDefault();
      win.postEmailAddress();
    });
  }

  if (doc.getElementById('guided-landing-2014') !== null) {
    init();
  }

})(jQuery, document, window);
