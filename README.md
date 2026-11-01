Installation
===========================

1. Go to one of the js subpages of your user page. You can choose a page such as these:
  * [meta:User:`<Name>`/global.js](https://meta.wikimedia.org/wiki/Special:MyPage/global.js), which will be loaded in all wikis, in all skins
  * [meta:User:`<Name>`/common.js](https://meta.wikimedia.org/wiki/Special:MyPage/common.js), which will be loaded only on Meta-wiki, in all skins
  * [meta:User:`<Name>`/vector.js](https://meta.wikimedia.org/wiki/Special:MyPage/vector.js), which will be loaded only on Meta-wiki, in the vector skin
2. Copy the following to the page you have chosen:

  ```javascript
  // [[File:User:Yahya/mobilemorelinks.js]]
  mw.loader.load( '//en.wikipedia.org/w/index.php?title=User:Yahya/mobilemorelinks.js&action=raw&ctype=text/javascript' );
  ```

3. Clear the cache of your browser.

This will import the minified copy of the script I maintain on Meta-wiki.


Disclaimer
=====================
This code was mainly written by a retired Wikimedian User:Masumrezarock100 under wikimedias default license CC BY SA. But after his retirement some links stopped working. So I made some changed and published it here.


vector-2022-mobile.js
=====================

Makes the Vector 2022 skin usable on phones and tablets. Vector 2022 and MediaWiki core already
ship a responsive layout, but Wikimedia wikis leave `$wgVectorResponsive` off and send a
`width=1120` viewport, so phones and tablets get the desktop layout shrunk down. The script
switches the built-in responsive mode on from the browser and adds a few touch-ups:

* viewport = device width, core's `skin--responsive` class on `<body>`
* wide tables scroll sideways instead of widening the page (phones and tablets)
* infoboxes and sidebars become full width on phones
* slightly larger text, a 16px search input (no iOS zoom on focus) and bigger tap targets on phones
* a one-row header on phones: the wordmark is hidden and the menu button and icons sit close together
* a "Mobile layout: on/off" link in the user menu ("মোবাইল বিন্যাস: চালু/বন্ধ" in Bengali) to switch it off per device

Nothing changes at desktop widths (1120px and up), on other skins, in print or in night mode.
On a phone, pick "Desktop" at the bottom of the mobile site first; otherwise Wikimedia serves the
Minerva skin and the script does nothing.

Install (fastest): paste the whole file into `User:<Name>/vector-2022.js` on the wiki (loaded
only in Vector 2022) or into [meta:User:`<Name>`/global.js](https://meta.wikimedia.org/wiki/Special:MyPage/global.js)
for all wikis. ResourceLoader then serves it minified, in the same request as your other user
scripts, from a versioned URL that browsers cache for weeks.

Install (alternative): keep one copy at `User:<Name>/vector-2022-mobile.js` on Meta-wiki and
import it from `global.js` or `common.js`:

  ```javascript
  // [[File:User:Yahya/vector-2022-mobile.js]]
  mw.loader.load( '//meta.wikimedia.org/w/index.php?title=User:Yahya/vector-2022-mobile.js&action=raw&ctype=text/javascript&smaxage=86400' );
  ```

This needs an extra request after `global.js` has run, so the layout switches a little later.
A short flash of the desktop layout is unavoidable either way: the viewport can only be changed
from JavaScript, and user scripts run after MediaWiki's own scripts have loaded.

Options go before the script (all optional):

  ```javascript
  window.vector2022MobileConfig = { tables: true, infobox: true, text: true, hideLogo: true, menuLink: true, labels: { on: '…', off: '…', tooltip: '…' } };
  ```

Tests and a headless-browser check for this script live in
[Account-Creation-Dashboard](https://github.com/UserYahya/Account-Creation-Dashboard/tree/main/userscripts).
