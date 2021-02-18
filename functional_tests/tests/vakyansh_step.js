const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    closeBrowser,
    overridePermissions,
    goto,
    write,
    click,
    checkBox,
    hover,
    link,
    text,
    into,
    textBox,
    dropDown
} = require('taiko');

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

step("Opening Vakyansh", async () => {
    await goto(testUrl);
});

step("Search for About Us button", async function () {
    assert.ok(await link('About Us').exists())
});

step("Validate about us content", async function () {
    await click('About Us');
    assert.ok(await text('ABOUT THE ORGANISATION').exists());
});

step("Start Recording button is disabled", async function () {
    assert.ok(await taiko.button({id: 'start_recording'}).isDisabled())
});

step("Select Language <language> enables the Start Recording button", async function (language) {
    const selectLanguageDropDown = taiko.dropDown({id: 'languageTop'})
    await selectLanguageDropDown.select(language)
    await taiko.waitFor(1000)
    assert.ok(!await taiko.button({id: 'start_recording'}).isDisabled(), 'the start recording button is disabled')
});

step("Language Drop Down should have <language> as the default language", async function (language) {
    const selectLanguageDropDown = taiko.dropDown({id: 'language'})
    const defaultval = await selectLanguageDropDown.value()
    assert.equal(defaultval, language + ' (Select languages)')
});

step("Start Recording Button should be for <language> Language", async function (language) {
    const startRecordingButton = taiko.button({id: 'start-record'})
    assert.ok(await text("START RECORDING IN " + language).exists())
    assert.ok(!(await startRecordingButton.isDisabled()))
});

step("Speaker details popup should appear and close button should close the pop up", async function () {
    if (await taiko.text('Speaker Details').exists()) {
        assert.ok('speaker details pop-up exists')
        await click(taiko.button({class: 'close float-right'}))
        assert.ok(await taiko.button({id: 'start_recording'}).exists())
    }
});

step("When user selects <lang> language and click on start recording button", async function (lang) {
    const selectLanguageDropDown = taiko.dropDown({id: 'languageTop'})
    const startRecordingButton = taiko.button({id: 'start_recording'})
    await selectLanguageDropDown.select(lang)
    await taiko.waitFor(2000)
    if (await startRecordingButton.exists())
        await click(startRecordingButton)
});

step("By default the Lets Go button should be disabled", async function () {
    assert.ok(await taiko.button({id: 'proceed-box'}).isDisabled())
});

step("Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present", async function () {
    await taiko.waitFor(1000)
    assert.ok(await taiko.textBox({id: 'username'}).exists())
    assert.ok(await taiko.dropDown({id: 'mother-tongue'}).exists())
    assert.ok(await taiko.dropDown({id: 'age'}).exists())
    assert.ok(await taiko.radioButton({id: 'other-check'}).exists())
    assert.ok(await taiko.radioButton({id: 'female-check'}).exists())
    assert.ok(await taiko.radioButton({id: 'male-check'}).exists())
});

step("Hover on the Lets Go button should give some message", async function () {
    await hover("LET'S GO")
    await taiko.text('Please agree to the Terms and Conditions before proceeding').exists()
});

step("if a user enter username and click on Not you change user button , the field should be cleared", async function () {
    const usernameFiled = taiko.textBox({id: 'username'})
    await taiko.waitFor(1500)
    await write('TestUser', into(textBox("Enter preferred username")))
    const notYouButton = taiko.$('#resetBtn')
    await click(notYouButton)
    assert.equal(await usernameFiled.value(), '')
});

step("Once user agree to terms and conditions Lets Go the button should be enabled", async function () {
    await click(checkBox({id: 'tnc'}))
    assert.equal(await taiko.button({id: 'proceed-box'}).isDisabled(), false)
});

step("When user clicks on the <arg> button", async function (arg) {
    await link(arg).exists();
    await click(arg);
});

step("When user clicks on cross button, pop up should be closed", async function () {
    await taiko.waitFor(1000)
    await click(taiko.$('.close'))
    await taiko.waitFor(1000)
    assert.equal(await taiko.text('Sign In').exists(), false)
});

step("And User enter random Username and selects Age , Mother tongue ,gender", async function () {
    if (await taiko.text('Speaker Details').exists()) {
        const username = taiko.textBox({id: 'username'})
        await taiko.waitFor(700)
        await write('Dummy user', into(username))
        await taiko.dropDown({id: 'mother-tongue'}).select('Hindi')
        await taiko.dropDown({id: 'age'}).select(3)
        await click(taiko.radioButton({id: 'male-check'}))
    }
});

step("when user click on Lets Go Button, user should see instructions to record", async function () {
    await click(taiko.button({id: 'proceed-box'}))
    await taiko.waitFor(1500)
    assert.ok(await text('Recording Instructions').exists(), 'Not able to see instructions')
});

step("When user closes the Instructions , user should see a sentence , Skip button , Start Recording Button , username", async function () {
    await click(button('START'))
    await taiko.waitFor(2000)
    assert.ok(await button({id: 'startRecord'}).exists())
    assert.ok(await button({id: 'skipBtn'}).exists())
    assert.ok(await taiko.$('#sentenceLbl').exists())
    assert.ok(await text('Dummy User').exists())
});

step("When user clicks on <arg0> button, <arg1> button should appear", async function (arg0, arg1) {
    await click(button(arg0))
    await taiko.waitFor(3000)
    assert.ok(await button(arg1).exists())
});

step("When user skips all the rest of the <count> sentences , User should see Thank you Page", async function (count) {
    const skipbutton = taiko.button({id: 'skipBtn'})
    for (let i = 0; i < count; i++) {
        await click(skipbutton)
        await taiko.waitFor(500)
    }
    await taiko.waitFor(4000)
    assert.ok(await text('Thank you for contributing!').exists())
});

step("when user clicks on the Contribute More button, user shall see the Instructions page again", async function () {
    await click(link('Contribute More'))
    await taiko.waitFor(1000)
    assert.ok(await text('Recording Instructions').exists(), 'Not able to see instructions')
});

step("user should see the Sign In pop up", async function () {
    assert.ok(await taiko.text('Sign In').exists())
    await textBox(taiko.below('Email')).exists();
    await textBox(taiko.below('Password')).exists();
    await link('Go to Home Page').exists();
});

step("User enters email as <email> and password as <password>", async function (email, password){
    await write(email,into(textBox(taiko.below('Email'))));
    await write(password,into(textBox(taiko.below('Password'))));
});

step("Wrong credentials error must be shown",async ()=>{
    await text('Wrong email or password').exists();
});

step("Click <linkText> redirects to home", async (linkText)=>{
    await click(link(linkText));
    assert.strictEqual(await taiko.currentURL(),testUrl)
});

step("user should see the validator prompt page",async ()=>{
    await text('test3').exists();
    await text('Play').exists();
    await text('No').exists();
    await text('Yes').exists();
    await text('Skip').exists();
    await text('Instructions').exists();
});

step("user should see pause button and other buttons should disable",async ()=>{
    await text('test3').exists();
    await text('Pause').exists();
    await text('Instructions').exists();
});

step("user should see replay button and other buttons should enable",async ()=>{
    await text('test3').exists();
    await text('Replay').exists();
    await text('Instructions').exists();
});

step("user should see dropdown menu", async ()=>{
    await text('Log Out').exists();
    await text('Validate contributions').exists();
})

step("user should see the Home page", async ()=>{
    await text('Sign In').exists();
    await text('We rely on your contributions').exists();
    await text('Speaker Diversification').exists();
})
