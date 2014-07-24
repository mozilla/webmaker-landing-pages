// little helper functions until we need something more organized

(function (doc, win) {
  win.webmaker = win.webmaker || {};

  function retinaImage() {
    function renderImage(image, source) {
      if (source !== null) {
        image.setAttribute('src', source);
      }
    }

    var
      retinaImages = doc.getElementsByTagName('img'),
      totalImages = retinaImages.length;

    while (totalImages--) {
      var
        currentImage = retinaImages[totalImages];
      if (win.devicePixelRatio !== undefined && win.devicePixelRatio >= 1.5) {
        renderImage(currentImage, currentImage.getAttribute('data-src-2x'));
      } else {
        renderImage(currentImage, currentImage.getAttribute('data-src-1x'));
      }
    }
  }

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

  function applySourceCodes() {
    var
      bsdForms = doc.getElementsByClassName('bsd-form'),
      totalBsdForms = bsdForms.length,
      queryString = parseQueryString(),
      createHiddenInput = function (key, value) {
        var
          input = doc.createElement('input');

        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', value);
        return input;
      };
    while (totalBsdForms--) {
      if (queryString.source) {
        bsdForms[totalBsdForms].appendChild(createHiddenInput('source', queryString.source));
      }
      if (queryString.subsource) {
        bsdForms[totalBsdForms].appendChild(createHiddenInput('subsource', queryString.subsource));
      }
    }
  }

  function validateSignup() {
    var
      email = doc.getElementById('field1'),
      email_container = doc.querySelector('div.email.input-group');

    email.addEventListener('invalid', function () {
      email_container.classList.add('has-error');
    });

    email.addEventListener('input', function () {
      if (email_container.classList.contains('has-error')) {
        email_container.classList.remove('has-error');
      }
    });

    var
      accept = doc.getElementById('allow_email'),
      accept_container = doc.querySelector('div.accept.input-group');

    accept.addEventListener('invalid', function () {
      accept_container.classList.add('has-error');
    });

    accept.addEventListener('change', function () {
      if (accept_container.classList.contains('has-error')) {
        accept_container.classList.remove('has-error');
      }
    });
  }

  function init() {
    win.webmaker.parseQueryString = parseQueryString;

    applySourceCodes();

    if (doc.getElementsByTagName('img').length > 0) {
      retinaImage();
    }

    if (doc.getElementsByClassName('form-section').length > 0) {
      validateSignup();
    }
  }

  init();

})(document, window);
