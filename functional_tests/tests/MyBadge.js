const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    click,
    hover,
    link,
    setCookie,
    text,
    into,
    evaluate
} = require('taiko');
const path = require('path');

step("Select MyBadges from the dropdown", async function() {
    await setCookie("userId","789456123abcde", {url: process.env.test_url})
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
    
    if(tab="dekho-tab")
    {
        await click(link({id:tab}))
        await taiko.waitFor(1000)
        assert.ok(assert.ok(await text('Odia').isVisible()))
        assert.ok( await taiko.$('#Bronze_validation_dekho_Odia_badge').isVisible())
        assert.ok( await taiko.$('#Silver_validation_dekho_Odia_badge').isVisible())
        assert.ok(await taiko.$('#Gold_validation_dekho_Odia_badge').isVisible())
        assert.ok(assert.ok(await taiko.$('Assamese').isVisible()))
        assert.ok(await taiko.$('#Bronze_contribution_dekho_Assamese_badge').isVisible())
        assert.ok( await taiko.$({id :'Silver_contribution_dekho_Assamese_badge'}).isVisible())
        // Bronze_validation_badge

        assert.ok(await $('#Platinum_contribution_dekho_Assamese_placeholder').isVisible())
        assert.ok(await $('#Platinum_validation_dekho_Odia_placeholder').isVisible())
        assert.ok(await $('#Gold_contribution_dekho_Assamese_placeholder').isVisible())

    }
    else if(tab == "likho-tab")
    {
        assert.ok(await taiko.$('#Bronze_validation_likho_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#Silver_validation_likho_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#Gold_validation_likho_Bengali_badge').isVisible())
        assert.ok(await taiko.$('#Platinum_validation_blikho_Bengali_adge').isVisible())
        assert.ok(! await taiko.$('#Platinum_contribution_likho_Bengali_placeholder').isVisible())

        await click(link({id:tab}))
        await taiko.waitFor(300)

    }
    else if(tab == "suno-tab")
    {   
        await click(link({id:tab}))
        await taiko.waitFor(300)
        assert.ok(await text('No badge earned for suno india').isVisible())

    }
});

step("When user clicks on back button, user should land on Bhasha Daan home page", async function() {
	if (await taiko.text('Home').exists()) {
        assert.ok('Home button exists')
        await click(taiko.text("Home"))
        await taiko.waitFor(1000)
    }
    assert.ok(await text("Contribute and become a Bhasha Samarthak").isVisible());
    });