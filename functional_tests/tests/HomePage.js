const taiko = require('taiko');
const assert = require('assert');

const {
	button,
	write,
	click,
	image,
	link,
	clear,
	text,
	into
} = require('taiko');

step("Click <name> Button", async function (name) {
	// taiko.waitFor(async() => { await button(name).exists() });
	click(button);
});

step("About Us page should be displayed", async function() {
	const url = await taiko.currentURL();
	assert.ok(url.includes('about-us'));
});

step("Section should have text <title>", async function(title) {
	assert.ok(await text(title).exists());
});

step("<navlink> link must be active", async function(navlink) {
	assert.ok(await link(navlink).isDisabled())
	assert.ok(await text(navlink, taiko.below(link(navlink)).exists()))
});
