const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    closeBrowser,
    openTab,
    overridePermissions,
    goto,
    clear,
    listItem,
    write,
    screenshot,
    click,
    hover,
    link,
    text,
    into,
    evaluate
} = require('taiko');
const path = require('path');

const headless = process.env.headless_chrome.toLowerCase() === 'true';
const testUrl = process.env.test_url;

beforeSuite(async () => {
    await openBrowser({
        headless: headless,
        args: [
            '--node-sandbox',
            '--use-fake-ui-for-media-stream'
        ]
    })
    await overridePermissions(testUrl, ['audioCapture']);
});

afterSuite(async () => {
    await closeBrowser();
});

gauge.screenshotFn = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'], `screenshot-${process.hrtime.bigint()}.png`);
    await screenshot({ path: screenshotFilePath });
    return await taiko.screenshot({ encoding: 'base64' ,path:screenshotFilePath});
};

step("Open Website", async () => {
    await taiko.waitFor(500)
    await goto(testUrl, {waitForEvents:['loadEventFired']});
    await taiko.waitFor(500)
});

step("Validate about us content", async function () {
    assert.ok(await text('Bolo India: A crowdsourcing initiative for Indian languages').exists());
});

step("Start Recording button is disabled", async function () {
    assert.ok(await taiko.button({ id: 'start_recording' }).isDisabled())
});

step("Select Language <language> enables the Start Recording button", async function (language) {
    const selectLanguageDropDown = taiko.dropDown({ id: 'languageTop' })
    await selectLanguageDropDown.select(language)
    await taiko.waitFor(1000)
    assert.ok(!await taiko.button({ id: 'start_recording' }).isDisabled(), 'the start recording button is disabled')
});

step("Speaker details popup should appear and close button should close the pop up", async function () {
    if (await taiko.text('Speaker Details').exists()) {
        assert.ok('speaker details pop-up exists')
        await click(taiko.button({ class: 'close float-right' }))
    }
    await taiko.waitFor(500)
});

step("Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present", async function () {
    await taiko.waitFor(1000)
    assert.ok(await taiko.textBox({ id: 'username' }).exists())
    assert.ok(await taiko.dropDown({ id: 'mother-tongue' }).exists())
    assert.ok(await taiko.dropDown({ id: 'age' }).exists())
    assert.ok(await taiko.radioButton({ id: 'other-check' }).exists())
    assert.ok(await taiko.radioButton({ id: 'female-check' }).exists())
    assert.ok(await taiko.radioButton({ id: 'male-check' }).exists())
});


step("if a user enter username and click on Not you change user button , the field should be cleared", async function () {
    const usernameFiled = taiko.textBox({ id: 'username' })
    await taiko.waitFor(500)
    await write('TestUser', into(usernameFiled))
    await clear(taiko.textBox({ id: 'username' }));
    await taiko.waitFor(500)
    assert.equal(await usernameFiled.value(), '')
});


step("And User enter random Username and selects Age , Mother tongue ,gender", async function () {
    if (await taiko.text('User Details').exists()) {
        const username = taiko.textBox({ id: 'username' })
        await taiko.waitFor(700)
        await write('Dummy user', into(username))
        await taiko.dropDown({ id: 'mother-tongue' }).select('Hindi')
        await taiko.dropDown({ id: 'age' }).select(3)
        await click(taiko.radioButton({ id: 'male-check' }))
    }
});

step("When user click on Lets Go Button, user should <arg0> see instructions to record", async function (arg0) {
    await click(taiko.button({ id: 'proceed-box' }))
    await taiko.waitFor(1500)

    if (arg0 == "not") {
        assert.ok(! await text('Quick Tips').exists())
    }
    else {
        assert.ok(await text('Quick Tips').exists(), 'Not able to see instructions')
    }
});

step("When user click on Lets Go Button for Validate, user should <arg0> see instructions to record", async function (arg0) {
    await click(taiko.button({ id: 'bolo-proceed-box' }))
    await taiko.waitFor(1500)

    if (arg0 == "not") {
        assert.ok(! await text('Quick Tips').exists())
    }
    else {
        assert.ok(await text('Quick Tips').exists(), 'Not able to see instructions')
    }
});

step("Add <usrnm> Username for Valiadtion", async function (usrnm) {
    if (await taiko.text('User Details').exists()) {
        const username = taiko.textBox({ id: 'bolo-username' })
        await taiko.waitFor(700)
        await clear(taiko.textBox({ id: 'bolo-username' }));
        await taiko.waitFor(300)
        await write(usrnm, into(username))
        await taiko.waitFor(500)
    }
});


step("User should be able to close the Instructions , user should see a sentence , Skip button , Start Recording Button , username,Test Mic and speaker button", async function () {
    await click(button({ id: "instructions_close_btn" }))
    assert.ok(await button({ id: 'startRecord' }).exists())
    assert.ok(await button({ id: 'skipBtn' }).exists())
    assert.ok(await taiko.$('#sentenceLbl').exists())
    assert.ok(await text('Dummy User').exists())
    assert.ok(await button({ id: 'test-mic-speakers-button' }).exists())

});

step("When user clicks on <arg0> button, <arg1> button should appear", async function (arg0, arg1) {
    await taiko.waitFor(async () => (await button(arg0).exists()))
    await taiko.waitFor(1000)
    await gauge.screenshotFn();
    await evaluate(button(arg0), (elem) => elem.click())
    await taiko.waitFor(3000)
    await gauge.screenshotFn();
    assert.ok(await button(arg1).exists())
});

step("When user skips all the rest of the <count> sentences , User should see Thank you Page", async function (count) {
    const skipbutton = taiko.button({ id: 'skipBtn' })
    for (let i = 0; i < count; i++) {
        await taiko.waitFor(500)
        await click(skipbutton)
        await taiko.waitFor(1000)
    }
    await taiko.waitFor(5000)
    assert.ok(await text('Thank you for contributing!').exists())
});


step("when user skips the sentence", async function()
{
    await taiko.waitFor(500)
    const skipbutton = taiko.button({ id: 'skipBtn' })
    await click(skipbutton)
    await taiko.waitFor(1500)
    await gauge.screenshotFn();

});

step("User waits for thank you page", async function()
    {
        await taiko.waitFor(5000)
        assert.ok(await text('Thank you for contributing!').exists())
    });

step("when user clicks on the Contribute More button, user should not see the Instructions page again", async function () {
    await click(link('Contribute More'))
    await taiko.waitFor(1000)
    if (await text('Quick Tips').exists()) {
        const resp = await text('Quick Tips').isVisible();
        assert.ok(!resp)
    }
});


step("User should see the content in <language>", async function (language) {
    if (language == "Hindi") {
        await taiko.waitFor(500)
        assert.ok(await text("बोलो इंडिया: भारतीय भाषाओं के लिए एक क्राउडसोर्सिंग पहल").exists());
    }
});

step("Select translation language as <language>", async function (language) {
    await taiko.waitFor(500)
    //await taiko.$("#locale_language_dropdown").exists()
    //const localeDropDown = taiko.$("#locale_language_dropdown");
    //await click(localeDropDown);

    await click(listItem({ id: "locale_language_dropdown" }));
    await taiko.waitFor(500);
    await click(link(language));
    await taiko.waitFor(500);
});

step("Navigate to <arg0> button and click <arg0> button", async function (arg0) {
    if (arg0 == "Contribute") {
        await taiko.waitFor(2000)
        const startRecordingButton = taiko.image({ id: "start_recording" });
        assert.ok(await startRecordingButton.exists());
        await hover(startRecordingButton);
        await taiko.waitFor(500)
        await click(startRecordingButton);
    }

    else if (arg0 == "Validate") {
        await taiko.waitFor(2000)
        const startValidatingButton = taiko.image({ id: "start_validating" });
        assert.ok(await startValidatingButton.exists());
        await taiko.waitFor(500);
        await hover(startValidatingButton);
        await taiko.waitFor(500)
        await click(startValidatingButton);
    }
    else if (arg0 == "Transcribe") {
        await taiko.waitFor(2000)
        const startRecordingButton = taiko.image({ id: "start_recording" });
        assert.ok(await startRecordingButton.exists());
        await hover(startRecordingButton);
        await taiko.waitFor(500)
        await click(startRecordingButton);
    }
    else if (arg0 == "Correct") {
        await taiko.waitFor(2000)
        const startValidatingButton = taiko.image({ id: "start_validating" });
        assert.ok(await startValidatingButton.exists());
        await taiko.waitFor(500);
        await hover(startValidatingButton);
        await taiko.waitFor(500)
        await click(startValidatingButton);
    }
    else if (arg0 == "Label") {
        await taiko.waitFor(2000)
        const startRecordingButton = taiko.image({ id: "start_recording" });
        assert.ok(await startRecordingButton.exists());
        await hover(startRecordingButton);
        await taiko.waitFor(500)
        await click(startRecordingButton);
    }

    else {
        assert.ok(await link(arg0).exists());
        await click(arg0);
    }
});

step("When user clicks on View all Details buttton , user shall land on Dashboard page", async function () {
    await click(taiko.link({ id: 'viewAllDetailsBtn' }))
    await taiko.waitFor(1000)
    assert.ok(await text("Languages").exists());
    assert.ok(await text("Speakers contributed").exists());
    assert.ok(await text("Hrs recorded").exists());
    assert.ok(await text("Hrs validated").exists());
});

step("When user select <lang> Language from dropdown then <arg0> should not visible", async function (lang, arg0) {
    const selectLanguageDropDown = taiko.dropDown({ id: 'language' })
    assert.ok(await selectLanguageDropDown.exists());
    await selectLanguageDropDown.select(lang);
    await taiko.waitFor(1000)
    if (await text(arg0).exists()) {
        const resp = await text(arg0).isVisible();
        assert.ok(!resp)
    }
});

step("user should be able to see <arg0> , <arg1> , <arg2> , <arg3>", async function (arg0, arg1, arg2, arg3) {
    assert.ok(await text(arg0).exists());
    assert.ok(await text(arg1).exists());
    assert.ok(await text(arg2).exists());
    assert.ok(await text(arg3).exists());
});


step("User plays the audio , <arg0>,<arg1> should be enabled", async function (arg0, arg1) {
    await taiko.waitFor(500)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "pause" }));
    await taiko.waitFor(1000)
    assert.ok(! await taiko.button({ id: arg0 }).isDisabled());
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
});

step("User plays the audio , <arg0>,<arg1> should be disabled", async function (arg0, arg1) {
    await taiko.waitFor(500)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(1000)
    assert.ok( await taiko.button({ id: arg0 }).isDisabled());
    assert.ok( await taiko.button({ id: arg1 }).isDisabled());
    // Once the audio is complete , then correct button should be enabled
    await taiko.waitFor(7000)
    assert.ok(! await taiko.button({ id: arg0 }).isDisabled());
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
});

step("<arg0> should be enabled , <arg1> <arg2> buttons should be disabled", async function (arg0, arg1, arg2) {
    await taiko.waitFor(2000)
    assert.ok(! await taiko.button({ id: arg0 }).isDisabled());
    assert.ok(await taiko.button({ id: arg1 }).isDisabled());
    assert.ok(await taiko.button({ id: arg2 }).isDisabled());
});

step("User clicks on <arg0> , he should see next sentence and <arg1> <arg2> buttons should be disabled", async function (arg0, arg1, arg2) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(1000);
    assert.ok(await taiko.button({ id: arg1 }).isDisabled());
    assert.ok(await taiko.button({ id: arg2 }).isDisabled());
});

step("User skips the next <count> sentences user should land on Thank you page in <lang>", async function (count, lang) {
    const skipbutton = taiko.button({ id: 'skip_button' })
    for (let i = 0; i < count; i++) {
        await click(skipbutton)
        await taiko.waitFor(1200)
    }

    if (lang == "Hindi") {
        await taiko.waitFor(3000);
        assert.ok(await text('प्रमाणित करने के लिए शुक्रिया!').exists());
    }

    else {
        await taiko.waitFor(3000);
        assert.ok(await text('Thank you for validating').exists());
    }
});

step("User should see the <arg> button", async function (arg) {
    assert.ok(await link(arg).exists());
});

step("User should see State Wise distribution and Top Languages", async function () {

    await taiko.$("#indiaMapChart").exists();
    await taiko.$("#speakers_hours_chart").exists();

});

step("User should be able to change to preffered Language to English again", async function () {
    await taiko.waitFor(1000)
    await click(taiko.text("हिंदी"))
    await click(taiko.link("English"));

});

step("Select Contribution Language as <language>", async function (language) {
    await taiko.waitFor(500)
    await click(taiko.$('#Show_all_language'))
    await taiko.waitFor(500)
    await click(language);
    await taiko.waitFor(2000)
    // if(taiko.button({ class: 'close float-right' }).isVisible())
    // {
    //     await click(taiko.button({ class: 'close float-right' }))
    //     await taiko.waitFor(500)
    // }
});

step("Select Contribution Language as <language> first time", async function (language) {
    await taiko.waitFor(500)
    await gauge.screenshotFn();
    await click(language);
    await taiko.waitFor(700)
});

step("If user selects Other as gender, some more gender options should be visible", async function () {
    await click(taiko.radioButton({ id: 'other-check' }))
    assert.ok(await taiko.radioButton({ id: 'trans-he-check' }).exists())
    assert.ok(await taiko.radioButton({ id: 'trans-she-check' }).exists())
    assert.ok(await taiko.radioButton({ id: 'not-say-check' }).exists())
});

step("When user clicks on the Test Microphone Speaker button, user should see <arg0> and <arg1> buttons", async function (arg0, arg1) {
    await click(taiko.button({ id: "test-mic-speakers-button" }))
    assert.ok(await button({ id: arg0 }).exists())
    assert.ok(await button({ id: arg1 }).exists())

});

step("When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button", async function () {
    await click(taiko.button({ id: "test-mic-close" }))
    assert.ok(await button({ id: 'test-mic-speakers-button' }).exists())

});

step("When user clicks on the Feedback icon, user should see the feedback popup", async function () {
    await click(taiko.button({ id: "feedback_button"}))
    await taiko.waitFor(1000)
    assert.ok(await text("We would like to get your feedback to improve this site").exists());
    assert.ok(await text("Email").exists());
    assert.ok(await text("Giving Feedback for?").exists());
    assert.ok(await text("Select page").exists());
    assert.ok(await text("What is your opinion of this page").exists());
    assert.ok(await text("Please select your feedback category").exists());
    assert.ok(await text("Share your feedback below").exists());
});

step("Submit button should be disbaled, When user selects an opinion, submit button should be enabled", async function () {
    await taiko.waitFor(500)
    const usernameFiled = taiko.textBox({ id: 'email' })
    await taiko.waitFor(500)
    await write('TestUser', into(usernameFiled))
    assert.ok(await taiko.button({ id: "submit_btn" }).isDisabled());
    await click(taiko.$("#very_happy_label"));
    assert.ok(! await taiko.button({ id: "submit_btn" }).isDisabled());
});

step("when user clicks on the submit button , user should land on the Thank you page", async function () {
    await click(taiko.button({ id: "submit_btn" }))
    await taiko.waitFor(500)
    assert.ok(await text("Thank you for your feedback!").exists());
    assert.ok(await text("Submitted successfully").exists());
});

step("When user clicks on the go to home page button , user should see the home page", async function () {
    assert.ok(await taiko.button({ id: "feedback_thanku_close_btn" }).exists());
    await click(taiko.button({ id: "feedback_thanku_close_btn" }))
    assert.ok(await text("Bolo India").exists());
});

step("When user clicks on Report Button, user should see Report Content Dialog Box & Submit button should be disabled", async function () {
    assert.ok(await text("Report").exists());
    await taiko.waitFor(500);
    await click(taiko.button({ id: "report_btn" }))
    await taiko.waitFor(1000);
    assert.ok(await text("Report Content").exists());
    assert.ok(await taiko.button({ id: "report_submit_id" }).isDisabled());
});

step("Once user clicks on Others Radio button, Submit button should be enabled", async function () {
    assert.ok(await taiko.radioButton({ id: 'others_id' }).exists())
    assert.ok(await taiko.radioButton({ id: 'misinformation_id' }).exists())
    assert.ok(await taiko.radioButton({ id: 'politicalStatement_id' }).exists())
    assert.ok(await taiko.radioButton({ id: 'prohibitedContent_id' }).exists())
    assert.ok(await taiko.radioButton({ id: 'offensive_id' }).exists())
    await click(taiko.radioButton({ id: 'others_id' }))
    assert.ok(! await taiko.button({ id: "report_submit_id" }).isDisabled());
});

step("When user submits , Thank you pop up should come & close button should close the pop up", async function () {
    await click(taiko.button({ id: "report_submit_id" }))
    await taiko.waitFor(500);
    assert.ok(await text("Thank You").exists());
    await click(taiko.button({ id: "report_sentence_thanks_close_id" }))
    await taiko.waitFor(500);
});

step("Validate Thank you page content for Bolo India", async function() {
	assert.ok(await text('Thank you for contributing!').exists())
	assert.ok(await text('100 hrs').exists())
});

step("Validate terms and condition content", async function () {
    assert.ok(await text('Terms and Conditions').exists());
});

step("Validate Privacy Policy content", async function () {
    assert.ok(await text('Privacy Policy').exists());
});
