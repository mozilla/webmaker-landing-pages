/* global Make, Mustache */
(function ($, win) {
  win.webmaker = win.webmaker || {};

  function generateGravatar(hash) {
    var
      defaultAvatar = "https%3A%2F%2Fstuff.webmaker.org%2Favatars%2Fwebmaker-avatar-44x44.png",
      defaultSize = 44;
    return "https://secure.gravatar.com/avatar/" + hash + "?s=" + defaultSize + "&d=" + defaultAvatar;
  }

  function filterTags(tags) {
    var
      totalTags = tags.length,
      filter = /^tutorial-/,
      resultArray = [];

    while (totalTags--) {
      var context = tags[totalTags];
      if (!context.match(filter)) {
        resultArray.push(decodeURIComponent(context));
      }
    }
    return resultArray;
  }

  function likeNoun(likes) {
    if (likes) {
      var likesText;

      switch (likes.length) {
      case 0:
        likesText = 'Likes';
        break;
      case 1:
        likesText = 'Like';
        break;
      default:
        likesText = 'Likes';
      }
      return likesText;
    }
  }

  function updateRemixLinks(make) {
    var
      links = $('[data-remix-link]'),
      totalLinks = links.length;
    while (totalLinks--) {
      var $context = $(links[totalLinks]);
      $context.attr('href', make.remixurl);
    }
  }

  function findMake() {
    var
      makeapi = new Make({
        apiURL: "https://makeapi.webmaker.org"
      }),
      template = '<article class="make sample-make">' +
      '<a href="{{ url }}">' +
      '<img src="{{ thumbnail }}" alt="{{ title }}" class="make-thumbnail"/>' +
      '</a>' +
      '<div class="gallery-info">' +
      '<h3>' +
      '<a class="title" href="{{ url }}">' +
      '{{ title }}' +
      '</a>' +
      '</h3>' +
      '<div class="make-meta">' +
      '<img class="data-avatar pull-left" alt="{{ username }}" src="' + generateGravatar('{{ emailHash }}') + '" data-email-hash="{{ emailHash }}"/>' +
      '<p>' +
      'Created by ' +
      '<a class="author" href="https://webmaker.org/u/{{ username }}">' +
      '@{{ username }}' +
      '</a>' +
      '<time class="date" datetime="{{ createdAt }}"></time>, ' +
      '{{ likes }}'.length + ' ' + likeNoun('{{ likes }}') +
      '</p>' +
      '<p>{{ description }}</p>' +
      '</div>' +
      '<div class="tag-container">' +
      '<span class="fa fa-tags"></span>' +
      '{{ #tags }}' +
      '<a class="tag" href="https://webmaker.org/t/{{ . }}">{{ . }}</a>' +
      '{{ /tags }}' +
      '</div>' +
      '<div class="make-actions btn-container">' +
      '<a class="btn btn-primary" href="{{ remixurl }}">' +
      '<span class="fa fa-code-fork"></span> Remix' +
      '</a> ' +
      '<a class="btn btn-primary" href="{{ url }}">Details</a>' +
      '</div>' +
      '</div>' +
      '</article>',
      $makeGallery = $('#make-gallery');

    makeapi.id($makeGallery.data('make-id')).then(function (error, makes) {
      if (error) {
        return;
      }

      var
        selectedMake, output;

      selectedMake = makes[0];
      selectedMake.tags = filterTags(selectedMake.tags);

      output = Mustache.render(template, selectedMake);
      $makeGallery.html(output);
      updateRemixLinks(selectedMake);
    });
  }

  if ($('#make-gallery').length > 0) {
    findMake();
  }

  win.findMake = findMake;
})(jQuery, window);
