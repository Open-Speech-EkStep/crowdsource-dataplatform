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