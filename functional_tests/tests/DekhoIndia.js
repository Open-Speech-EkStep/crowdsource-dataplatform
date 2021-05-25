const taiko = require('taiko');
const assert = require('assert');


const {
    button,
    write,
    click,
    link,
    clear,
    text,
    into
} = require('taiko');

step("Validate Dekho India content", async function() {
	assert.ok(await text('Help your language by labelling images').exists());
    assert.ok(await text('Validate').exists());
    assert.ok(await text('Label').exists());
});

step("User should see the top Language graph and other stats for Dekho India", async function() {
	assert.ok(await text("Your language and top 3 most contributed languages").exists());
	assert.ok(await text("Images labelled and validated").exists());
    assert.ok(await text("Languages").exists());
    assert.ok(await text("People participated").exists());
    assert.ok(await text("Images labelled").exists());
    assert.ok(await text("Text validated ").exists());
});

step("When user clicks on back button, user should land on Dekho India home page", async function() {
    if (await taiko.text('Back').exists()) {
        assert.ok('Back button exists')
        await click(taiko.text("Back"))
        await taiko.waitFor(650)
    }
    assert.ok(await text("Help your language by labelling images").exists());

});

step("Close button should close the pop up and user should see Dekho India Home page", async function() {
		if (await taiko.text('User Details').exists()) {
			assert.ok('user details pop-up exists')
			await taiko.waitFor(700)
			await click(taiko.button({ class: 'close float-right' }))
		}
	
		assert.ok(await text("Help your language by labelling images").exists());
	});

step("User clears the edit field should disable the buttons again", async function() {
	await clear(taiko.textBox({id:'edit'}));
	await taiko.waitFor(500)
	assert.ok( await button({ id: 'submit-edit-button' }).isDisabled())
    assert.ok( await button({ id: 'cancel-edit-button' }).isDisabled())
});


step("<arg0> should be enabled , <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
    await taiko.waitFor(3000);
    assert.ok(! await taiko.button({ id: arg0 }).isDisabled());
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
    assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
});

step("User should see the text <text>", async function(text) {
	 assert.ok(taiko.text(text).exists())
	 assert.ok(taiko.text(text).isVisible())
});

step("When user clicks on Contribute more button , user should see no data available message for dekho India", async function() {
	await taiko.waitFor(500)
    await click(link('Contribute More'))
    await taiko.waitFor(2000)
    assert.ok(await text('Thank you for your enthusiasm to label the images').exists())
});


step("user should see the Virtual Keyboard button", async function() {
	await taiko.waitFor(1000)
	await click(button({id:"virtualKeyBoardBtn"}))
	await taiko.waitFor(500)
    assert.ok(await text("न").exists());
	assert.ok(await text("स").exists());
	
	await taiko.button({id :"keyboardCloseBtn"}).exists()
	await click(button({id:"keyboardCloseBtn"}))
	await taiko.waitFor(300)
});

step("User clicks on <arg0> , he should see next sentence and <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
    await click(taiko.button({ id: arg0 }))
    await taiko.waitFor(1000);
    assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
	await taiko.waitFor(1000);
});

step("User should see no data available message", async function() {
	await taiko.waitFor(1000)
    assert.ok(await text('Thank you for your enthusiasm to validate the image text').exists())
});

step("User clicks on <arg0> he should see thank you page and should be able to see bronze Badge", async function(arg0) {
	await taiko.waitFor(1000)
	assert.ok(await text("You’ve earned your Bronze Badge").isVisible());
	assert.ok(await text("National Language Translation Mission").isVisible());
	assert.ok(await text("Share it with your friends and family").isVisible());
	assert.ok(await Image({id:"reward-img"}).isVisible());
});