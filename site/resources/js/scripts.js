// little helper functions until we need something more organized

(function ($, doc, win) {

  function retinaImage() {
    function renderImage($image, source) {
      $image.attr('src', source);
    }

    var
      $win = $(win),
      retinaImages = $('img'),
      totalImages = retinaImages.length;

    while (totalImages--) {
      var $currentImage = $(retinaImages[totalImages]);
      if ($win.devicePixelRatio !== undefined && $win.devicePixelRatio >= 1.5) {
        renderImage($currentImage, $currentImage.attr('data-src-2x'));
      } else {
        renderImage($currentImage, $currentImage.attr('data-src-1x'));
      }
    }
  }

  function validateSignup() {
    var
      email = document.querySelector('#field1'),
      email_container = document.querySelector('div.email.input-group');

    email.addEventListener('invalid', function () {
      email_container.classList.add('has-error');
    });

    email.addEventListener('input', function () {
      if (email_container.classList.contains('has-error')) {
        email_container.classList.remove('has-error');
      }
    });

    var
      accept = document.querySelector('#allow_email'),
      accept_container = document.querySelector('div.accept.input-group');

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
    if (doc.querySelectorAll('img') !== null) {
      retinaImage();
    }

    if (doc.getElementsByClassName('form-section').length > 0) {
      validateSignup();
    }
  }

  init();

})(jQuery, document, window);
