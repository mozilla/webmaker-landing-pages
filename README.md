# Webmaker Landing Pages [![Build Status](https://travis-ci.org/mozilla/webmaker-landing-pages.svg?branch=master)](https://travis-ci.org/mozilla/webmaker-events-2)

### TL;DR

1. `git clone https://github.com/mozilla/webmaker-landing-pages/`
2. `cd webmaker-landing-pages`
3. `npm install`
4. `cp env.dist .env`
5. `grunt dev` (this will build the site & launch the local server on port 9006)


### Dev Dependencies

- Node.js >= 0.10.0 & `npm`
- `bower` (via `npm install -g bower`)
- `grunt` (via `npm install -g grunt-cli`)
- [Webmaker Login Server](https://github.com/mozilla/login.webmaker.org)

## Development

- `npm install && cp env.dist .env`
- Launch login.webmaker.org
- To run server: `grunt dev` (launch browser, <http://localhost:9006/>)
- Lint before committing. Read-only with `grunt validate`, or take your chances
on `grunt`.

#### Grunt Tasks

- `grunt` Cleans and verifies code.
- `grunt validate` Read-only version of above.
- `grunt dev` Builds the site into a temp directory, watches the folder, and launches the server.
- `grunt build` Builds the static site in `/build/`, generating these pages:
    - `/event/start/`
    - `/for/learners/`
    - `/for/mentors/`
    - `/for/pam/`
    - `/from/firefox-2014/`
    - `/from/mozilla/`
    - `/from/net-neutrality/`
    - `/get-started/`
    - `/make/lightson/`
    - `/partner/`
    - `/pledge/teach-the-web/`
    - `/pledge/teach-the-web/thank-you/`
    - `/sample-makersteps/`
    - `/signup/`
    - `/signup/hourofcode2014/`
    - `/signup/learners/`
    - `/signup/lightson/`
    - `/signup/mentors/`

### To Deploy

Travis takes care of that `;)`

Deploying relies on parallel deploys that both live behind the same CloudFront
distribution. One is the express server that runs here on your local dev, the
other is to an S3 bucket hosting the static pages (the result of `grunt build`).

## TODO, a potentially incomplete list (see [bugzilla [landingpages][techdebt]](https://bugzilla.mozilla.org/buglist.cgi?list_id=10687679&status_whiteboard_type=allwordssubstr&query_format=advanced&status_whiteboard=[landingpages]%20[techdebt]&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED))

- [ ] [Implement partials for signup forms](https://bugzilla.mozilla.org/show_bug.cgi?id=1036447)
- [ ] [Implement "server-side" makeapi nunjucks rendering of sample makes](https://bugzilla.mozilla.org/show_bug.cgi?id=1036456)
- [ ] Localisation? (a girl can dream!)
- [x] [Test linting and whatnot](https://bugzilla.mozilla.org/show_bug.cgi?id=1036445)
- [x] [Refactor `grunt watch` &/or `grunt connect:server` to run a little cooler](https://bugzilla.mozilla.org/show_bug.cgi?id=1036189)
- [x] Re-figure travis deploys
- [x] Decide whether or not to commit compiled site
- [x] Set up server to run in a `.server/` directory without usemin
