const taiko = require('taiko');
const assert = require('assert');

const {
    button,
    goto,
} = require('taiko');

const profanityTestUrl = process.env.profanity_test_url_likhoindia;

step("Open Profanity Website for Likho India", async () => {
    await taiko.waitFor(500)
    await goto(profanityTestUrl, {waitForEvents:['loadEventFired']});
    await taiko.waitFor(500)
});

step("User should be able to see a textarea, text , Skip button, Progress bar, Not Profane Button , Profane button", async function () {
    assert.ok(await button({ id: 'cancel-edit-button' }).exists());
    assert.ok(await button({ id: 'skip_button' }).exists());
    assert.ok(await taiko.$('#editor-row').exists());
    assert.ok(await taiko.$('#captured-text').exists());
    assert.ok(await taiko.$('#progress-row').exists());
    assert.ok(await button({ id: 'submit-edit-button' }).exists());
});
