const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    dropDown,
    closeBrowser,
    overridePermissions,
    goto,
    alert,
    above,
    accept,
    write,
    click,
    checkBox,
    listItem,
    toLeftOf,
    hover,
    link,
    text,
    into,
    textBox,
    evaluate
} = require('taiko');
const headless = process.env.headless_chrome.toLowerCase() === 'true'; 


beforeSuite(async () => {
    await openBrowser({
        headless: headless
    })
});

afterSuite(async () => {
    await closeBrowser();
});

step("Opening Vakyansh", async () => {
await goto("https://test-dot-ekstepspeechrecognition.el.r.appspot.com");
});

step("Search for About Us button", async function() {
    await link('About Us').exists();
    click('About Us');	
});

step("Validate about us content", async function() {
    await text('ABOUT THE ORGANISATION').exists()
});

step("Start Recording button is disabled", async function() {
    const startRecordingButton = taiko.button({id:'start_recording'})
    //await startRecordingButton.exists()
    await taiko.waitFor(1000)
    if(!startRecordingButton.isDisabled())
    assert.fail('the start recording button is not disabled')
});

step("Select Language <language> enables the Start Recording button", async function(language) {

    const selectLanguageDropDown = taiko.dropDown({id:'languageTop'})
    //await selectLanguageDropDown.exists();
    await selectLanguageDropDown.select(language)
    await taiko.waitFor(1000)
    if(await taiko.button({id:'start_recording'}).isDisabled())
    assert.fail('Start Recording Button should have been enabled')

});

step("Language Drop Down should have <language> as the default language", async function(language) {
    const selectLanguageDropDown = taiko.dropDown({id:'language'})
    const defaultval = await selectLanguageDropDown.value()
    console.log(defaultval)
    assert.equal(defaultval,language+' (Select languages)')
});

step("Start Recording Button should be for <language> Language", async function(language) {
    const startRecordingButton = taiko.button({id:'start-record'})
    if(! await text("START RECORDING IN "+language).exists())
    assert.fail('Button is not for ODIA Language')

    assert.equal(await startRecordingButton.isDisabled(),false)
});


step("Speaker details popup should appear and close button should close the pop up", async function() {
    
    if(await taiko.text('Speaker Details').exists())
       { assert.ok('speaker details pop-up exists')
        await click(taiko.button({class:'close float-right'}))
        assert.ok(await taiko.button({id:'start_recording'}).exists())

}
});

step("When user selects <lang> language and click on start recording button", async function(lang) {
    const selectLanguageDropDown = taiko.dropDown({id:'languageTop'})
    const startRecordingButton = taiko.button({id:'start_recording'})
    //await selectLanguageDropDown.exists();
    await selectLanguageDropDown.select(lang)
    await taiko.waitFor(1000)
    if(await startRecordingButton.exists())
    await click(startRecordingButton)
});

step("By default the Lets Go button should be disabled", async function() {
	assert.ok(await taiko.button({id:'proceed-box'}).isDisabled())
});

step("Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present", async function() {
    await taiko.waitFor(1000)
    assert.ok(await taiko.textBox({id:'username'}).exists())
    assert.ok(await taiko.dropDown({id:'mother-tongue'}).exists())
    assert.ok(await taiko.dropDown({id:'age'}).exists())
    assert.ok(await taiko.radioButton({id:'other-check'}).exists())
    assert.ok(await taiko.radioButton({id:'female-check'}).exists())
    assert.ok(await taiko.radioButton({id:'male-check'}).exists())
});

step("Hover on the Lets Go button should give some message", async function() {
    await taiko.waitFor(2000)
    await hover(button({id:'proceed-box'}))
    assert.ok(await taiko.text('Please agree to the Terms and Conditions before proceeding').exists())
    
});

step("if a user enter username and click on Not you change user button , the field should be cleared", async function() {
    const usernameFiled = taiko.textBox({id:'username'})
    await taiko.waitFor(1500)
    await write('TestUser', into(textBox("Enter preferred username")))
    const notYouButton = taiko.$('#resetBtn')
    await click(notYouButton)
    assert.equal(await usernameFiled.value(),'')

});

step("Once user agree to terms and conditions Lets Go the button should be enabled", async function() {
    await click(checkBox({id:'tnc'}))
    assert.equal(await taiko.button({id:'proceed-box'}).isDisabled(),false)
});

step("user should see the Sign In pop up", async function() {
	assert.ok(await taiko.text('Sign In').exists())
});

step("When user clicks on the <arg> button", async function(arg) {
	await link(arg).exists();
     click(arg);	
});

step("When user clicks on the Are you a validator button", async function() {
	await link('Are you a Validator? Login here').exists();
     click('Are you a Validator? Login here');	
});

step("When user clicks on cross button, pop up should be closed", async function() {
    await taiko.waitFor(1000)
    await click(taiko.$('.close'))
    await taiko.waitFor(1000)
    assert.equal(await taiko.text('Sign In').exists(),false)
});

step("And User enter random Username and selects Age , Mother tongue ,gender", async function() {

    if(await taiko.text('Speaker Details').exists())
    {
        const username =  taiko.textBox({id:'username'})
    await taiko.waitFor(700)
    await write('Dummy user',into(username))
    await taiko.dropDown({id:'mother-tongue'}).select('Hindi')
    await taiko.dropDown({id:'age'}).select(3)
    await click(taiko.radioButton({id:'male-check'}))
    }
});

step("when user click on Lets Go Button, user should see instructions to record", async function() {
    await click(taiko.button({id:'proceed-box'}))
    assert.ok(await text('Recording Instructions').exists(),'Not able to see instructions')

});

step("When user closes the Instructions , user should see a sentence , Skip button , Start Recording Button , username", async function() {
    await click(taiko.$('.close'))
    assert.ok(await button({id:'startRecord'}).exists())
    assert.ok(await button({id:'skipBtn'}).exists())
    assert.ok(await taiko.$('#sentenceLbl').exists())
    assert.ok(await text('Dummy User').exists())
});

step("When user clicks on <arg0> button, <arg1> button should appear", async function(arg0,arg1) {
    await click(button(arg0))
    await overridePermissions('https://test-dot-ekstepspeechrecognition.el.r.appspot.com',['audioCapture']);
    await taiko.waitFor(3000)
    assert.ok(await button(arg1).exists())
});

step("When user skips all the rest of the <count> sentences , User should see Thank you Page", async function(count) {
   const skipbutton = taiko.button({id:'skipBtn'})
    for(let i=0;i<count;i++)
    {
            await click(skipbutton)
            await taiko.waitFor(500)
    }
    await taiko.waitFor(4000)
    assert.ok(await text('Thank you for contributing!').exists())
    
});

step("when user clicks on the Contribute More button, user shall see the Instructions page again", async function() {
    await click(link('Contribute More'))
    await taiko.waitFor(1000)
    assert.ok(await text('Recording Instructions').exists(),'Not able to see instructions')
});