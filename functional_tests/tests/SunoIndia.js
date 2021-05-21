const taiko = require('taiko');
const assert = require('assert');


const {
    button,
    write,
    click,
    link,
    clear,
    text,
    into
} = require('taiko');


step("Select <SunoIndiaLink>from header", async function(SunoIndiaLink) {
    
    assert.ok(await link(SunoIndiaLink).exists());
    await taiko.waitFor(500);  
    await click(SunoIndiaLink);
});
step("Validate Suno India content", async function() {
    assert.ok(await text('Help your language by transcribing audio into text').exists());
    assert.ok(await text('Validate').exists());
    assert.ok(await text('Transcribe').exists());
});

step("Username field should be present", async function() {
    await taiko.waitFor(1000)
    assert.ok(await taiko.textBox({ id: 'username' }).exists())
});

step("When user clicks on View all Details buttton user should be able to see <arg0> , <arg1>", async function(arg0, arg1) {
    await click(taiko.link({ id: 'viewAllDetailsBtn' }))
    await taiko.waitFor(1000)
    assert.ok(await text(arg0).exists());
    assert.ok(await text(arg1).exists());
});


step("Add <usrnm> Username", async function (usrnm) {
    if (await taiko.text('User Details').exists()) {
        const username = taiko.textBox({ id: 'username' })
        await taiko.waitFor(700)
        await clear(taiko.textBox({id:'username'}));
        await taiko.waitFor(500)
        await write(usrnm, into(username))
        await taiko.waitFor(500)
    }
});

step("User should be able to close the Instructions , user should see Skip button , Play Button , username , Cancel , Submit and speaker button", async function () {
    await click(button({ id: "instructions_close_btn" }))
    assert.ok(await button({ id: 'submit-edit-button' }).exists())
    assert.ok(await button({ id: 'cancel-edit-button' }).exists())
    assert.ok(await button({ id: 'skip_button' }).exists())
    assert.ok(await button({ id: 'test-mic-speakers-button' }).exists())
});

step("When user clicks on the Test Speaker button, user should see <arg0>", async function (arg0) {
    await click(taiko.button({ id: "test-mic-speakers-button" }))
    assert.ok(await button({ id: arg0 }).exists())
});


step("user should see the Keyboard", async function() {
    assert.ok(await text("प").exists());
    assert.ok(await text("न").exists());
    assert.ok(await text("स").exists());
});

step("User clicks on  <arg0> button user should see <arg1> and <arg2> , <arg3> should be  enabled", async function(arg0, arg1, arg2, arg3) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(500)
    assert.ok(await text(arg1).exists());
    assert.ok(await text(arg2).exists());
    assert.ok(! await taiko.button({ id: arg3 }).isDisabled());    
});

step("User click on <textfield> field <submitbtn> should be enabled", async function(textfield, submitbtn) {  
        const text = taiko.textBox({ id: textfield })
        await taiko.waitFor(500)
        await write('मुगल शासक', into(text))
        assert.ok(! await taiko.button({ id: submitbtn }).isDisabled());
});

step("User should see the top Language graph and other stats", async function() {
    assert.ok(await text("Your language and top 3 most contributed languages").exists());
    assert.ok(await text("Languages").exists());
    assert.ok(await text("People participated").exists());
    assert.ok(await text("Hrs transcribed").exists());
    assert.ok(await text("Hrs validated").exists());
});

step("User details popup should appear and close button should close the pop up", async function() {
	if (await taiko.text('User Details').exists()) {
        assert.ok('user details pop-up exists')
        await taiko.waitFor(500)
        await click(taiko.button({ class: 'close float-right' }))
    }

    assert.ok(await text("Help your language by transcribing audio into text").exists());
});

step("When user clicks on back button, user should land on home page", async function() {
    if (await taiko.text('Back').exists()) {
        assert.ok('Back button exists')
        await click(taiko.text("Back"))
        await taiko.waitFor(650)
    }
    assert.ok(await text("Help your language by transcribing audio into text").exists());

});

step("User click on <type> field and type <hinditext> submit and cancel button should be enabled", async function(type, hinditext) {
    const editfield = taiko.textBox({ id: type })
    await taiko.waitFor(500)
    await write(hinditext, into(editfield))
    assert.ok(! await button({ id: 'submit-edit-button' }).isDisabled())
    assert.ok(! await button({ id: 'cancel-edit-button' }).isDisabled())
});
step("When User clicks on <type> field and type <txt> submit and cancel button should be enabled", async function(type, txt) {
    const editfield = taiko.textBox({ id: type })
    await taiko.waitFor(500)
    await write(txt, into(editfield))
    assert.ok(! await button({ id: 'submit-edit-button' }).isDisabled())
    assert.ok(! await button({ id: 'cancel-edit-button' }).isDisabled())
});

step("When user clicks on submit button user should see <thankutext>", async function(thankutext) {
    await click(taiko.button({ id: 'submit-edit-button'}))
    await taiko.waitFor(500)
    await taiko.text(thankutext).exists()
});

step("When user clicks on Play button, Pause button should appear and when user clicks on pause, replay should appear", async function() {
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "replay" }));

});

step("Once user clicks on Others Radio button in transcribe flow, Submit button should be enabled", async function() {
    await taiko.waitFor(500)
    assert.ok(await taiko.text("Others").exists())
    assert.ok(await taiko.text("Offensive").exists())
    await click(taiko.text("Others"))
    await taiko.waitFor(500)
    assert.ok(! await taiko.button({ id: "report_submit_id" }).isDisabled()); 

});

step("When user skips the rest of the <count> sentences , User should see Thank you Page", async function (count) {
    const skipbutton = taiko.button({ id: 'skip_button' })
    for (let i = 0; i < count; i++) {
        await click(skipbutton)
        await taiko.waitFor(500)
    }
    await taiko.waitFor(5000)
    assert.ok(await text('Thank you for contributing!').exists())
});

step("When user click on Lets Go Button", async function() {
    await click(taiko.button({ id: 'proceed-box' }))
    await taiko.waitFor(1500)
    
});

step("Check <card> option should be <state> on Home page", async function(card,state) {
    
    if(card=="Transcribe"&& state=="disabled")
    {
        assert.ok(await text('Not collecting contributions for selected language').isVisible());

    }
    if(card=="Correct"&& state=="disabled")
    {
        assert.ok(await text('No validation data available for selected language').isVisible());
    }
    if(card=="Transcribe"&& state=="enabled")
    {
        assert.ok(! await text('Not collecting contributions for selected language').isVisible());
    }
    if(card=="Correct"&& state=="enabled")
    {
        assert.ok(! await text('No validation data available for selected language').isVisible());
    }
});

step("when user clicks on the Validate more button user should no data available message", async function() {
    await click(link('Validate More'))
    await taiko.waitFor(1000)
    assert.ok(await text('Thank you for validating!').exists())
});

step("When user clicks on Contribute more button , user should no data available message", async function() {
    await click(link('Contribute More'))
    await taiko.waitFor(1000)
    assert.ok(await text('Thank you for your enthusiasm to transcribe the recordings.').exists())
    assert.ok(await link('Back to SunoIndia Home').exists());
});

step("When user clicks on back to Suno India home button, user should land on home page", async function() {
    await taiko.waitFor(500)
    await click(link({id:"start_contributing_id"}))
    await taiko.waitFor(500)
    assert.ok(await text('Help your language by transcribing audio into text').exists());
});