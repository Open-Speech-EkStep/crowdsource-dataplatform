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

step("Select <SunoIndiaLink> from header", async function(SunoIndiaLink) {    
    await taiko.waitFor(1000);  
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

step("When user clicks on the Test Speaker button, user should see <arg0>", async function (arg0) {
    await click(taiko.button({ id: "test-mic-speakers-button" }))
    assert.ok(await button({ id: arg0 }).exists())
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
        await write('ಗಹಹಜಲಲ', into(text))
        await taiko.waitFor(500)
        assert.ok(! await taiko.button({ id: submitbtn }).isDisabled());
});

step("User should see the top Language graph and other stats", async function() {
    assert.ok(await text("Your language and top 3 most contributed languages").exists());
    assert.ok(await text("Languages").exists());
    assert.ok(await text("People participated").exists());
    assert.ok(await text("Hrs transcribed").exists());
    assert.ok(await text("Hrs validated").exists());
});

// step("User details popup should appear and close button should close the pop up", async function() {
// 	if (await taiko.text('User Details').exists()) {
//         assert.ok('user details pop-up exists')
//         await taiko.waitFor(700)
//         await click(taiko.button({ class: 'close float-right' }))
//     }

//     assert.ok(await text("Help your language by transcribing audio into text").exists());
// });

step("When user clicks on back button, user should land on home page", async function() {
    await taiko.waitFor(650)
    if (await taiko.text('Home').exists()) {
        assert.ok('Home button exists')
        await click(taiko.text("Home"))
        await taiko.waitFor(1500)
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
    await taiko.waitFor(1200)
});

step("When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear", async function() {
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));
    await taiko.waitFor(5500)
});

step("User clicks on Play button, and then on pause button, then clicks on <type> field and type <hinditext>, then resume, submit button should be disabled", async function(type, hinditext) {
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
    const editfield = taiko.textBox({ id: type })
    await taiko.waitFor(500)
    await write(hinditext, into(editfield));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));
    await taiko.waitFor(5500)
    assert.ok(await button({ id: 'submit-edit-button' }).isDisabled());
    await clear(editfield)
});

step("When user skips the rest of the <count> sentences , User should see Thank you Page", async function (count) {
    const skipbutton = taiko.button({ id: 'skip_button' })
    for (let i = 0; i < count; i++) {
        await click(skipbutton)
        await taiko.waitFor(1200)
    }
    await taiko.waitFor(5000)
    assert.ok(await text('Thank you for contributing!').exists())
});

step("When user click on Lets Go Button", async function() {
    await click(taiko.button({ id: 'proceed-box' }))
    await taiko.waitFor(1200)
});

step("Check <card> option should be <state> on Home page", async function(card,state) {
    
    if(card=="Transcribe"&& state=="disabled")
    {
        assert.ok(await text('Not collecting contributions for selected language').isVisible());

    }

    if(card=="Transcribe"&& state=="enabled")
    {
        assert.ok(! await text('Not collecting contributions for selected language').isVisible());
    }

    if(card=="Label"&& state=="disabled")
    {
        assert.ok(await text('Not collecting contributions for selected language').isVisible());
    }

    if(card=="Label"&& state=="enabled")
    {
        assert.ok(! await text('Not collecting contributions for selected language').isVisible());
    }

    if(card=="Validate"&& state=="disabled")
    {
        assert.ok(await text('No validation data available for selected language').isVisible());
    }

    if(card=="Validate"&& state=="enabled")
    {
        assert.ok(! await text('No validation data available for selected language').isVisible());
    }

});


step("When user clicks on submit button for Odia language user should see <thankutext>", async function(thankutext) {
    await click(taiko.button({ id: 'submit-edit-button'}))
    await taiko.waitFor(3000)
    await taiko.text(thankutext).exists()
});

step("User plays the audio , <needchange> should be enabled & <arg1> should be disabled" , async function(needchange,arg1) {
    await taiko.waitFor(500)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(1000)
    assert.ok(! await taiko.button({ id: needchange }).isDisabled());
    assert.ok(  await taiko.button({ id: arg1 }).isDisabled());
    // Once the audio is complete , then correct button should be enabled
    await taiko.waitFor(5000)
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
});

step("User clicks on Play button, and then on pause button, then clicks on <needchange>, then clicks on <edit> field and type <hinditext>, then resume, submit button should be disabled, then skip", async function(needchange, type, hinditext) {
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
    await click(taiko.button({ id: needchange }))
    await taiko.waitFor(500)
    const editfield = taiko.textBox({ id: type })
    await taiko.waitFor(500)
    await write(hinditext, into(editfield));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));
    await taiko.waitFor(5500)
    assert.ok(await button({ id: 'submit-edit-button' }).isDisabled());
    await click(taiko.button({ id: 'skip_button' }))
});

step("Validate Thank you page content for Suno India", async function() {
	assert.ok(await text('Thank you for contributing!').exists())
	assert.ok(await text('100 hrs').exists())
});

step("When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should visible", async function() {
	await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
});

step("User clicks on resume button", async function() {
	await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));
    await taiko.waitFor(4000)
});
