//This code will give you some useful links on mobile interface
$.when(mw.loader.using(['mediawiki.util','oojs-ui-widgets', 'oojs-ui-core','oojs-ui.styles.icons-alerts','oojs-ui.styles.icons-content', 'oojs-ui.styles.icons-interactions','oojs-ui.styles.icons-location','oojs-ui.styles.icons-user'])).then(function () { 
// JavaScript variables
var	oobutton = OO.ui.ButtonWidget,
	namespaceNumber = mw.config.get('wgNamespaceNumber'),
	serverName = mw.config.get('wgServerName'),
	siteName = mw.config.get('wgSiteName'),
	userGroups = mw.config.get('wgUserGroups'),
	contentLanguage = mw.config.get('wgContentLanguage'),
	noticeProject = mw.config.get('wgNoticeProject'),
	pageName = mw.config.get('wgPageName'),
	userName = mw.config.get('wgRelevantUserName'),
	getUrl = mw.util.getUrl,
	mwDBname = mw.config.get('wgDBname'),
	escapedUserName = userName.replace( /[?!'()*]/g, escape ),
	encodedUserName = encodeURIComponent(userName);
// Namespace module
// Only works in userspace
if ( namespaceNumber === 2 || namespaceNumber === 3 || mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions' || !!mw.util.getParamValue("user") ) {
//Button links
		var userBtnLinks = function($) {
		var	contribs = getUrl( 'Special:Contributions/' + userName ) ,
		email = getUrl( 'Special:EmailUser/' + userName ) ,
		localusergroup = getUrl( 'Special:ListUsers', { limit: 1, username: userName } ) ,
		rightchange = '//xtools.wmflabs.org/ec-rightschanges/' + serverName + '/' + encodedUserName ,
		thanksreceived = getUrl( 'Special:Log', { page: 'User:' + userName, type: 'thanks' } ) ,
		useruploads = getUrl( 'Special:ListFiles', { ilshowall: '1', user: userName} ) ,
		alluserlog = getUrl( 'Special:Log', { action: 'view', user: userName} ) ,
		abuselog = getUrl( 'Special:AbuseLog', { wpSearchUser: userName} ) ,
		spamlog = getUrl( 'Special:Log', { type: 'spamblacklist', user: userName} ) ,
		thankslog = getUrl( 'Special:Log', { type: 'thanks', user: userName} ) ,
		globalinfo = getUrl( 'Special:CentralAuth', { target: userName} ),
		movelog = getUrl( 'Special:Log', { type: 'move', user: userName} ) ,
		uploadlog = getUrl( 'Special:Log', { type: 'upload', user: userName} ) ,
		titleblacklistlog = getUrl( 'Special:Log', { type: 'titleblacklist', user: userName} ) ,
		usercreationlog = getUrl( 'Special:Log', { type: 'newusers', user: userName} ) ,
		useranalysis = '//xtools.wmflabs.org/ec/' + serverName + '/' + encodedUserName ,
		articlescreated = '//xtools.wmflabs.org/pages/' + serverName + '/' + encodedUserName + '/0',
		summaryusage = '//xtools.wmflabs.org/editsummary/' + serverName + '/' + encodedUserName ,
		nonautomatededits = '//xtools.wmflabs.org/autoedits/' + serverName + '/' + encodedUserName ,
		globalcontribs = '//tools.wmflabs.org/guc/?user=' + encodedUserName + '&blocks=true' ,
		topedits = '//xtools.wmflabs.org/topedits/' + serverName + '/' + encodedUserName + '/0' ,
		summarysearch = '//tools.wmflabs.org/sigma/summary.py?name=' + encodedUserName +'&server=' + mwDBname ,
		blpedits = '//xtools.wmflabs.org/categoryedits/' + serverName + '/' + encodedUserName + '/Living people',
		afdstats = '//tools.wmflabs.org/afdstats/afdstats.py?name=' + encodedUserName ;
//Buttons start
var blpeditsBtn = new OO.ui.ButtonWidget({
	label: 'BLP edits',
	href: blpedits
				}),
	afdstatsBtn = new OO.ui.ButtonWidget({
	label: 'AfD stats',
	href: afdstats
				});
// Drop-down widget start
var userdropdown = new OO.ui.FieldLayout( new OO.ui.Widget({
content: [
// Multi drop-down menu start
new OO.ui.DropdownWidget({
	label: 'User menu',
	menu: {
		items: [
//Analysis menu start
new OO.ui.DropdownWidget({
	label: 'User analysis',
	menu: {
		items: [
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ useranalysis +'>Analysis – XTools</a>'),
				icon: 'info'
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'articles',
				label: $( '<a href='+ articlescreated +'>Articles created</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ summaryusage +'>Edit summary usage</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ summarysearch +'>Edit summary search</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ globalcontribs +'>Global contributions</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ nonautomatededits +'>Non-automated edits</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ topedits +'>Top edits</a>')
			})
		],
		hideOnChoose: false
	}
}),
//Logs Drop-down menu start
new OO.ui.DropdownWidget({
	label: 'User logs',
	menu: {
		items: [
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ abuselog +'>Abuse filter log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'userAvatarOutline',
				label: $( '<a href='+ alluserlog +'>All logs</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ movelog +'>Move log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ spamlog +'>Spam blacklist log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ titleblacklistlog +'>Title blacklist log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ uploadlog +'>Upload log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ usercreationlog +'>User creation log</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ thankslog +'>User thanks given</a>')
			})
		],
		hideOnChoose: false
	}
}),
//Other user tools drop-down menu start
new OO.ui.DropdownWidget({
	label: 'Other user tools',
	menu: {
		items: [
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ contribs +'>Contributions</a>')
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'message',
				label: $( '<a href='+ email +'>Email user</a>')
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'upload',
				label: $( '<a href='+ useruploads +'>File uploads</a>')
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'globe',
				label: $( '<a href='+ globalinfo +'>Global account information</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ localusergroup +'>Local user groups</a>')
			}),
			new OO.ui.MenuOptionWidget({
				label: $( '<a href='+ rightchange +'>User rights changes</a>')
			}),
			new OO.ui.MenuOptionWidget({
				icon: 'speechBubbles',
				label: $( '<a href='+ thanksreceived +'>User thanks recieved</a>')
			})
		],
		hideOnChoose: false
	}
})
// Multi drop-down end
		]
	}
}),
//End
]
}));
//Append the drop-down menu and button within the siteNotice id
$("#siteNotice").append( userdropdown.$element );
// Only load in English Wikipedia
if ( mwDBname === "enwiki" ) {
$("#siteNotice").append( blpeditsBtn.$element, afdstatsBtn.$element );
}
}}
$(document).ready(userBtnLinks);
});
