# Webmaker Landing Pages

### TL;DR

1. `git clone https://github.com/mozilla/webmaker-landing-pages/`
2. `npm install`
3. `grunt dev` (this will build the site & launch the local server on port 9006)


### Dev Dependencies

- Node.js >= 0.8.0 & `npm`
- `bower` (via `npm install -g bower`)
- `grunt` (via `npm install -g grunt-cli`)

### Local Dev

- `npm install`
- To run server: `grunt dev` (launch browser, <http://localhost:9006/>)
- [WIP] Lint before committing. Read-only with `grunt validate`, or take your
chances on `grunt`.
- Caveat: Either `grunt watch` or `grunt connect:server` are running hot, so you
may wish to watch your processor temp/fan speed closely

#### Grunt Tasks

- `grunt` Cleans and verifies code. Allegedly. Needs testing.
- `grunt validate` Read-only version of above. Also needs testing.
- `grunt build` Builds the static site in `/build/`.
- `grunt dev` Builds the site, watches the folder, and launches the server. Needs work too (see TODO).

### To Deploy

- `grunt build`
- Sync `/build` to the S3 bucket of your choice.

## TODO, a potentially incomplete list (see [bugzilla [landingpages][techdebt]](https://bugzilla.mozilla.org/buglist.cgi?list_id=10687679&status_whiteboard_type=allwordssubstr&query_format=advanced&status_whiteboard=[landingpages]%20[techdebt]&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED))

- [ ] [Test linting and whatnot](https://bugzilla.mozilla.org/show_bug.cgi?id=1036445)
- [ ] [Refactor `grunt watch` &/or `grunt connect:server` to run a little cooler](https://bugzilla.mozilla.org/show_bug.cgi?id=1036189)
- [ ] [Implement partials for signup forms](https://bugzilla.mozilla.org/show_bug.cgi?id=1036447)
- [ ] [Implement "server-side" makeapi nunjucks rendering of sample makes](https://bugzilla.mozilla.org/show_bug.cgi?id=1036456)
- [ ] Localisation? (a girl can dream!)
- [x] Re-figure travis deploys
- [x] Decide whether or not to commit compiled site
- [x] Set up server to run in a `.server/` directory without usemin
