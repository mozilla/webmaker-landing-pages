# HEY THIS IS IMPORTANT

If your page doesn’t include a redirect (requires the `redirect` key in the
front matter of the source file, as well as `<body class="foo"{% if redirect %} data-redirect="{{ redirect }}"{% endif %}>`
in the corresponding template) then all signup pages will automatically redirect
to a page of the same name in the `/explore/` directory.
