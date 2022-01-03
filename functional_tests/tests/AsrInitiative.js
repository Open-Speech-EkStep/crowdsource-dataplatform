const taiko = require('taiko');
const assert = require('assert');

const {
 openBrowser,
 button,
 closeBrowser,
 scrollUp,
 openTab,
 overridePermissions,
 goto,
 clear,
 listItem,
 setConfig,
 write,
 screenshot,
 click,
 hover,
 link,
 text,
 into,
 evaluate,
} = require('taiko');
const path = require('path');

const headless = process.env.headless_chrome.toLowerCase() === 'true';
const testUrl = process.env.test_url;

const getSelectors = require('./constant')
beforeSpec(async () => {
 selectors = await getSelectors(taiko)
});

beforeSuite(async () => {
 //setConfig( { waitForNavigation: false, navigationTimeout: 120000});
 //await openBrowser({args:['--window-size=1440,900']})
 await openBrowser({
 headless: headless,
 args: ['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream' ,'--start-fullscreen'],
 });
 setConfig({
 waitForNavigation: false,
 navigationTimeout: 120000,
 observe: true,
 observeTime: 1500,
 retryTimeout: 5000,
 });
 await overridePermissions(testUrl, ['audioCapture']);
});


gauge.screenshotFn = async function () {
 const screenshotFilePath = path.join(
 process.env['gauge_screenshots_dir'],
 `screenshot-${process.hrtime.bigint()}.png`
 );
 await screenshot({ path: screenshotFilePath });
 return await taiko.screenshot({ encoding: 'base64', path: screenshotFilePath });
};

step('Open Website', async () => {
 await goto(testUrl, { waitForEvents: ['loadEventFired'] });
 await taiko.waitFor(500);
});

step('User details popup should appear and close button should close the pop up', async function () {
 if (await selectors.userDetailsText.exists()) {
 assert.ok('speaker details pop-up exists');
 await click(selectors.userDetailsCloseButton);
 }
 await taiko.waitFor(500);
});

step(
 'Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present',
 async function () {
 await taiko.waitFor(1000);
 const usernameFiled = selectors.userNameField;
 assert.ok(await usernameFiled.exists());
 await write('1234', into(usernameFiled));
 await selectors.userNameErrorMsg.isVisible();
 assert.ok(await selectors.motherTongue.exists());
 assert.ok(await selectors.age.exists());
 assert.ok(await selectors.others.exists());
 assert.ok(await selectors.female.exists());
 assert.ok(await selectors.male.exists());
 }
);

step('if a user enter username and click on Not you change user button , the field should be cleared',async function () {
 const usernameFiled = selectors.userNameField;
 await taiko.waitFor(500);
 await write('TestUser', into(usernameFiled));
 await clear(usernameFiled);
 await taiko.waitFor(500);
 assert.equal(await usernameFiled.value(), '');
 }
);

step('And User enter random Username and selects Age , Mother tongue ,gender', async function () {
 await taiko.waitFor(1000);
 if (await selectors.userDetailsText.isVisible()) {
 const usernameFiled = selectors.userNameField;
 await taiko.waitFor(700);
 await write('Dummy user', into(usernameFiled));
 await selectors.motherTongue.select('Hindi');
 await selectors.age.select(3);
 await click(selectors.male);
 }
});

step('When user click on Lets Go Button, user should <arg0> see instructions to record',async function (arg0) {
 await click(selectors.doneButton);
 await taiko.waitFor(1500);

 if (arg0 == 'not') {
 assert.ok(true);
 } else {
 await scrollUp(5000);
 assert.ok(await selectors.quickTipsText.exists(), 'Not able to see instructions');
 }
 }
);

step('user should <arg0> see instructions to record', async function (arg0) {
 await taiko.waitFor(1500);

 if (arg0 == 'not') {
 assert.ok(!(await selectors.quickTipsText.isVisible()));
 } else {
 assert.ok(await selectors.quickTipsText.exists(), 'Not able to see instructions');
 }
});

step(
 'User should be able to close the Instructions , user should see a sentence , Skip button , Start Recording Button , username,Test Mic and speaker button',
 async function () {
 await taiko.waitFor(1200);
 await scrollUp(10000);
 assert.ok(await selectors.closeTipsButton.exists());
 await scrollUp(5000);
 assert.ok(await selectors.startRecordingButton.exists());
 assert.ok(await selectors.skipButton.exists());
 assert.ok(await selectors.testSpeakerIcon.exists());
 }
);

step('When user clicks on <arg0> button, <arg1> button should appear', async function (arg0, arg1) {
 await taiko.waitFor(async () => await button(arg0).exists());
 await taiko.waitFor(1000);
 await evaluate(button(arg0), elem => elem.click());
 await taiko.waitFor(2000);
 assert.ok(await button(arg1).exists());
});

step(
 'When user skips all the rest of the <count> sentences , User should see Thank you Page',
 async function (count) {
 const skipbutton = selectors.skipButton;
 for (let i = 0; i < count; i++) {
 await click(skipbutton);
 await taiko.waitFor(1000);
 console.log(i);
 }
 await taiko.waitFor(3000);
 assert.ok(await selectors.contributeToYourLanguageText.exists());
 }
);

step(
 'when user clicks on the Contribute More button, user should not see the Instructions page again',
 async function () {
 await click( selectors.contributeMoreText);
 await taiko.waitFor(1000);
 if (await selectors.quickTipsText.exists()) {
 const resp = await selectors.quickTipsText.isVisible();
 assert.ok(!resp);
 }
 }
);

step(['Click <name> Button', 'Click <name> Button again'], async function (name) {
 assert.ok(button(name).exists());
 await click(button(name));
});

step('Navigate to <type> card', async type => {
 await taiko.waitFor(1000);
 assert.ok(await text(type).exists());
 await click(text(type));
});

step('Navigate to <arg0> button and click <arg0> button', async function (arg0) {
 if (arg0 == 'Contribute') {
 await taiko.waitFor(2000);
 const startRecordingButton = selectors.contributeIcon;
 assert.ok(await startRecordingButton.exists());
 await taiko.waitFor(1500);
 await click(startRecordingButton);
 } else if (arg0 == 'Validate') {
 await taiko.waitFor(2000);
 const startValidatingButton = selectors.validateIcon;
 assert.ok(await startValidatingButton.exists());
 await taiko.waitFor(1500);
 await click(startValidatingButton);
 } else if (arg0 == 'Transcribe') {
 await taiko.waitFor(2000);
 const startRecordingButton = selectors.contributeIcon;
 assert.ok(await startRecordingButton.exists());
 await taiko.waitFor(1500);
 await click(startRecordingButton);
 } else if (arg0 == 'Correct') {
 await taiko.waitFor(2000);
 const startValidatingButton = selectors.validateIcon;
 assert.ok(await startValidatingButton.exists());
 await taiko.waitFor(1500);
 await click(startValidatingButton);
 } else if (arg0 == 'Translate') {
 await taiko.waitFor(1000);
 assert.ok(await selectors.translateText.exists());
 await click(selectors.translateText);
 } else if (arg0 == 'Know More') {
 await taiko.waitFor(1000);
 await click(taiko.link(arg0));
 await taiko.waitFor(500);
 } else {
 await taiko.waitFor(1500);
 assert.ok(await link(arg0).exists());
 await click(arg0);
 }
});

step('When user clicks on View all Details buttton , user shall land on Dashboard page', async function () {
 await taiko.scrollDown(10000);
 await click(selectors.viewAllDetails);
 await taiko.waitFor(1000);
 assert.ok(await selectors.languageText.exists());
 assert.ok(await selectors.peopleParticipatedText.exists());
 assert.ok(await selectors.durationValidatedText.exists());
 assert.ok(await selectors.durationRecordedText.exists());
});

step(
 'When user select <lang> Language from dropdown then <arg0> should not visible',
 async function (lang, arg0) {
 await taiko.waitFor(1500);
 const selectLanguageDropDown = selectors.languageDropdownDashboard;
 assert.ok(await selectLanguageDropDown.exists());
 await selectLanguageDropDown.select(lang);
 }
);

step('user should be able to see <arg0> , <arg1> , <arg2> , <arg3>', async function (arg0, arg1, arg2, arg3) {
 assert.ok(await text(arg0).exists());
 assert.ok(await text(arg1).exists());
 assert.ok(await text(arg2).exists());
 assert.ok(await text(arg3).exists());
});

step('User plays the audio , <arg0>,<arg1> should be disabled', async function (arg0, arg1) {
 await taiko.waitFor(500);
 await click(await selectors.playIcon);
 await taiko.waitFor(100);
 assert.ok(await taiko.button( arg0 ).isDisabled());
 assert.ok(await taiko.button( arg1 ).isDisabled());
 const count = 20;
 for (let i = 0; i <= count; i++) {
 await taiko.waitFor(1000);
 if (await selectors.replayIcon.isVisible()) {
 console.log('indiside loop');
 break;
 }
 }
});

step(
 '<arg0> should be enabled , <arg1> <arg2> buttons should be disabled',
 async function (arg0, arg1, arg2) {
 await taiko.waitFor(2000);
 assert.ok(!(await taiko.button(arg0).isDisabled()));
 assert.ok(await taiko.button(arg1).isDisabled());
 assert.ok(await taiko.button(arg2).isDisabled());
 }
);

step(
 'User clicks on <arg0> , he should see next sentence and <arg1> <arg2> buttons should be disabled',
 async function (arg0, arg1, arg2) {
 await click(taiko.button(arg0 ));
 await taiko.waitFor(1000);
 assert.ok(await taiko.button(arg1 ).isDisabled());
 assert.ok(await taiko.button(arg2 ).isDisabled());
 }
);

step('User skips the next <count> sentences user should land on Thank you page', async function (count) {
 const skipbutton = selectors.skipButton
 for (let i = 0; i < count; i++) {
 await click(skipbutton);
 await taiko.waitFor(2000);
 }
 await taiko.waitFor(3000);
 assert.ok(await selectors.youValidatedText.isVisible());
});

step('Click <name> link', async function (name) {
 assert.ok(await link(name).exists());
 await click(link(name));
});

step('User should see the <arg> button', async function (arg) {
 await taiko.waitFor(1500);
 assert.ok(await taiko.button(arg).exists());
});

step('Select Contribution Language as <language>', async function (language) {
 await taiko.waitFor(1200);

 const selectLanguageDropDown = selectors.selectLanguageDropDown;
 assert.ok(await selectLanguageDropDown.exists());
 await selectLanguageDropDown.select(language);

 await taiko.waitFor(2000);
});

step('If user selects Other as gender, some more gender options should be visible', async function () {
 await click(selectors.others);
 assert.ok(await selectors.transgenderMale.exists());
 assert.ok(await selectors.transgenderFemale.exists());
 assert.ok(await selectors.ratherNotSay.exists());
});

step(
 'When user clicks on the Test Microphone Speaker button, user should see <arg0> and <arg1> buttons',
 async function (arg0, arg1) {
 await click(selectors.testSpeakerIcon);
 assert.ok(await button({ "data-testid": arg0 }).exists());
 assert.ok(await button({ "data-testid": arg1 }).exists());
 }
);

step(
 'When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button',
 async function () {
 await click(selectors.closeImage);
 assert.ok(await selectors.testSpeakerIcon.exists());
 }
);

step('When user clicks on the Feedback icon, user should see the feedback popup', async function () {
 await click(selectors.feedbackIconImage);
 await taiko.waitFor(1000);
 assert.ok(await selectors.feedbackText.exists());
 assert.ok(await selectors.opinionText.isVisible());
 assert.ok(await selectors.feedbackCategoryText.isVisible());
 assert.ok(await selectors.shareFeedbackText.isVisible());
 assert.ok(await selectors.charLimitText.isVisible());
 assert.ok(await selectors.recommendText.isVisible());
 assert.ok(await selectors.revisitText.isVisible());
});

step('Submit button should be disbaled, When user selects an opinion, submit button should be enabled',
 async function () {
 await taiko.waitFor(500);
 assert.ok(await selectors.submitButton.isDisabled());
 await click(selectors.iconImage);
 assert.ok(!(await selectors.revisit1.isSelected()));
 assert.ok(!(await selectors.revisit2.isSelected()));
 assert.ok(!(await selectors.revisit3.isSelected()));
 assert.ok(!(await selectors.noCheckbox.isSelected()));
 assert.ok(!(await selectors.mayBeCheckbox.isSelected()));
 assert.ok(!(await selectors.revisit1.isSelected()));
 assert.ok(!(await selectors.revisit2.isSelected()));
 assert.ok(!(await selectors.revisit3.isSelected()));
 await taiko.waitFor(500);
 assert.ok(!(await selectors.submitButton.isDisabled()));
 }
);

step('when user clicks on the submit button , user should see thankyou popup', async function () {
 await click(selectors.yesCheckbox);
 await click(selectors.revisit3);
 await taiko.waitFor(200);
 assert.ok(await selectors.yesCheckbox.isSelected());
 assert.ok(await selectors.revisit3.isSelected());
 await click(selectors.submitButton);
 await taiko.waitFor(500);
 assert.ok(await selectors.feedbackThankYouText.exists());
 assert.ok(await selectors.submitSuccessfulText.exists());
});

step('When user clicks on the close button , user should see the home page', async function () {
 assert.ok(await selectors.userDetailsCloseButton.exists());
 await click(selectors.userDetailsCloseButton);
 assert.ok(await selectors.asrInitiativeText.exists());
});

step(
 'When user clicks on Report Button, user should see Report Content Dialog Box & Submit button should be disabled',
 async function () {
 assert.ok(await selectors.reportText.exists());
 await taiko.waitFor(500);
 await click(selectors.reportButton);
 await taiko.waitFor(1000);
 assert.ok(await selectors.reportContentText.exists());
 assert.ok(await selectors.charLimitText.isVisible());
 assert.ok(await selectors.submitButton.isDisabled());
 }
);

step('Once user clicks on Others Radio button, Submit button should be enabled', async function () {
 assert.ok(await selectors.othersCheckbox.exists());
 assert.ok(await selectors.misinformationCheckbox.exists());
 assert.ok(await selectors.politicalStatementCheckbox.exists());
 assert.ok(await selectors.prohibitedContentCheckbox.exists());
 assert.ok(await selectors.offensiveCheckbox.exists());
 await click(selectors.othersCheckbox);
 assert.ok(!(await selectors.reportButton.isDisabled()));
});

step(
 'When user submits , Thank you pop up should come & close button should close the pop up',
 async function () {
 await click(await selectors.submitButton);
 await taiko.waitFor(500);
 assert.ok(await selectors.thankYouText.exists());
 await click(selectors.userDetailsCloseButton);
 await taiko.waitFor(500);
 }
);

step('Validate Thank you page content for ASR Initiative', async function () {
 await taiko.waitFor(1000);
 assert.ok(await selectors.asrProgressBarText.isVisible());
 assert.ok(await selectors.recordingText.isVisible());
 assert.ok(await selectors.contribute5RecordingText.isVisible());
 assert.ok(await selectors.hourText.isVisible());
});

step('Validate terms and condition content', async function () {
 assert.ok(await selectors.termsAndConditionsText.exists());
 await taiko.closeTab();
});

step('User clicks back button', async function () {
 if ((await selectors.backButton.exists()) && (await selectors.backButton.isVisible())) {
 await click(selectors.backButton);
 }
});

step('Validate ASR Initiative content', async function () {
 assert.ok(await selectors.asrInitiativeHeading.exists());
 assert.ok(await selectors.speakText.exists());
 assert.ok(await selectors.validateText.exists());
 assert.ok(await selectors.contributionTrackerText.exists());
 assert.ok(await selectors.overAllSummaryText.exists());
 assert.ok(await selectors.asrContributionMadeText.exists());
 assert.ok(await selectors.top3contributionText.exists());
});

step("When user click on Tips Button, user should see instructions to record", async function() {
	await click(selectors.tipsButton);
	await taiko.waitFor(1500);
	assert.ok(await selectors.quickTipsText.exists());

	assert.ok(await selectors.closeTipsButton.exists());
	await click(selectors.closeTipsButton);

});