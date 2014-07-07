# This is how CSS works for landing pages

### Each template has its own css file in `pages/`.

Why? Because we can. No but really, we don't have to think about caching or http
requests, because theoretically users are visiting these pages once. Heck, they
probably won't ever see the same landing page twice. Further, the pages are
unlikely to use the same styles so really we don't want them caching some shared
style.css file.

So.

## How to generate a new less/css file

1. Start with your template. Have you created a new template? Then create a
corresponding less file in `pages/`. For easy reference, name it the same as the
template.
2. Include any bower resources you may need from `../../resources/vendors`, and
any components you may want from `../base` or `../components`.
3. It's a good idea to namespace your css here by giving the body of your
template a class. This can prevent any unwanted collisions when doing rapid
development of one-off landing pages that won't be rolled up into the main
codebase.
4. Add your file to the `gruntfile.js` in the `less` task like so:
```js
files: {
  '<%= landingpages.app %>/resources/compiled/webmaker.css': '<%= landingpages.app %>/less/pages/webmaker.less',
  '<%= landingpages.app %>/resources/compiled/sandstone.css': '<%= landingpages.app %>/less/pages/sandstone.less'
}
```
