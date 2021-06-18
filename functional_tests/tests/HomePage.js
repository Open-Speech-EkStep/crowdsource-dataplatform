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
	assert.ok(button(name).exists())
	await click(button(name));
});

step("<page> page should be displayed", async function (page) {
	const pageName = {
		'About Us': 'about-us',
		'Badges': 'badges',
	}
	const url = await taiko.currentURL();
	assert.ok(url.includes(pageName[page]));
	await taiko.goBack();
});

step("Section should have text <title>", async function (title) {
	assert.ok(await text(title).exists());
});

step("<navlink> link must be active", async function (navlink) {
	assert.ok(await text(navlink, taiko.above(button(navlink))).exists())
});

step("Check If Current Tab is <module>", async function (module) {
	assert.ok(await button("Start Participating").exists())
	switch (module) {
		case 'Bolo India':
			assert.ok(await text('Help your language by donating your voice').isVisible())
			break;
		case 'Suno India':
			assert.ok(text('Help your language by transcribing audio into text').isVisible())
			break;
		case 'Likho India':
			assert.ok(text('Help your language by translating text').isVisible())
			break;
		case 'Dekho India':
			assert.ok(text('Help your language by labelling images').isVisible())
			break;
		default:
			assert.fail("Not a valid module")
	}
});

step("Clicking <btnName> should navigate to <module> Page", async function (btnName, module) {
	const btn = button(btnName)
	const pageName = {
		'Bolo India': 'boloIndia/home',
		'Suno India': 'sunoIndia/home',
		'Dekho India': 'dekhoIndia/home',
		'Likho India': 'likhoIndia/home'
	}
	assert.ok(await btn.exists());
	await click(btn);
	await taiko.waitFor(500);
	assert.ok((await taiko.currentURL()).includes(pageName[module]));
	await taiko.goBack();
	await taiko.waitFor(500)
});

step("Move tab to <tabName>", async function (tabName) {
	assert.ok(await button("Start Participating").exists())
	await click(link(tabName, taiko.above(button("Start Participating"))));
	await taiko.waitFor(500);
});

step("Check monthly goal section for value <value>", async function (value) {
	assert.ok(await text("monthly goal").isVisible());
	await taiko.scrollTo(text("monthly goal"));
	assert.ok(await text(value,taiko.toRightOf(text("monthly goal"))).isVisible());
});

step("Click <name> Link", async function(name) {
	assert.ok(await link(name).exists());
	await click(link(name));
});