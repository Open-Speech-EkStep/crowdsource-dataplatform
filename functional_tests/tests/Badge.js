const taiko = require('taiko');
const assert = require('assert');

const {
} = require('taiko');

step("Validate initiative & language dropdown exist", async function () {
    await text("Levels and Badging").exists();
    assert.ok(await taiko.dropDown({ id: 'initiative' }).exists());
    assert.ok(await taiko.dropDown({ id: 'languages' }).exists());
});

step("User should select select <arg> initiative from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'initiative' }).select(arg);
});

step("User should select <arg> langauge from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'languages' }).select(arg);
});

step("should select <arg0> tab, <arg1>, <arg2>, <arg3>,<arg4> text &  <arg5>image exist by default", async function (arg0,arg1, arg2,arg3, arg4,arg5) {
    assert.ok(await link(arg0).exists());
    await click(arg0);
    await taiko.text(arg1).exists();
    await taiko.text(arg2).exists();
    await taiko.text(arg3).exists();
    await taiko.text(arg4).exists();
    const bronzeBadge = taiko.image({ id: arg5 });
    assert.ok(await bronzeBadge.exists());
});
