/** 	বাংলা উইকিপিডিয়ায় আমরা ব্যবহারকারী নামের নীতি লঙ্ঘন করে এমন অ্যাকাউন্টকে আংশিক বাধা প্রদান করি।
	অর্থাৎ শুধু প্রকল্প ও ব্যবহারকারী আলাপ নামস্থান বাদে অন্য সকল নামস্থানে বাধা দেই। কিন্তু কাজটা করা বেশ সময়পেক্ষ।
	এই স্ক্রিপ্ট দিয়ে এক ক্লিকে এরকম বাধা প্রদান করা যাবে।
**/
//ব্যবহার করতে প্রশাসক অধিকার লাগবে।
//Made with ChatGPT by [[w:User:Yahya]]

if (mw.config.get("wgCanonicalNamespace") === "User" || mw.config.get("wgCanonicalNamespace") === "User_talk" || mw.config.get("wgPageName").indexOf("Special:Contributions/") === 0) {
   $('#p-personal').append('<li><a id="blockLink" href="#">UN Violation</a></li>');

   $('#blockLink').click(function() {
      if (confirm("আপনি কি নিশ্চিত যে, এই নামটি ব্যবহারকারী নামের নীতি লঙ্ঘন করে? ok চাপলে এই ব্যবহারকারী বাধাপ্রাপ্ত হবেন।")) {
         var username = mw.config.get("wgRelevantUserName");
         var csrfToken = mw.user.tokens.get('csrfToken');
         new mw.Api().post({
            action: 'block',
            user: username,
            expiry: 'infinite',
            nocreate: false,
            autoblock: false,
            partial: true,
            reason: '[[WP:UN|ব্যবহারকারী নাম অ-গ্রহণযোগ্য]]: নামটি পরিবর্তনের জন্য আপনার আলাপ পাতার নির্দেশনা অনুসরণ করুন',
            allowusertalk: true,
            token: csrfToken,
            namespacerestrictions: ['0', '1', '2', '5', '6', '7', '9', '10', '11', '12', '13', '14', '15', '828'],
         })
         .done(function(data) {
            alert("সফলভাবে বাধা দেওয়া হয়েছে! ব্যবহারকারীর আলাপ পাতা থেকে বিষয়শ্রেণী অপসারণ করতে ভুলবেন না।");
         })
         .fail(function(error) {
            alert("বাধা দেওয়ার সময় একটি ত্রুটি হয়েছে: " + error);
         });
      }
   });
}
