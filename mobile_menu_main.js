//this code will give you some useful link on mobile interface
$.when(mw.loader.using(['mediawiki.util', 'oojs-ui-core','oojs-ui.styles.icons-editing-core', 'oojs-ui.styles.icons-movement', 'oojs-ui.styles.icons-interactions','oojs-ui.styles.icons-content','oojs-ui.styles.icons-wikimedia','oojs-ui.styles.icons-editing-citation'])).then(function () { 
// JavaScript variables
var	oobutton = OO.ui.ButtonWidget,
	oomenuoption = OO.ui.MenuOptionWidget,
	namespaceNumber = mw.config.get('wgNamespaceNumber'),
	serverName = mw.config.get('wgServerName'),
	siteName = mw.config.get('wgSiteName'),
	contentLanguage = mw.config.get('wgContentLanguage'),
	wikidataId = mw.config.get('wgWikibaseItemId'),
	articleId = mw.config.get('wgArticleId'),
	noticeProject = mw.config.get('wgNoticeProject'),
	getUrl = mw.util.getUrl,
	mainpagecheck = mw.config.get('wgIsMainPage'),
	amcMode = mw.config.get('wgMFAmc'),
	pageName = mw.config.get('wgPageName'),
	escapedPageName = pageName.replace( /[!'"()*]/g, escape ),
	encodedPageName = encodeURIComponent(pageName),
	curRevId = mw.config.get('wgCurRevisionId') ,
	mwDBname = mw.config.get( 'wgDBname' ),
	encodedTitle = encodeURIComponent( mw.config.get( 'wgTitle' ) );
if ( articleId && articleId !== 0 ) {
// Button links
var commonlink = function($) { 
var	whatlinks = getUrl( 'Special:WhatLinksHere', { hideredirs: 1, target: pageName} ) ,
	pageviews = '//tools.wmflabs.org/pageviews/?project=' + serverName +'&platform=all-access&agent=user&range=latest-90&pages=' + encodedPageName ,
	infos = '//tools.wmflabs.org/xtools-articleinfo/index.php?project='+ serverName +'&article='+ encodedPageName ,
	rename = getUrl( 'Special:MovePage/' + pageName),
	logs = getUrl( 'Special:Log', { action: 'view', page: pageName} ) ,
	purge = getUrl( pageName, { action: 'purge', forcelinkupdate: 'true' } ),
	subpage = getUrl( 'Special:PrefixIndex/' + pageName),
	searchinwp = '//www.google.com/search?safe=off&hl=' + contentLanguage + '&q='+ encodedPageName +'+site%3A' + serverName ,
	latestdiff = getUrl( pageName, { action: 'view', diff: curRevId} ) ,
	permalink = getUrl( pageName, { action: 'view', oldid: curRevId} ),
	sbyc = '//xtools.wmflabs.org/topedits/' + serverName + '?namespace=' + namespaceNumber + '&page=' + encodedTitle ,
	wikiblame = 'http://wikipedia.ramselehof.de/wikiblame.php?lang=' + contentLanguage + '&project=' + noticeProject + '&article=' + encodedPageName ,
	croptool = '//tools.wmflabs.org/croptool/?title=https%3A%2F%2F'+ encodeURIComponent(serverName) +'%2Fwiki%2F'+ encodedPageName ,
	wikidatalink = '//m.wikidata.org/wiki/' + wikidataId ,
	reasonator = '//tools.wmflabs.org/reasonator/?lang=' + contentLanguage + '&q=' + wikidataId ,
	refill = '//tools.wmflabs.org/refill/ng/result.php?method-wiki=Fix+page&addblankmetadata=on&wiki=' + contentLanguage + '&usedomainaswork=on&page=' + encodedPageName ,
	iabot = '//tools.wmflabs.org/iabot/index.php?page=runbotsingle&wiki=' + mwDBname + '&pagesearch=' + pageName ,
	copy = '//tools.wmflabs.org/copyvios?action=search&turnitin=1&use_engine=1&use_links=1&lang=' + contentLanguage + '&project=' + noticeProject +'&title=' + encodedPageName ,
	citebot = '//tools.wmflabs.org/citations/process_page.php?slow=on&edit=on&page=' + pageName ,
	peerreview = 'http://69.142.160.183/~dispenser/view/Peer_reviewer#page:' + encodedPageName ,
	disambiguate = 'http://69.142.160.183/~dispenser/cgi-bin/dablinks.py?page=' + encodedPageName + '&lang=' + contentLanguage ,
	checklinks = 'http://69.142.160.183/~dispenser/cgi-bin/webchecklinks.py?page=' + encodedPageName ,
	commonshelper = '//tools.wmflabs.org/commonshelper/?language='+ contentLanguage +'&project='+ noticeProject +'&image='+ encodedTitle ,
	etocom = '//commons.m.wikimedia.org/wiki/Special:ImportFile?importSource=FileExporter&clientUrl=%2F%2F'+ serverName +'%2Fwiki%2F'+ encodedPageName ,
	sigma = '//tools.wmflabs.org/sigma/articleinfo.py?page=' + encodedPageName + '&server=' + mwDBname ,
	dellog = getUrl( 'Special:Log', { type: 'delete', page: pageName} ) ,
	protectlog = getUrl( 'Special:Log', { type: 'protect', page: pageName} ) ,
	pagemovelog = getUrl( 'Special:Log', { type: 'move', page: pageName} ) ,
	pendingchangeslog = getUrl( 'Special:Log', { type: 'stable', page: pageName} ) ,
	pageinfo = getUrl( null, { action: 'info'} ) ;
//Button widgets
var	whatlinksBtn = new oobutton({
		label: 'Linked pages',
		href: whatlinks ,
		icon: 'articleRedirect'
}),
	permalinkBtn = new oobutton({
		label: 'Permanent Link',
		href: permalink ,
		icon: 'link'
}),
	croptoolBtn = new oobutton({
		label: 'CropTool',
		href: croptool 
}),
	wikidataBtn = new oobutton({
		label: 'Wikidata',
		href: wikidatalink ,
		icon: 'logoWikidata'
}),
	reasonatorBtn = new oobutton({
		label: 'Reasonator',
		href: reasonator ,
		icon: 'logoWikidata',
		flags: 'progressive'
}),
	etocomBtn = new oobutton({
		label: 'Export to Wikimedia Commons',
		href: etocom ,
		flags: ['primary','progressive'] ,
		icon: 'logoWikimediaCommons'
}),
	chBtn = new oobutton({
		label: 'CommonsHelper',
		href: commonshelper ,
		flags: 'progressive' ,
		icon: 'logoWikimediaCommons'
}),
	pageinfoBtn = new oobutton({
		label: 'Basic info',
		href: pageinfo ,
		icon: 'info'
});
// Common drop-down start
var commondropdown = new OO.ui.FieldLayout( new OO.ui.Widget({
content: [
new OO.ui.DropdownWidget({
label: 'Page menu',
menu: {
items: [
// Page logs
new OO.ui.DropdownWidget({
	label: 'Page logs',
	menu: {
		items: [
			new oomenuoption({
				label: $( '<a href='+ logs +'>All logs</a>')
			}),
			new oomenuoption({
				label: $( '<a href='+ dellog +'>Deletion log</a>')
			}),
			new oomenuoption({
				label: $( '<a href='+ pagemovelog +'>Move log</a>')
			}),
			new oomenuoption({
				label: $( '<a href='+ pendingchangeslog +'>Pending changes log</a>')
			}),
			new oomenuoption({
				label: $( '<a href='+ protectlog +'>Protection log</a>')
			})
		],
		hideOnChoose: false
	}
}),
// Page analysis
new OO.ui.DropdownWidget({
	label: 'Page analysis',
	menu: {
		items: [
			new oomenuoption({
				label: $( '<a href='+ infos +'>Analysis – XTools</a>'),
				icon: 'infoFilled'
			}),
			new oomenuoption({
				label: $( '<a href='+ sigma +'>Analysis – &#931;</a>')
			}),
			new oomenuoption({
			label: $( '<a href='+ pageviews +'>Page traffic report</a>'),
			icon: 'info'
		})
		],
		hideOnChoose: false
	}
}),
//Other tools
	new oomenuoption({
		label: $( '<a href='+ latestdiff +'>Latest diff</a>')
	}),
	new oomenuoption({
		label: $( '<a href='+ rename +'>Move page</a>'),
		icon: 'move'
	}),
	new oomenuoption({
		label: $( '<a href='+ purge +'>Purge cache</a>'),
		icon: 'reload'
	}),
	new oomenuoption({
		label: $( '<a href='+ sbyc +'>Search by contributor</a>'),
		icon: 'articleSearch'
	}),
	new oomenuoption({
		label: $( '<a href='+ wikiblame +'>Search revision history</a>'),
		icon: 'articleSearch'
	}),
	new oomenuoption({
		label: $( '<a href='+ subpage +'>Subpages</a>')
	})
],
hideOnChoose: false
}
})
]
}));
//Common drop-down end
 //Article and draft tools
var toolsdropdown = new OO.ui.FieldLayout( new OO.ui.Widget({
content: [
new OO.ui.DropdownWidget({
label: 'Tools',
menu: {
items: [
	new oomenuoption({
		label: $( '<a href='+ copy +'>Copyright violation detector</a>')
	}),
	new oomenuoption({
		label: $( '<a href='+ refill +'>Expand bare references</a>'),
		icon: 'references'
	}),
	new oomenuoption({
		label: $( '<a href='+ iabot +'>Fix dead links</a>'),
		icon: 'robot'
	})
],
hideOnChoose: false
}
})
]
}));
// En-wiki tools
var enwikitoolsdropdown = new OO.ui.FieldLayout( new OO.ui.Widget({
content: [
new OO.ui.DropdownWidget({
label: 'Additional tools',
menu: {
items: [
	new oomenuoption({
		label: $( '<a href='+ checklinks +'>Check external links</a>'),
		icon: 'linkExternal'
	}),
	new oomenuoption({
		label: $( '<a href='+ disambiguate +'>Disambiguate links</a>') ,
		icon: 'articleDisambiguation'
	}),
	new oomenuoption({
		label: $( '<a href='+ citebot +'>Fix citations</a>'),
		icon: 'reference'
	}),
	new oomenuoption({
		label: $( '<a href='+ peerreview +'>Peer reviewer</a>')
	})
],
hideOnChoose: false
}
})
]
}));
//Change link order here
//Don't show if AMC mode is enabled
if (amcMode == false) {
$("#siteNotice").append( pageinfoBtn.$element, permalinkBtn.$element, whatlinksBtn.$element );
}
// File only buttons
if ( namespaceNumber == 6 ) {
//CropTool. Only load on file pages in specified format, and that have files in it (not file redirects.
if ( document.getElementById('file') && /(PNG|GIF|JPE?G|DJVU|PDF|TIF?F)$/i.test( mw.config.get( 'wgTitle' ) ) ) {
$("#siteNotice").append( croptoolBtn.$element );
}
// Move to Commons start. Doesn't load on Commons and test-wiki
if ( noticeProject !== "commons" && noticeProject !== "test" ) {
$("#siteNotice").append( chBtn.$element, etocomBtn.$element );
}
//Move to Commons end
}
// Does not load on pages that are not connected to Wikidata
if ( wikidataId && wikidataId !== null ) {
$("#p-navigation").append( reasonatorBtn.$element );
//  Show if AMC mode is not enabled or it's a main page
if (amcMode == false || mainpagecheck == true) {
$("#siteNotice").append( wikidataBtn.$element );
}
}
//Common drop down
$("#p-navigation").append( commondropdown.$element );
//Only load in pages that are in draft or main namespace. Don't load in main page
if ((pageName.indexOf('Draft:') !== -1) || (namespaceNumber == 0) && (mainpagecheck == null)) {
//Only load in Wikipedias
if ( noticeProject === "wikipedia" ) {
$("#p-navigation").append( toolsdropdown.$element );
}
//Only load in English Wikipedia
if ( mwDBname === "enwiki" ) {
$("#p-navigation").append( enwikitoolsdropdown.$element );
}
}
// Article and draft only links end
}} 
$(document).ready(commonlink);
});
