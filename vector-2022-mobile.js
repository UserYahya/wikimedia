/* global mw */
/**
 * Vector 2022 mobile and tablet friendly layout: a MediaWiki user script.
 *
 * Vector 2022 already ships a responsive layout (phone up to 639px, tablet
 * 640–1119px, desktop from 1120px) and MediaWiki core ships responsive content
 * rules (images, thumbnails, tables) behind the `skin--responsive` body class.
 * On wikis where $wgVectorResponsive is off (all Wikimedia wikis) the skin
 * instead sends `<meta name="viewport" content="width=1120">`, which forces the
 * desktop layout onto phones and tablets. This script turns the built-in
 * responsive mode on from the browser and adds a few touch-ups:
 *
 *  - viewport = device width, `skin--responsive` on <body>
 *  - wide tables scroll sideways instead of widening the page (phones, tablets)
 *  - infoboxes and sidebars become full width on phones
 *  - slightly larger text, inputs and tap targets on phones
 *  - a one-row header on phones: the wordmark is hidden and the icons sit closer
 *  - a "Mobile layout: on/off" link in the user menu to switch it off per device
 *
 * Nothing changes at desktop widths (1120px and up), on other skins or in print.
 *
 * Install (fastest): paste this whole file into User:<name>/vector-2022.js on the
 * wiki (loaded only in Vector 2022), or into meta:User:<name>/global.js for all
 * wikis. ResourceLoader then serves it minified, in the same request as your
 * other user scripts, from a versioned URL browsers cache for weeks.
 *
 * Install (alternative): keep one copy on Meta-Wiki and import it. This costs an
 * extra request after your global.js has run, so the layout switches later:
 *
 *   mw.loader.load( '//meta.wikimedia.org/w/index.php?title=User:<name>/vector-2022-mobile.js&action=raw&ctype=text/javascript&smaxage=86400' );
 *
 * Options (set before the script loads, all optional):
 *
 *   window.vector2022MobileConfig = {
 *     tables: true,   // wrap wide tables so they scroll sideways
 *     infobox: true,  // full-width infoboxes and sidebars on phones
 *     text: true,     // 16px body text on phones when Vector's text size is "Small"
 *     hideLogo: true, // hide the wordmark on phones so the header fits on one row
 *     menuLink: true, // on/off link in the user menu
 *     labels: { on: '…', off: '…', tooltip: '…' }
 *   };
 *
 * Source: https://github.com/UserYahya/wikimedia
 * Tests and a browser check: https://github.com/UserYahya/Account-Creation-Dashboard (userscripts/)
 */
( function () {
	'use strict';

	// Only once, even when common.js and global.js both load the script.
	if ( window.vector2022Mobile ) {
		return;
	}
	// Only Vector 2022. Other skins (Minerva, legacy Vector, Timeless…) are untouched.
	if ( typeof mw === 'undefined' || !mw.config || mw.config.get( 'skin' ) !== 'vector-2022' ) {
		return;
	}

	const VERSION = '1.0.0';
	// Class on <html> that scopes every style rule of this script.
	const HTML_CLASS = 'vector-2022-mobile';
	// MediaWiki core's own hook for responsive content styles (OutputPage adds it
	// when the skin runs in responsive mode).
	const BODY_CLASS = 'skin--responsive';
	const STYLE_ID = 'vector-2022-mobile-styles';
	const TABLE_WRAPPER_CLASS = 'vector-2022-mobile-table';
	const LINK_ID = 'pt-vector-2022-mobile';
	const STORAGE_KEY = 'vector-2022-mobile';
	// Same viewport MediaWiki core sends for responsive skins (includes/Skin/Skin.php).
	const RESPONSIVE_VIEWPORT = 'width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=0.25, maximum-scale=5.0';
	// Codex breakpoints used by Vector 2022: phone <= 639px, tablet 640–1119px, desktop >= 1120px.
	const MAX_WIDTH_MOBILE = 639;
	const MAX_WIDTH_TABLET = 1119;

	const options = Object.assign( {
		tables: true,
		infobox: true,
		text: true,
		hideLogo: true,
		menuLink: true,
		labels: null
	}, window.vector2022MobileConfig );

	const api = {
		version: VERSION,
		options: options,
		enabled: false
	};
	window.vector2022Mobile = api;

	// --- Per-device on/off switch (localStorage, so it never touches wiki preferences) ---

	function isStoredOff() {
		try {
			return window.localStorage.getItem( STORAGE_KEY ) === 'off';
		} catch ( e ) {
			return false;
		}
	}

	function storeEnabled( enabled ) {
		try {
			if ( enabled ) {
				window.localStorage.removeItem( STORAGE_KEY );
			} else {
				window.localStorage.setItem( STORAGE_KEY, 'off' );
			}
		} catch ( e ) {
			// Private mode or storage disabled: the switch just does not persist.
		}
	}

	// --- Viewport, classes and styles ---

	function applyViewport() {
		let meta = document.querySelector( 'meta[name="viewport"]' );
		if ( !meta ) {
			meta = document.createElement( 'meta' );
			meta.setAttribute( 'name', 'viewport' );
			document.head.appendChild( meta );
		}
		const content = meta.getAttribute( 'content' ) || '';
		// Already responsive (3rd-party wiki with $wgVectorResponsive, or the
		// mobile domain with ?useskin=vector-2022): keep whatever the server sent.
		if ( content.indexOf( 'device-width' ) === -1 ) {
			meta.setAttribute( 'data-vector-2022-mobile-original', content );
			meta.setAttribute( 'content', RESPONSIVE_VIEWPORT );
		}
	}

	function buildCss() {
		const h = 'html.' + HTML_CLASS;
		const phone = '@media screen and (max-width: ' + MAX_WIDTH_MOBILE + 'px)';
		const narrow = '@media screen and (max-width: ' + MAX_WIDTH_TABLET + 'px)';
		const rules = [];

		// Phones and tablets. Anything wider than the screen makes mobile browsers zoom the
		// whole page out again, so images, formulas and long words must stay inside it.
		rules.push( narrow + ' {\n' +
			h + ' .vector-body { overflow-wrap: break-word; }\n' +
			// Same rule Minerva uses: linked images shrink to the space they have.
			h + ' .mw-parser-output a > img,\n' +
			h + ' .mw-parser-output img.mwe-math-fallback-image-display { max-width: 100%; height: auto; }\n' +
			// Except image maps and anything editors marked noresize (core does the same for figures).
			h + ' .mw-parser-output .noresize a > img,\n' +
			h + ' .mw-parser-output a > img[usemap] { max-width: none; }\n' +
			( options.tables ?
				h + ' .' + TABLE_WRAPPER_CLASS + ' { max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }\n' :
				'' ) +
			'}' );

		// Phones only.
		rules.push( phone + ' {\n' +
			// 16px side gutters instead of 24px: ~10% more room for content on a phone.
			h + ' .mw-page-container,\n' +
			h + ' .vector-header-container .mw-header { padding-left: 16px; padding-right: 16px; }\n' +
			// One row for the menu button and the icons: smaller gaps, icons 1px apart
			// instead of 8px, a narrower user-menu button, and (by default) no wordmark.
			h + ' .mw-header { gap: 8px; }\n' +
			h + ' .mw-header .vector-header-start { gap: 8px; }\n' +
			h + ' .mw-logo-tagline { display: none; }\n' +
			( options.hideLogo ? h + ' .mw-logo-container { display: none; }\n' : '' ) +
			h + ' .vector-user-links .mw-list-item,\n' +
			h + ' .vector-user-links .vector-dropdown-label { margin-left: 1px; margin-right: 1px; }\n' +
			h + ' .vector-user-links .vector-dropdown-content .mw-list-item { margin: 0; }\n' +
			h + ' .vector-user-menu-logged-in .vector-dropdown-label { padding-left: 4px; padding-right: 4px; }\n' +
			// A 16px input stops iOS Safari from zooming in when the search box is focused.
			h + ' .vector-search-box .cdx-text-input__input { font-size: 1rem; }\n' +
			// Tap targets of about 40px in dropdown menus and the table of contents.
			h + ' .vector-dropdown-content .mw-list-item a,\n' +
			h + ' .vector-pinnable-element .mw-list-item a,\n' +
			h + ' .vector-toc .vector-toc-text { padding-top: 12px; padding-bottom: 12px; }\n' +
			'}' );

		if ( options.text ) {
			// Vector's "Small" text (the default) is 14px; 16px reads better on a phone.
			// Users who picked "Standard" or "Large" in the Appearance menu keep their choice.
			rules.push( phone + ' {\n' +
				h + '.vector-feature-custom-font-size-clientpref-0 .vector-body { font-size: 1rem; line-height: 1.625; }\n' +
				'}' );
		}

		if ( options.infobox ) {
			const boxes = [ '.infobox', '.infobox_v2', '.infobox_v3', '.sidebar', '.vertical-navbox' ];
			const sel = function ( suffix ) {
				return boxes.map( function ( cls ) {
					return h + ' .mw-parser-output ' + cls + suffix;
				} ).join( ',\n' );
			};
			rules.push( phone + ' {\n' +
				// Floating boxes take the full width; !important beats inline styles and TemplateStyles.
				sel( '' ) + ' { float: none !important; clear: both; width: 100% !important; max-width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; box-sizing: border-box; }\n' +
				// Core turns every content table into a scrolling block on phones (T330527);
				// a full-width box should stay a real table so its cells fill the width.
				boxes.map( function ( cls ) {
					return h + ' .mw-parser-output table' + cls;
				} ).join( ',\n' ) + ' { display: table; }\n' +
				// Images inside the box (linked or not) shrink to the box instead of overflowing it.
				sel( ' .mw-file-element' ) + ' { max-width: 100%; height: auto; }\n' +
				'}' );
		}

		return rules.join( '\n' );
	}

	function addStyles() {
		if ( document.getElementById( STYLE_ID ) ) {
			return;
		}
		const style = document.createElement( 'style' );
		style.id = STYLE_ID;
		style.textContent = buildCss();
		document.head.appendChild( style );
	}

	// --- Wide tables scroll sideways ---

	function isNarrowViewport() {
		if ( window.matchMedia ) {
			return window.matchMedia( '(max-width: ' + MAX_WIDTH_TABLET + 'px)' ).matches;
		}
		return window.innerWidth <= MAX_WIDTH_TABLET;
	}

	// A table gets a scrolling wrapper only when it is wider than the space it sits in
	// and nothing else already takes care of it.
	function tableNeedsWrapper( table ) {
		const parent = table.parentElement;
		if ( !parent ||
			parent.classList.contains( 'noresize' ) ||
			parent.classList.contains( TABLE_WRAPPER_CLASS ) ||
			parent.closest( 'table' )
		) {
			return false;
		}
		const style = window.getComputedStyle( table );
		const position = style.getPropertyValue( 'position' );
		if ( style.getPropertyValue( 'float' ) !== 'none' ||
			style.getPropertyValue( 'display' ) !== 'table' ||
			position === 'absolute' || position === 'fixed'
		) {
			return false;
		}
		const parentStyle = window.getComputedStyle( parent );
		const available = parent.clientWidth -
			( parseFloat( parentStyle.getPropertyValue( 'padding-left' ) ) || 0 ) -
			( parseFloat( parentStyle.getPropertyValue( 'padding-right' ) ) || 0 );
		return available > 0 && table.getBoundingClientRect().width > available + 1;
	}

	/**
	 * Wrap the tables under `root` that overflow their container in a scrolling
	 * <div class="vector-2022-mobile-table noresize">. Idempotent; does nothing at
	 * desktop widths.
	 *
	 * @param {HTMLElement|null} root
	 * @return {number} Number of tables wrapped
	 */
	function wrapTables( root ) {
		if ( !options.tables || !root || !root.querySelectorAll || !isNarrowViewport() ) {
			return 0;
		}
		// Measure everything first, then change the DOM, so layout is computed once.
		const tables = Array.prototype.filter.call( root.querySelectorAll( 'table' ), tableNeedsWrapper );
		tables.forEach( function ( table ) {
			const wrapper = document.createElement( 'div' );
			// `noresize` is core's marker for "this table has its own overflow handling".
			wrapper.className = TABLE_WRAPPER_CLASS + ' noresize';
			table.parentNode.insertBefore( wrapper, table );
			wrapper.appendChild( table );
		} );
		return tables.length;
	}

	function debounce( fn, wait ) {
		let timer = null;
		return function () {
			window.clearTimeout( timer );
			timer = window.setTimeout( fn, wait );
		};
	}

	function setupTables() {
		let roots = [];

		// Fires for the page content and again after previews, VisualEditor saves etc.
		mw.hook( 'wikipage.content' ).add( function ( $content ) {
			let nodes = [];
			if ( $content && $content.nodeType ) {
				nodes = [ $content ];
			} else if ( $content && typeof $content.toArray === 'function' ) {
				nodes = $content.toArray();
			}
			nodes.forEach( function ( node ) {
				if ( roots.indexOf( node ) === -1 ) {
					roots.push( node );
				}
				wrapTables( node );
			} );
		} );

		// Rotating a tablet or resizing the window can make more tables overflow.
		window.addEventListener( 'resize', debounce( function () {
			roots = roots.filter( function ( node ) {
				return document.body.contains( node );
			} );
			const targets = roots.length ? roots : [ document.getElementById( 'mw-content-text' ) ];
			targets.forEach( wrapTables );
		}, 250 ) );
	}

	// --- On/off link in the user menu ---

	function getLabels() {
		const custom = options.labels || {};
		const bn = mw.config.get( 'wgUserLanguage' ) === 'bn';
		return {
			on: custom.on || ( bn ? 'মোবাইল বিন্যাস: চালু' : 'Mobile layout: on' ),
			off: custom.off || ( bn ? 'মোবাইল বিন্যাস: বন্ধ' : 'Mobile layout: off' ),
			tooltip: custom.tooltip || ( bn ?
				'এই যন্ত্রে ভেক্টর ২০২২-এর মোবাইল-বান্ধব বিন্যাস চালু বা বন্ধ করুন' :
				'Switch the mobile-friendly Vector 2022 layout on or off on this device' )
		};
	}

	function addMenuLink( enabled ) {
		if ( !options.menuLink || !mw.loader || !mw.loader.using ) {
			return;
		}
		mw.loader.using( 'mediawiki.util' ).then( function () {
			if ( document.getElementById( LINK_ID ) ) {
				return;
			}
			const labels = getLabels();
			const portlet = document.getElementById( 'p-personal' ) ? 'p-personal' : 'p-tb';
			const item = mw.util.addPortletLink( portlet, '#', enabled ? labels.on : labels.off, LINK_ID, labels.tooltip );
			if ( !item ) {
				return;
			}
			const link = item.querySelector( 'a' ) || item;
			link.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				storeEnabled( !enabled );
				window.location.reload();
			} );
		} );
	}

	// --- Start ---

	function start() {
		const enabled = !isStoredOff();
		api.enabled = enabled;
		api.wrapTables = wrapTables;
		api.setEnabled = storeEnabled;

		addMenuLink( enabled );
		if ( !enabled ) {
			return;
		}

		applyViewport();
		document.documentElement.classList.add( HTML_CLASS );
		document.body.classList.add( BODY_CLASS );
		addStyles();
		if ( options.tables ) {
			setupTables();
		}
	}

	if ( document.body ) {
		start();
	} else {
		document.addEventListener( 'DOMContentLoaded', start );
	}
}() );
