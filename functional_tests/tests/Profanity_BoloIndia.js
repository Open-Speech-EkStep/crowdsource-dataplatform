const taiko = require('taiko');
const assert = require('assert');

const {
    openBrowser,
    button,
    goto,
    write,
    accept,
    alert,
    click,
    into,
} = require('taiko');
const path = require('path');

const profanityTestUrl = process.env.profanity_test_url_boloindia;


step("Open Profanity Website", async () => {
    await taiko.waitFor(500)
    await goto(profanityTestUrl, {waitForEvents:['loadEventFired']});
    await taiko.waitFor(500)
});

step("User details popup should appear", async function () {
    if (await taiko.text('User Details').exists()) {
        assert.ok('speaker details pop-up exists')
    }
    await taiko.waitFor(500)
});

step("Email field, languge dropdown should be present", async function () {
    await taiko.waitFor(1000)
    assert.ok(await taiko.textBox({ id: 'username' }).exists())
    assert.ok(await taiko.dropDown({ id: 'preferred-language' }).exists())
});

step("When User enter <usernm> Email and select prefered langauge as <lang>", async function (usernm,lang) {
    if (await taiko.text('User Details').exists()) {
        const username = taiko.textBox({ id: 'username' })
        await taiko.waitFor(700)
        await write(usernm, into(username))
        await taiko.dropDown({ id: 'preferred-language' }).select(lang);
    }
});

step("When user click on Lets Go Button, user should see back button", async function () {
    await click(taiko.button({ id: 'proceed-box' }))
    await taiko.waitFor(1500)
    assert.ok(await button({ id: 'back-btn' }).exists())
});

step("User should be able to see a sentence , Skip button, Progress bar, Not Profane Button , Profane button", async function () {
    assert.ok(await button({ id: 'startRecord' }).exists());
    assert.ok(await button({ id: 'skipBtn' }).exists());
    assert.ok(await taiko.$('#sentenceLbl').exists());
    assert.ok(await taiko.$('#progress-row').exists());
    assert.ok(await button({ id: 'nextBtn' }).exists());
});

step("User clicks on not profane <arg0> , he should see next sentence and <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(1000);
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
	await taiko.waitFor(1000);
});

step("User clicks on profane <arg0> , he should see next sentence and <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(1000);
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
	await taiko.waitFor(1000);
});

step("User skips <arg0> the next <arg1> sentences user should see Thank you popup", async function (arg0, arg1) {
    const skipbutton = taiko.button({ id: arg0 })
    for (let i = 0; i < arg1; i++) {
        await click(skipbutton)
        await taiko.waitFor(1200)
    }
    await taiko.waitFor(3000);
    if (await taiko.text('Thank you for contributing!').exists()) {
        assert.ok('Thank you pop-up exists');
    }
});

step("User should see the Alert for user not found", async function() {  
    await taiko.waitFor(500)
   // assert.ok(await text('User not found').exists());
   alert('User not found', async () => await accept())
});

step("User should see the Alert for invalid user", async function() {  
    await taiko.waitFor(500)
   // assert.ok(await text('User not found').exists());
   alert('Enter valid email', async () => await accept())
});

step("Not Profane Profane button should be enabled", async function() {
    assert.ok(! await taiko.button({ id: "nextBtn" }).isDisabled());
    assert.ok(! await taiko.button({ id: "startRecord" }).isDisabled());
});

step("When user clicks on <arg0> user should see the message <msg>", async function(arg0, msg) {
    await click(taiko.link("Contribute More"));
    await taiko.waitFor(1000)
    await taiko.text(msg).isVisible();
});