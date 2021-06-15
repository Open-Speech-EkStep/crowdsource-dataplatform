const taiko = require('taiko');
const assert = require('assert');

const {
    button,
    goto,
} = require('taiko');

const profanityTestUrl = process.env.profanity_test_url_dekhoindia;

step("Open Profanity Website for Dekho India", async () => {
    await taiko.waitFor(500)
    await goto(profanityTestUrl, {waitForEvents:['loadEventFired']});
    await taiko.waitFor(500)
});

step("User should be able to see a image , Skip button, Progress bar, Not Profane Button , Profane button", async function () {
    assert.ok(await button({ id: 'cancel-edit-button' }).exists());
    assert.ok(await button({ id: 'skip_button' }).exists());
    assert.ok(await taiko.$('#dekho-image').exists());
    assert.ok(await taiko.$('#progress-row').exists());
    assert.ok(await button({ id: 'submit-edit-button' }).exists());
});

step("Not Profane Profane button should be enabled for dekho india", async function() {
    assert.ok(! await taiko.button({ id: "submit-edit-button" }).isDisabled());
    assert.ok(! await taiko.button({ id: "cancel-edit-button" }).isDisabled());
});
