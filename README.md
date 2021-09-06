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
