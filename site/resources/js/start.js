/* global moment, google */
(function (doc, win, $) {

  var
    autocomplete,
    event = {},
    environment = 'dev',
    eventsAPI = {
      dev: 'http://localhost:1989/events',
      staging: 'https://events-api.mofostaging.net/events',
      production: 'https://events-api.webmaker.org/events'
    },
    formFields = {},
    eventsFrontEnd = {
      dev: 'http://localhost:1981/events/',
      staging: 'https://events.mofostaging.net/events/',
      production: 'https://events.webmaker.org/events/'
    };

  switch (win.location.host) {
  case 'welcome.webmaker.org':
    environment = 'production';
    break;
  case 'welcome.mofostaging.net':
    environment = 'staging';
    break;
  default:
    environment = 'dev';
  }

  function findaPlace() {
    autocomplete = new win.google.maps.places.Autocomplete((doc.getElementById('address')), {
      types: ['geocode']
    });
    geolocate();
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      updateEventAddress();
    });
  }

  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = new win.google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
        autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
          geolocation));
      });
    }
  }

  function updateEventAddress() {

    var place = autocomplete.getPlace();

    event.address = place.formatted_address;
    event.latitude = place.geometry.location.B;
    event.longitude = place.geometry.location.k;
  }

  function submitForm(event) {
    event.preventDefault();

    var
      $estimatedAttendees = $('select[name="estimatedAttendees"]'),
      $address = $('#address'),
      webmakerLogin = function safeGetWebmakerLogin() {
        try {
          return JSON.parse(localStorage['webmaker-login']);
        } catch (e) {
          return null;
        }
      },
      $context = $(this);

    $('#submit-event').prop('disabled', true);

    $('input[name="beginDate"]').val(moment($('#datepicker').val(), 'MM/DD/YYYY h:mm A'));

    if ($address.val() === '') {
      handleErrors();
      return false;
    }

    if ($estimatedAttendees.find('option:selected').val() === '0') {
      handleErrors();
      return false;
    }

    $context.append('<input type="hidden" name="organizer" value="' + webmakerLogin().email + '" />');
    $context.append('<input type="hidden" name="organizerID" value="' + webmakerLogin().username + '" />');

    function compileInputs() {
      formFields[$(this).prop('name')] = $(this).val();
    }

    $('input[type="text"]').each(compileInputs);
    $('input[type="hidden"]').each(compileInputs);
    $('input[type="number"]').each(compileInputs);

    formFields.isEventPublic = false;
    formFields.estimatedAttendees = $estimatedAttendees.find('option:selected').val();

    deployPayload(JSON.stringify(formFields));
  }

  function handleErrors() {
    var
      $estimatedAttendees = $('select[name="estimatedAttendees"]'),
      $address = $('#address');

    if ($address.val() === '') {
      $address.addClass('error');
    }

    if ($estimatedAttendees.find('option:selected').val() === '0') {
      $estimatedAttendees.addClass('error');
    }
    $('#submit-event').prop('disabled', false);
  }

  function updateStep3(eventID) {
    $('#event-url').prop('href', eventsFrontEnd[environment] + eventID).text(eventsFrontEnd[environment] + eventID);
    $('#confirmed-event-location').text(formFields.address);
    $('#confirmed-event-date').text(moment(formFields.beginDate).format('LLL'));
    $('#confirmed-event-size').text($('#estimatedAttendees').find('option:selected').text());
  }

  function deployPayload(payload) {
    $.ajax(eventsAPI[environment], {
      data: payload,
      contentType: 'application/json',
      error: function () {
        $('#start-event-submission').prepend(
          '<div class="alert alert-danger">Something went wrong with the form submission. Please wait a moment and try again.</div>'
        );
        $('#submit-event').prop('disabled', false);
      },
      type: 'POST',
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        $('#step-2').fadeOut('slow').next().delay(500).fadeIn('slow');
        updateStep3(data.id);
      }
    });
  }

  function setUpWizard() {
    $('#datepicker').datetimepicker({
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-arrow-up",
        down: "fa fa-arrow-down"
      },
      minuteStepping: 15,
      defaultDate: moment().add(1, 'months').minutes(60)
    });

    $('a[href="/auth/login"]').on('click', function (e) {
      e.preventDefault();
      win.webmaker.auth.login();
    });

    $('.eventBtn').on('click', function (e) {
      e.preventDefault();

      var
        $fieldset = $('fieldset.hidden.' + e.target.id),
        eventName = $fieldset.find('.event')[0].innerHTML,
        eventIcon = $fieldset.find('.icon')[0].innerHTML,
        eventDescription = $fieldset.find('.description')[0].innerHTML;

      $('#step-1').fadeOut('slow').next().delay(500).fadeIn('slow');
      $('#submit-event').prop('disabled', false);
      $fieldset.appendTo('#start-event-submission');
      $('.event-title').text(eventName);
      $('.event-description').text(eventDescription);
      $('.event-icon').addClass(eventIcon);
    });

    $('#submit-event').on('click', submitForm);
  }

  function init() {
    if ($('.start-page').length > 0) {
      setUpWizard();
      findaPlace();
      $('#submit.event').prop('disabled', false);
      win.webmaker.auth.on('login', function () {
        $('#sign-in-form').hide();
        $('#start-event-submission').removeClass('hidden');
      });
    }

  }

  init();
})(document, window, jQuery);
