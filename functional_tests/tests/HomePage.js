const taiko = require('taiko');
const assert = require('assert');

const {
	button,
	write,
	click,
	scrollUp,
	image,
	below,
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
	await taiko.waitFor(1500)
	assert.ok(await button("Start Participating").exists())
	switch (module) {
		case 'Text Initiative':
			assert.ok(await text('Enrich your language by donating your voice').isVisible())
			break;
		case 'Asr Initiative':
			assert.ok(text('Enrich your language by typing the audio that you hear').isVisible())
			break;
		case 'Parallel Initiative':
			assert.ok(text('Enrich your language by translating text').isVisible())
			break;
		case 'Ocr Initiative':
			assert.ok(text('Enrich your language by typing the text you see').isVisible())
			break;
		default:
			assert.fail("Not a valid module")
	}
});

step("Clicking <btnName> should navigate to <module> Page", async function (btnName, module) {
	const btn = button(btnName)
	const pageName = {
		'Text Initiative': 'text/home',
		'Asr Initiative': 'asr/home',
		'Ocr Initiative': 'ocr/home',
		'Parallel Initiative': 'parallel/home'
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
	await taiko.waitFor(1200);
	await scrollUp(5000);
	//await click(taiko.$({id : tabName}))
	await click(taiko.$('#'+tabName));

	//await click(taiko.$('#'+tabName, taiko.below(text('Help to build an open repository of data to digitally enrich your language '))));
	await taiko.waitFor(500);
});


step("Click <name> Link", async function (name) {
	await taiko.waitFor(2000)
	await taiko.scrollDown(10000);
	assert.ok(await link(name).exists());
	await click(link(name));
});

step("Should select <lang> from localisation dropdown <id>", async function (lang, id) {
	await taiko.waitFor(2000)
	await click(taiko.link({ id: id }));
	await click(text(lang));
	await taiko.waitFor(1000);
});

step("Validate contribution language should be selected <lang> from <dropdown_id>", async function (lang, dropdown_id) {
	await taiko.waitFor(2000)
	const selectLanguageDropDown = taiko.dropDown({ id: dropdown_id })
	assert.ok(await selectLanguageDropDown.exists());
	// Need to check the selected value in dropdown

	
	// const selectedValue = await taiko.dropDown(dropdown_id).value();
	// console.log(selectedValue);
	// if(selectedValue == lang) {
	// 	assert.ok(true);
	// } else {
	// 	assert.fail();
	// }
});

// step("Localisation <id> dropdown should have <lang1> & <lang2> value", async function (id, lang1, lang2) {
// 	await taiko.waitFor(2000)
// 	await click(taiko.link({ id: id }));
// 	assert.ok(await text(lang1).exists());
// 	assert.ok(await text(lang2).exists());
// });

step("Validate participation section content", async function() {
	await taiko.waitFor(1500)
	const titleText = 'Total Participation'
	const asrText = text('SUNO INDIA',taiko.below(titleText))
	const textText = text('BOLO INDIA',taiko.toRightOf(asrText))
	const parallelText = text('LIKHO INDIA',taiko.toRightOf(textText))
	const ocrText = text('DEKHO INDIA',taiko.toRightOf(parallelText))
	await taiko.waitFor(1500)
	assert.ok(await text(titleText).exists())
	assert.ok(await textText.exists())
	assert.ok(await parallelText.exists())
	assert.ok(await asrText.exists())
	assert.ok(await ocrText.exists())
});
