/* global Masonry, imagesLoaded  */
(function (doc, win) {
  win.webmaker = win.webmaker || {};

  var
    wall = document.getElementById('partner-logos'),
    masonry = new Masonry(wall, {
      columnWidth: 250,
      gutter: 50,
      isFitWidth: true,
      itemSelector: '.partner-logo'
    });

  imagesLoaded(wall, function () {
    masonry.layout();
  });

})(document, window);
