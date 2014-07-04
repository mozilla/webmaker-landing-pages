# Webmaker Landing Pages

### TL;DR

1. `git clone https://github.com/mozilla/webmaker-snippet-landing-page/`
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
- Caveat: because server is just running build over and over again, you'll
occasionally have to stop and restart it so the usemin config can reset itself

#### Grunt Tasks

- `grunt` Cleans and verifies code. Allegedly. Needs testing.
- `grunt validate` Read-only version of above. Also needs testing.
- `grunt build` Builds the static site in `/build/`.
- `grunt dev` Builds the site, watches the folder, and launches the server. Needs work too (see TODO).

### To Deploy

- `grunt build`
- Sync `/build` to the S3 bucket of your choice.

## TODO

- [ ] Re-figure travis deploys
- [x] Decide whether or not to commit compiled site
- [ ] Test linting and whatnot
- [ ] Implement partials for signup forms
- [ ] Set up server to run in a `.tmp/` directory without usemin
