
# Overview

Auto-hides reddit links you saw already. Extensible to similar sites like hacker news.

# How to use

## With Chrome extension tampermonkey to auto-exec this js every reddit page load

* install tampermonkey
* **security** go to reddit.com, right click on tampermonkey icon and restriction execution to reddit.com only at the chrome level
* create a new tampermonkey script like:

```
// ==UserScript==
// @name         already-seen
// @namespace    http://noric.org
// @version      0.1
// @description  auto-hide reddit links you saw already. Auto-hiding occurs when you click "next" at bottom of page. Built for old reddit.
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
  // TODO run `yarn && yarn build && cat build/index.min.js | pbcopy` and paste the minified script here
})();
  ```

* NOTE the minified script won't run with `use strict`, and tampermonkey applies `use strict` to new script src by default
* paste minified script into that tampermonkey snippet and save
* in tampermonkey script settings, at top, set "Run only in top frame" to true

# Toolchain

* tsc isn't a bundler, so we need a bundler
* wanted to try closure-compiler, which does optimizations and bundling, but leaves some comments in the output which breaks browser bookmarklets
** !! closure-compiler doesn't do src file discovery, so each dependency is manually added in package.json (just jquery right now)
** closure-compiler's `-O ADVANCED` results in the script not compiling properly when used with tampermonkey. Build currently uses default optimization level (no flag).
* use uglify-js on closure-compiler output to remove the comments
