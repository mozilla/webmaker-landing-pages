/* global moment, google */
(function (doc, win, $) {

  var
    eventTags = ['wizard'],
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

  $('[data-href]').on('click', function () {
    window.location.hash = $(this).attr('data-href');
  });

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

    $context.append('<input type="hidden" name="organizer" value="' + win.webmaker.person.email + '" />');
    $context.append('<input type="hidden" name="organizerID" value="' + win.webmaker.person.username + '" />');

    function compileInputs() {
      formFields[$(this).prop('name')] = $(this).val();
    }

    $('input[type="text"]').each(compileInputs);
    $('input[type="hidden"]').each(compileInputs);
    $('input[type="number"]').each(compileInputs);

    formFields.isEventPublic = false;
    formFields.estimatedAttendees = $estimatedAttendees.find('option:selected').val();
    formFields.tags = eventTags;

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
    var eventURL = eventsFrontEnd[environment] + eventID;

    $('#event-url').prop('href', eventURL).text(eventURL);

    $('#share-twitter').attr('href', 'https://twitter.com/intent/tweet?text=Check%20out%20this%20event!&url=' + encodeURIComponent(eventURL) + '&via=webmaker&related=mozilla,webmaker');
    $('#share-facebook').attr('href', 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(eventURL));

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

  function showStep2(target, isDeepLink) {
    var
      $fieldset = $('fieldset.hidden.' + target),
      eventName = $fieldset.find('.event')[0].innerHTML,
      eventIcon = $fieldset.find('.icon')[0].innerHTML,
      eventDescription = $fieldset.find('.description')[0].innerHTML;

    eventTags.push(target);

    if (isDeepLink) {
      $('#step-1').hide().next().show();
    } else {
      $('#step-1').fadeOut('slow').next().delay(500).fadeIn('slow');
    }

    $('#submit-event').prop('disabled', false);
    $fieldset.appendTo('#start-event-submission');
    $('.event-title').text(eventName);
    $('.event-description').text(eventDescription);
    $('.event-icon').addClass(eventIcon);
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

    $('.eventBtn').on('click', function () {
      showStep2(this.id);
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

    function setPageFromHash() {
      var hash = window.location.hash;

      // If there's a deep link jump to step 2, otherwise show step 1
      if (hash && hash !== '#/') {
        showStep2(hash.split('#/')[1], true);
      } else {
        $('#step-1').show();
        $('#step-2').hide();
      }
    }

    $(window).on('hashchange', function () {
      if (window.location.hash !== '') {
        setPageFromHash();
      }
    });

    setPageFromHash();
  }

  init();
})(document, window, jQuery);
