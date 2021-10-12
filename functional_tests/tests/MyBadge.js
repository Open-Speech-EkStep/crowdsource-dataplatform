const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    click,
    hover,
    scrollUp,
    link,
    setCookie,
    text,
    into,
    evaluate
} = require('taiko');
const path = require('path');

step("Select MyBadges from the dropdown", async function() {
    await setCookie("userId","789456123abcde", {url: process.env.api_test_url})
	await click(taiko.link({ id: "nav-user" }));
    assert.ok(await text('My Badges').isVisible());
    await click(text('My Badges'));
    await taiko.waitFor(1000);
    assert.ok(await text('Your Medal Gallery').isVisible())
    assert.ok(await text('Please keep contributing actively to stand a chance to get recognised.').isVisible())
    assert.ok(await text('Your contribution will be validated before confirming the badge.').isVisible())
    assert.ok(await text('Levels and badges may take upto 48 hours to update.').isVisible())

})

step("<congratstext> text should be visible", async function(congratstext) {
    await taiko.waitFor(500)
    assert.ok(await text(congratstext).isVisible());
});

step("when user navigates to <tab> tab user should see badges", async function(tab) {
    
    if(tab=="ocr-tab")
    {
        await scrollUp(5000);
        await click(link({id:tab}))
        await taiko.waitFor(1000)
        assert.ok(await text('Odia').isVisible())
        assert.ok( await taiko.$('#badge_1_validation_ocr_Odia_badge').isVisible())
        assert.ok( await taiko.$('#badge_2_validation_ocr_Odia_badge').isVisible())
        assert.ok(await taiko.$('#badge_3_validation_ocr_Odia_badge').isVisible())
        assert.ok(await text('Assamese').isVisible())
        assert.ok(await taiko.$('#badge_1_contribution_ocr_Assamese_badge').isVisible())
        assert.ok(await taiko.$('#badge_2_contribution_ocr_Assamese_badge').isVisible())
        // Bronze_validation_badge

        assert.ok(await taiko.$('#badge_4_contribution_Assamese_ocr_placeholder').isVisible())
        assert.ok(await taiko.$('#badge_4_validation_Odia_ocr_placeholder').isVisible())
        assert.ok(await taiko.$('#badge_3_contribution_Assamese_ocr_placeholder').isVisible())


        await click(taiko.$('#badge_2_contribution_ocr_Assamese_badge'));
        assert.ok( await taiko.$('#badge-popover').isVisible())

    }
    else if(tab== "parallel-tab")
    {
        await scrollUp(5000);
        await click(link({id:tab}))
        await taiko.waitFor(300)
        assert.ok(await taiko.$('#badge_1_validation_parallel_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#badge_2_validation_parallel_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#badge_3_validation_parallel_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#badge_4_validation_parallel_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#badge_4_contribution_Bengali_parallel_placeholder').isVisible())

    }
    else if(tab== "asr-tab")
    {   await scrollUp(5000);
        await click(link({id:tab}))
        await taiko.waitFor(300)
        assert.ok(await text('No badge earned for Suno India').isVisible())

    }
});

step("When user clicks on back button, user should land on Bhasha Daan home page", async function() {
    await scrollUp(5000);
    if (await taiko.text('Home').exists()) {
        assert.ok('Home button exists')
        await click(taiko.text("Home"))
        await taiko.waitFor(1500)
    }
    assert.ok(await text("Contribute and become a Bhasha Samarthak").isVisible());
});