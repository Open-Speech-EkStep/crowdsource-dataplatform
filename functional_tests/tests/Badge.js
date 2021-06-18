const taiko = require('taiko');
const assert = require('assert');

const {
} = require('taiko');
const path = require('path');
const { performAPIRequest } = require('../../crowdsource-ui/src/assets/js/utils');

step("Validate initiative & language dropdown exist", async function () {
    await text("Levels and Badging").exists();
    assert.ok(await taiko.dropDown({ id: 'initiative' }).exists());
    assert.ok(await taiko.dropDown({ id: 'languages' }).exists());
});

step("When user select <arg> initiative from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'initiative' }).select(arg);
});



