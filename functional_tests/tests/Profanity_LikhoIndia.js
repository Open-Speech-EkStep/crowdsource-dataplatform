const taiko = require('taiko');
const assert = require('assert');

const {
    button,
    goto,
} = require('taiko');

step("User should be able to see a textarea, text , Skip button, Progress bar, Not Profane Button , Profane button", async function () {
    assert.ok(await button({ id: 'cancel-edit-button' }).exists());
    assert.ok(await button({ id: 'skip_button' }).exists());
    assert.ok(await taiko.$('#editor-row').exists());
    assert.ok(await taiko.$('#captured-text').exists());
    assert.ok(await taiko.$('#progress-row').exists());
    assert.ok(await button({ id: 'submit-edit-button' }).exists());
});
