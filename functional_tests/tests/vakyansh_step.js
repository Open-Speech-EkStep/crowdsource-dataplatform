const taiko = require('taiko');
const assert = require('assert');


const {
    openBrowser,
    button,
    page,
    closeBrowser,
    overridePermissions,
    goto,
    write,
    click,
    image,
    scrollDown,
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

step("Validate about us content", async function () {
    assert.ok(await text('Vakyansh: A crowdsourcing initiative for Indian languages').exists());
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

step("Speaker details popup should appear and close button should close the pop up", async function () {
    if (await taiko.text('Speaker Details').exists()) {
        assert.ok('speaker details pop-up exists')
        await click(taiko.button({class: 'close float-right'}))
    }
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
    await taiko.waitFor(async ()=> (await button(arg0).exists()))
    await taiko.waitFor(1000)
    await click(button(arg0))
    await taiko.waitFor(2000)
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

step("when user clicks on the Contribute More button, user should not see the Instructions page again", async function () {
    await click(link('Contribute More'))
    await taiko.waitFor(1000)
    assert(! await text('Recording Instructions').exists(0,0));
});


step("User should see the content in <language>", async function (language) {
    if(language=="Hindi")
    {
        assert.ok(await text("वाक्यांश : भारतीय भाषाओं के लिए एक जन-संकुल स्रोत पहल").exists());
    }
   
});

step("Select Preferred language as <language>", async function(language) {
    if(language=="Hindi")
     {    
    await taiko.waitFor(1000);
    await click(taiko.text("English"));
    await click(taiko.link("हिंदी"))

    }
    else
    {
    await taiko.waitFor(500);
    await click(taiko.text(language));
    }
});

step("Navigate to <arg0> button and click <arg0> button", async function(arg0) {
    
    if(arg0=="Contribute")
    {
        assert.ok(await taiko.image({id: "start_recording"}).exists());
        await click(taiko.image({id :"start_recording"}));  
    }
    
    else if(arg0=="Validate")
    {
        assert.ok(await taiko.image({id: "start_validating"}).exists());
        await click(taiko.image({id :"start_validating"}));  
    }
    
    else
    {
    assert.ok(await link(arg0).exists());
    await click(arg0);
    }
});

step("When user clicks on View all Details buttton , user shall land on Dashboard page", async function() {
    await click(taiko.link({id : 'viewAllDetailsBtn'}))
    await taiko.waitFor(1000)
    assert.ok(await text("languages contributed").exists());
    assert.ok(await text("speakers contributed").exists());
    assert.ok(await text("hours recorded").exists());
    assert.ok(await text("hours validated").exists());
});

step("When user select <lang> Language from dropdown then <arg0> should not visible", async function(lang,arg0) {
    const selectLanguageDropDown = taiko.dropDown({id: 'language'})
    assert.ok(await selectLanguageDropDown.exists());
    await selectLanguageDropDown.select(lang);
    await taiko.waitFor(500)
    assert(! await text(arg0).exists(0,0));
});

step("user should be able to see <arg0> , <arg1> , <arg2> , <arg3>", async function(arg0, arg1, arg2, arg3) {
    assert.ok(await text(arg0).exists()); 
    assert.ok(await text(arg1).exists());
    assert.ok(await text(arg2).exists());
    assert.ok(await text(arg3).exists());
});

step("User plays the audio , <arg0>,<arg1> should be enabled", async function(arg0, arg1) {
    await taiko.waitFor(3000)
    await click(taiko.$('.audioplayer'));
    await click(taiko.$('.audioplayer'));
    assert.ok(! await taiko.button({id: arg0}).isDisabled());
    assert.ok(! await taiko.button({id: arg1}).isDisabled());
});

step("<arg0> should be enabled , <arg1> <arg2> buttons should be disabled", async function(arg0, arg1, arg2) {

    assert.ok(! await taiko.button({id: arg0}).isDisabled());
    assert.ok(await taiko.button({id: arg1}).isDisabled());
    assert.ok(await taiko.button({id: arg2}).isDisabled());
});

step("User clicks on <arg0> , he should see next sentence and <arg1> <arg2> buttons should be disabled", async function(arg0, arg1, arg2) {
    await click(taiko.button({id: arg0}))
    await taiko.waitFor(500);
    assert.ok(await taiko.button({id: arg1}).isDisabled());
    assert.ok(await taiko.button({id: arg2}).isDisabled());
});

step("User skips the next <count> sentneces user should land on Thank you page in Hindi", async function(count) {
	const skipbutton = taiko.button({id: 'skip_button'})
    for (let i = 0; i < count; i++) {
        await click(skipbutton)
        await taiko.waitFor(700)
    }
    await taiko.waitFor(1000)
    assert.ok(await text('प्रमाणित करने के लिए शुक्रिया!').exists())
});

step("User should see the <arg> button", async function(arg) {
	assert.ok(await link(arg).exists());
});

step("User should see State Wise distribution and Top Languages", async function() {
   
    await taiko.$("#indiaMapChart").exists();
    await taiko.$("#speakers_hours_chart").exists();
    
});

step("User should be able to change to preffered Language to English again", async function() {
    await click(taiko.text("हिंदी"))
    await click(taiko.link("English"));

});

step("Select Contribution Language as Hindi", async function() {
    await click("show All");
    await taiko.waitFor(500)
    await click(("हिंदी"));
});