const taiko = require('taiko');
const assert = require('assert');

const {
} = require('taiko');

step("Validate initiative & language dropdown exist", async function () {
    await taiko.waitFor(1000);
    await text("Levels and Badging").exists();
    assert.ok(await taiko.dropDown({ id: 'initiative' }).exists());
    assert.ok(await taiko.dropDown({ id: 'languages' }).exists());
});

step("User should select <arg> language from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'languages' }).select(arg);
});

step("User should select <arg> initiative from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'initiative' }).select(arg);
});

step("should select <tabName> tab, <levelText>, <contributionText>, <badgeText>, <badgInfotext> text & <bronzeImg>,<silverImg>,<goldImg>,<platinumImg> image exist by default", async function (tabName,levelText, contributionText,badgeText, badgInfotext,bronzeImg, silverImg,goldImg,platinumImg) {
    await taiko.waitFor(1000);
    if(tabName== ""){

    } else {
        assert.ok(await link(tabName).exists());
        await click(tabName);
        await taiko.waitFor(1000);
    }
    await taiko.text(levelText).exists();
    await taiko.text(contributionText).exists();
    await taiko.text(badgeText).exists();
    await taiko.text(badgInfotext).exists();
    const bronzeBadge = taiko.image({ id: bronzeImg });
    assert.ok(await bronzeBadge.exists());
    const silverBadge = taiko.image({ id: silverImg });
    assert.ok(await silverBadge.exists());
    const goldBadge = taiko.image({ id: goldImg });
    assert.ok(await goldBadge.exists());
    const platinumBadge = taiko.image({ id: platinumImg });
    assert.ok(await platinumBadge.exists());
});
