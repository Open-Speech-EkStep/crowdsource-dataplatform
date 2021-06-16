const taiko = require('taiko');
const assert = require('assert');

const {
    button,
    goto,
} = require('taiko');

const profanityTestUrl = process.env.profanity_test_url_sunoindia;

step("Open Profanity Website for Likho India", async () => {
    await taiko.waitFor(500)
    await goto(profanityTestUrl, {waitForEvents:['loadEventFired']});
    await taiko.waitFor(500)
});

step("When user click on Lets Go Button, user should see back button and test your speaker button", async function () {
    await click(taiko.button({ id: 'proceed-box' }))
    await taiko.waitFor(1500)
    assert.ok(await button({ id: 'back-btn' }).exists());
    assert.ok(await button({ id: 'test-mic-speakers-button' }).exists())
});

step("User should be able to click on test your speaker button, should show the speaker testing div", async function () {
    await click(button({ id: "test-mic-speakers-button" }));
    await taiko.waitFor(500);
    await click(taiko.button({ id: 'test-mic-speakers-details' }))
});

step("User should be able to close the Instructions and able to see Skip button, Progress bar, Not Profane Button , Profane button", async function () {
    await click(button({ id: "instructions_close_btn" }));
    assert.ok(await button({ id: 'cancel-edit-button' }).exists());
    assert.ok(await button({ id: 'skip_button' }).exists());
    assert.ok(await taiko.$('#progress-row').exists());
    assert.ok(await button({ id: 'submit-edit-button' }).exists());
});

step("Not Profane Profane button should be disbaled for suno india", async function() {
    assert.ok(await taiko.button({ id: "submit-edit-button" }).isDisabled());
    assert.ok(await taiko.button({ id: "cancel-edit-button" }).isDisabled());
});

step("When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear in profanity suno india", async function() {
    await taiko.waitFor(1000)
    await click(taiko.image({ id: "play" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "pause" }));
    await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));
});

step("When user clicks on resume button untill audio completes, Not Profane and profane button should be enabled", async function() {
    await taiko.waitFor(500)
    await click(taiko.image({ id: "resume" }));

     // Once the audio is complete , then correct button should be enabled
     await taiko.waitFor(5000)
     assert.ok(! await taiko.button({ id: "submit-edit-button" }).isDisabled());
     assert.ok(! await taiko.button({ id: "cancel-edit-button" }).isDisabled());
});

step("User clicks on not profane <arg0> , he should see next sentence and <arg1> <arg2> buttons should be disabled", async function (arg0, arg1, arg2) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(1000);
    assert.ok( await taiko.button({ id: arg1 }).isDisabled());
	assert.ok( await taiko.button({ id: arg2 }).isDisabled());
	await taiko.waitFor(1000);
});