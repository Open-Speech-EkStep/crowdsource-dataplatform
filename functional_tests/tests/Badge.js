const taiko = require('taiko');
const assert = require('assert');

const {
    text,
    link,
    scrollTo,
    click,
} = require('taiko');

step("Validate language dropdown, initiative tab, badges level & participation radios exist", async function () {
    await taiko.waitFor(1000);
    await text("How can you win Bhasha Samarthak Badges").exists();
    assert.ok(await taiko.dropDown({ id: 'languages' }).exists());

    assert.ok(await taiko.link({ id: 'suno' }).exists());
    assert.ok(await taiko.link({ id: 'bolo' }).exists());
    assert.ok(await taiko.link({ id: 'likho' }).exists());
    assert.ok(await taiko.link({ id: 'dekho' }).exists());

    assert.ok(await taiko.image({ id: 'bronze' }).exists());
    assert.ok(await taiko.image({ id: 'silver' }).exists());
    assert.ok(await taiko.image({ id: 'gold' }).exists());
    assert.ok(await taiko.image({ id: 'platinum' }).exists());

    assert.ok(await taiko.radioButton({id:'contribute-radio'}).exists());
    assert.ok(await taiko.radioButton({id:'validate-radio'}).exists());

    await taiko.text('Please keep contributing actively to stand a chance to get recognised.').exists();
    await taiko.text('Levels and badges may take upto 48 hours to update.').exists();
    await taiko.text('Your contribution will be validated before confirming the badge.').exists();
    
});
step("Validate default selected values", async function() {
	await taiko.waitFor(1000);
    assert.ok(await taiko.dropDown({ id: 'languages' }).value() === 'English');
    assert.ok(await taiko.link({ id: 'suno',class: 'active' }).exists());
    assert.ok(await taiko.$('#bronze_participation_badge', '.bg-white').exists());
    // assert.ok(await taiko.radioButton({id:'contribute_radio'}).isSelected());

});

step("User should select <arg> language from dropdown", async function (arg) {
    await taiko.dropDown({ id: 'languages' }).select(arg);
});

step("User should select <arg> initiative from tab", async function (arg) {
    await taiko.waitFor(2000)
    await scrollTo(link({ id: arg }))
    await click(taiko.link({ id: arg }));
});
step("should select <radioButton> radio button, <contributionMsg> text & <bronzeImg>,<silverImg>,<goldImg>,<platinumImg> image exist by default", async function(radioButton, contributionMsg, bronzeImg, silverImg, goldImg, platinumImg) {
	await taiko.waitFor(1000);
    if(radioButton== ""){

    } else {
        assert.ok(await taiko.radioButton({id:radioButton}).exists());
        await click(taiko.radioButton({ id: radioButton }))
        await taiko.waitFor(1000);
    }

    assert.ok(await taiko.text(contributionMsg).isVisible());
    const bronzeBadge = taiko.image({ id: bronzeImg });
    assert.ok(await bronzeBadge.exists());
    const silverBadge = taiko.image({ id: silverImg });
    assert.ok(await silverBadge.exists());
    const goldBadge = taiko.image({ id: goldImg });
    assert.ok(await goldBadge.exists());
    const platinumBadge = taiko.image({ id: platinumImg });
    assert.ok(await platinumBadge.exists());
});

step("User select <badgeLevel> badge level", async function(badgeLevel) {
    assert.ok(await taiko.$(`#${badgeLevel}`).exists());
	await click(taiko.$(`#${badgeLevel}`));
});

