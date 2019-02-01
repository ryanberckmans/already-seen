
# Overview

Auto-hide social media links after you've seen them once. Auto-hiding occurs when you click "next" at the bottom of each page. Works with Old Reddit and Hacker News.

# How to use

1. install tampermonkey for Chrome or greasemonkey for Firefox
1. add already-seen to tampermonkey/greasemonkey by [clicking here](https://raw.githubusercontent.com/ryanberckmans/already-seen/master/dist/already-seen.user.js)
1. **security:** tampermonkey/greasemonkey can do anything with your browser and I recommend allowing it to run only on specific sites
    1. sites I allow tampermonkey to run on:
    1. `https://raw.githubusercontent.com/*` to install/update this script inside tampermonkey/greasemonkey
    1. `https://www.reddit.com/*` so this script works on reddit
    1. `https://news.ycombinator.com/*` so this script works on Hacker News

# Developers

## Testing tampermonkey script locally

Use `yarn dev` to test tampermonkey locally by installing a test script from a local webserver. (Open the webserver page and click the file to install the dev script to tampermonkey.)

* Requires that tampermonkey/greasemonkey be allowed to run on `http://127.0.0.1:38736/*`

## Toolchain

* tsc isn't a bundler, so we need a bundler
* wanted to try closure-compiler, which does optimizations and bundling, but leaves some comments in the output which breaks browser bookmarklets.
  * (previously this was targeting a bookmarklet before upgrading to tampermonkey; uglify-js used to remove the comments from closure-compiler output)
  * !! closure-compiler doesn't do src file discovery, so each dependency is manually added in package.json (just jquery right now)
  * closure-compiler's `-O ADVANCED` results in the script not compiling properly when used with tampermonkey. Currently using no `-O` flag.
