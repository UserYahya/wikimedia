// <nowiki>
mw.loader.using([ 'oojs-ui', 'mediawiki.api' ]).then(function () {
    if (mw.config.get('wgNamespaceNumber') < 0) return; // Do not load on special pages

    // Utility function to get the current Bangla month and year
    function getBanglaMonthYear() {
        const date = new Date();
        const banglaMonths = [
            'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
            'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
        ];
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

        const month = banglaMonths[date.getMonth()];
        const year = date.getFullYear()
            .toString()
            .split('')
            .map((digit) => banglaDigits[parseInt(digit, 10)])
            .join('');

        return `${month} ${year}`;
    }

    // Function to get the page creator
    function getPageCreator(pageTitle) {
        return new mw.Api()
            .get({
                action: 'query',
                prop: 'revisions',
                titles: pageTitle,
                rvlimit: 1,
                rvdir: 'newer',
                rvprop: 'user',
            })
            .then((data) => {
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                const page = pages[pageId];
                const revisions = page.revisions;
                const user = revisions[0].user;
                return user;
            });
    }

    // Function to display the popup
    function showPopup() {
        const windowManager = new OO.ui.WindowManager();
        $('body').append(windowManager.$element);

        // Define a process dialog
        function MyDialog(config) {
            MyDialog.super.call(this, config);
        }
        OO.inheritClass(MyDialog, OO.ui.ProcessDialog);

        MyDialog.static.name = 'myDialog';
        MyDialog.static.title = 'স্থানান্তর আলোচনা শুরু করুন'; // Start Move Discussion
        MyDialog.static.actions = [
            { action: 'save', label: 'জমা দিন', flags: ['primary', 'progressive'] }, // Submit
            { action: 'cancel', label: 'বাতিল করুন', flags: 'safe' }, // Cancel
        ];

        MyDialog.prototype.initialize = function () {
            MyDialog.super.prototype.initialize.apply(this, arguments);

            // Create input fields
            this.targetPageInput = new OO.ui.TextInputWidget({
                placeholder: 'লক্ষ্যকৃত পাতার নাম লিখুন...', // Enter the targeted page name
            });

            this.textbox = new OO.ui.TextInputWidget({
                placeholder: 'আপনার স্থানান্তর আলোচনার বার্তা এখানে লিখুন...', // Your move discussion text here
                multiline: true,
                rows: 10, // Make this input larger
            });

            // Create field layouts
            this.fieldset = new OO.ui.FieldsetLayout();
            this.fieldset.addItems([
                new OO.ui.FieldLayout(this.targetPageInput, {
                    label: 'যে নামে স্থানান্তর করা প্রয়োজন', // Targeted Page Name
                    align: 'top',
                }),
                new OO.ui.FieldLayout(this.textbox, {
                    label: 'কেন নাম পরিবর্তন করা প্রয়োজন?', // Discussion Message
                    align: 'top',
                }),
            ]);

            // Add content to the dialog
            this.content = new OO.ui.PanelLayout({
                padded: true,
                expanded: false,
            });
            this.content.$element.append(this.fieldset.$element);
            this.$body.append(this.content.$element);
        };

        MyDialog.prototype.getActionProcess = function (action) {
            if (action === 'save') {
                return new OO.ui.Process(() => {
                    const targetPageName = this.targetPageInput.getValue();
                    const text = this.textbox.getValue();

                    if (!targetPageName.trim()) {
                        OO.ui.alert('অনুগ্রহ করে যে নামে স্থানান্তর করতে চান তার নাম লিখুন!'); // Please enter the targeted page name!
                        return;
                    }
                    if (!text.trim()) {
                        OO.ui.alert('অনুগ্রহ করে ব্যাখ্যা করুন কেন নাম পরিবর্তন করা দরকার!'); // Please enter a valid discussion text!
                        return;
                    }
                    // Call the function to add the move discussion
                    addMoveDiscussion(text, targetPageName);
                    windowManager.closeWindow(this);
                });
            } else if (action === 'cancel') {
                return new OO.ui.Process(() => {
                    windowManager.closeWindow(this);
                });
            }
            return MyDialog.super.prototype.getActionProcess.call(this, action);
        };

        windowManager.addWindows([new MyDialog()]);

        // Open the dialog
        windowManager.openWindow('myDialog');
    }

    // Function to add the move discussion
    function addMoveDiscussion(text, targetPageName) {
        const pageTitle = mw.config.get('wgPageName').replace(/_/g, ' ');
        const moveDiscussionPage = `উইকিপিডিয়া:পুনঃনামকরণ/বর্তমান আলোচনা`;
        const artPage = `${pageTitle}`;
        const sectionText = `== [[:${pageTitle}]] ==\n* লক্ষ্যকৃত নাম: [[:${targetPageName}]]\n${text} ~~~~`;

        // Add text to Move Discussion page
        new mw.Api()
            .postWithEditToken({
                action: 'edit',
                title: moveDiscussionPage,
                appendtext: `\n\n${sectionText}`,
                summary: 'স্থানান্তর আলোচনা শুরু করা হয়েছে ([[ব্যবহারকারী:Yahya/MoveDiscussion.js|স্ক্রিপ্ট]])',
            })
            .then(() => {
                // Add the template to the talk page
                return new mw.Api().postWithEditToken({
                    action: 'edit',
                    title: artPage,
                    prependtext: `\n\n{{শিরোনাম বিজ্ঞপ্তি|1=${targetPageName}}}`,
                    summary: 'স্থানান্তর আলোচনা টেমপ্লেট যোগ করা হয়েছে ([[ব্যবহারকারী:Yahya/MoveDiscussion.js|স্ক্রিপ্ট]])',
                });
            })
            .then(() => {
                // Get page creator and notify them
                return getPageCreator(pageTitle).then((creator) => {
                    const userTalkPage = 'User talk:' + creator;
                    const messageHeading = getBanglaMonthYear();
                    const messageText = `একজন ব্যবহারকারী আপনার তৈরি করা [[${pageTitle}]] নিবন্ধটির নাম পরিবর্তন করা প্রয়োজন বলে মনে করছেন। তাই তিনি [[উইকিপিডিয়া:পুনঃনামকরণ/বর্তমান আলোচনা#${pageTitle}|উইকিপিডিয়া:পুনঃনামকরণ]] পাতায় একটি আলোচনা শুরু করেছেন। অনুগ্রহ করে আলোচনাটিতে অংশগ্রহণ করুন। ~~~~`;

                    return new mw.Api().postWithEditToken({
                        action: 'edit',
                        title: userTalkPage,
                        section: 'new',
                        sectiontitle: messageHeading,
                        text: messageText,
                        summary: 'স্থানান্তর আলোচনার বিজ্ঞপ্তি ([[ব্যবহারকারী:Yahya/MoveDiscussion.js|স্ক্রিপ্ট]])',
                    });
                });
            })
            .done(() => {
                OO.ui.alert('স্থানান্তর আলোচনা সফলভাবে শুরু হয়েছে এবং নিবন্ধ প্রণেতাকে এ ব্যাপারে জানানো হয়েছে!'); // Move discussion started successfully and the page creator has been notified!
            })
            .fail((error) => {
                console.error(error);
                OO.ui.alert('স্থানান্তর আলোচনা শুরু করতে একটি ত্রুটি ঘটেছে।'); // An error occurred while starting the move discussion.
            });
    }

    // Add the link to the toolbar
    mw.util.addPortletLink(
        'p-tb', // Target: "Tools" menu
        '#', // Dummy link
        'স্থানান্তর আলোচনা শুরু করুন', // Link text
        'ca-start-move-discussion', // Unique ID
        'এই পাতার জন্য একটি স্থানান্তর আলোচনা শুরু করুন।' // Tooltip
    );

    // Attach event to the link
    $('#ca-start-move-discussion').on('click', (e) => {
        e.preventDefault();
        showPopup();
    });
})();
// </nowiki>
