
# **"I've already seen that..."** you think to yourself, dozens or hundreds of times per day

Auto-hide Reddit links after you've **seen them once**. :eyes:  (also Hacker News links)

<img src="https://raw.githubusercontent.com/ryanberckmans/already-seen/master/demo.png?sanitize=true&raw=true" />

99 links are hidden in this image.

* Hiding links is done automatically
* Easily toggle links show/hide if you need it
* Works on Old Reddit and Hacker News

## How to use

1. install browser extension [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox
1. **optional** security config: Tampermonkey/Greasemonkey have a lot of permissions, I recommend allowing it to run only on specific sites
    * sites I allow tampermonkey to run on:
        1. `https://raw.githubusercontent.com/*` to install/update this script in Tampermonkey/Greasemonkey
        1. `https://www.reddit.com/*` so this script works on reddit
        1. `https://news.ycombinator.com/*` so this script works on Hacker News
1. Install by clicking below. It works automatically!

## [Click here to install `already-seen` to Tampermonkey or Greasemonkey](https://raw.githubusercontent.com/ryanberckmans/already-seen/master/dist/already-seen.user.js)

## How does `already-seen` know when you've seen a link?

`already-seen` hides all links on the previous page after you click _"next page"_.

You can also click _"Hide links and close tab"_ at the bottom of each page instead of clicking _"next page"_.

## Developers

### Testing Tampermonkey script locally

Use `yarn dev` to test Tampermonkey locally by installing a test script from a local webserver. (Open the webserver page and click the file to install the dev script to Tampermonkey.)

* Requires that Tampermonkey/Greasemonkey have browser permissions to run on `http://127.0.0.1:38736/*`
* The `yarn dev` script installs to Tampermonkey with the name `already-seen-dev`; make sure to disable the regular `already-seen` while you're testing

### Toolchain

* tsc isn't a bundler, so we need a bundler
* I wanted to try closure-compiler, which does optimizations and bundling, but leaves some comments in the output which breaks browser bookmarklets.
  * (previously this was targeting a bookmarklet before upgrading to Tampermonkey; uglify-js used to remove the comments from closure-compiler output)
  * closure-compiler doesn't do src file discovery, so each dependency is manually added in package.json (just jquery right now)
  * closure-compiler's `-O ADVANCED` results in the script not compiling properly when used with Tampermonkey. Currently using no `-O` flag.
