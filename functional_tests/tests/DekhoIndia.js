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

step("Validate Dekho India content", async function () {
	assert.ok(await text('Enrich your language by labelling images').exists());
	assert.ok(await text('Validate').exists());
	assert.ok(await text('Label').exists());
});

step("User should see the top Language graph and other stats for Dekho India", async function () {
	assert.ok(await text("Your language and top 3 most contributed languages").exists());
	assert.ok(await text("Images labelled and validated").exists());
	assert.ok(await text("Languages").exists());
	assert.ok(await text("People participated").exists());
	assert.ok(await text("Images labelled").exists());
	assert.ok(await text("Images validated ").exists());
});

step("When user clicks on back button, user should land on Dekho India home page", async function () {
	if (await taiko.text('Home').exists()) {
		assert.ok('Home button exists')
		await click(taiko.text("Home"))
		await taiko.waitFor(1000)
	}
	assert.ok(await text("Enrich your language by labelling images").isVisible());

});

step("Close button should close the pop up and user should see <flow> India Home page", async function (flow) {
	if (await taiko.text('User Details').exists()) {
		assert.ok('user details pop-up exists')
		await taiko.waitFor(700)
		await click(taiko.button({ class: 'close float-right' }))
	}

	if (flow == "Dekho") {
		assert.ok(await text("Enrich your language by labelling images").exists());
	}
	if (flow == "Suno") {
		assert.ok(await text("Enrich your language by transcribing audio into text").exists());
	}


});

step("User clears the edit field should disable the buttons again", async function () {
	await clear(taiko.textBox({ id: 'edit' }));
	await taiko.waitFor(500)
	assert.ok(await button({ id: 'submit-edit-button' }).isDisabled())
	assert.ok(await button({ id: 'cancel-edit-button' }).isDisabled())
});


step("<arg0> should be enabled , <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
	await taiko.waitFor(3000);
	assert.ok(! await taiko.button({ id: arg0 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
});

step("User should see the text <text>", async function (text) {
	await taiko.waitFor(500)
	assert.ok(taiko.text(text).isVisible())
});

step("When user clicks on Contribute more button , user should see no data available message for <flow> India", async function (flow) {
	await taiko.waitFor(500)
	await click(link('Contribute More'))
	await taiko.waitFor(2000)

	if (flow == "Dekho") {
		assert.ok(await text('Thank you for your enthusiasm to label the images').exists())
	}
	if (flow == "Likho") {
		assert.ok(await text('Thank you for your enthusiasm to translate the sentences.').exists())
	}
	if (flow == "Suno") {
		assert.ok(await text('Thank you for your enthusiasm to transcribe the recordings.').exists())
	}
});


step("When user clicks on Validate more button , user should see no data available message for <flow> India", async function (flow) {
	await taiko.waitFor(500)
	await click(link('Validate More'))
	await taiko.waitFor(2000)

	if (flow == "Dekho") {
		assert.ok(await text('Thank you for your enthusiasm to validate the image labels.').exists())
	}
	if (flow == "Likho") {
		assert.ok(await text('Thank you for your effort to validate translations.').exists())
	}
	if (flow == "Suno") {
		assert.ok(await text('Thank you for your enthusiasm to validate the recordings.').exists())
	}
});

// step("user should see the Virtual Keyboard button", async function() {
// 	await taiko.waitFor(1000)
// 	await click(button({id:"virtualKeyBoardBtn"}))
// 	await taiko.waitFor(500)
//     assert.ok(await text("न").exists());
// 	assert.ok(await text("स").exists());

// 	await taiko.button({id :"keyboardCloseBtn"}).exists()
// 	await click(button({id:"keyboardCloseBtn"}))
// 	await taiko.waitFor(300)
// });

step("User clicks on <arg0> , he should see next sentence and <arg1> <arg2> buttons should be enabled", async function (arg0, arg1, arg2) {
	await click(taiko.button({ id: arg0 }))
	await taiko.waitFor(1000);
	assert.ok(! await taiko.button({ id: arg1 }).isDisabled());
	assert.ok(! await taiko.button({ id: arg2 }).isDisabled());
	await taiko.waitFor(1000);
});

step("User clicks on <arg0> he should see thank you page and should be able to see bronze Badge", async function (arg0) {
	await click(taiko.button({ id: arg0 }))
	await taiko.waitFor(2000)
	assert.ok(await text("Congratulations on winning a new badge!").isVisible());
	assert.ok(await text("You’ve earned your Dekho India Bronze Bhasha Samarthak Badge").isVisible());
	assert.ok(await text("Validated 5 image(s) in Kannada").isVisible());
	assert.ok(await text("Share on").isVisible());
	assert.ok(await text("Download").isVisible());
	assert.ok(await image({ id: "reward-img" }).isVisible());
	assert.ok(! await image({ id: "bronze_badge_link_img" }).isDisabled());
});

step("User should see add extension and watch video link", async function () {
	await taiko.waitFor(1000)
	assert.ok(await button('Install Now').exists())
	assert.ok(await link({ id: "extension_video_button" }).exists());
});

step("Clicking watch video link should open video", async function () {
	assert.ok(await link('Watch the video').exists())
	assert.ok(await button('Install Now').exists())
	//await click(link("Watch the video"))
	taiko.waitFor(500);
	//assert.ok(await taiko.$("#extension_video").exists());
	//assert.ok(await taiko.$("#extension_video_close_btn").exists());
	//await click(taiko.$("#extension_video_close_btn"));
	//taiko.waitFor(2000);
});

step("Validate Thank you page content for Dekho India", async function () {
	assert.ok(await text('Dekho India Target Achieved').exists())
	assert.ok(await text('Image(s)').exists())
	assert.ok(await text('Labelled (in images)').isVisible())
});


step("When User clicks on <type> field and type <txt> submit and cancel button should be disabled", async function (type, txt) {
	const editfield = taiko.textBox({ id: type })
	await taiko.waitFor(500)
	await write(txt, into(editfield))
	await taiko.waitFor(1000)
	assert.ok(await button({ id: 'submit-edit-button' }).isDisabled())
	assert.ok(await button({ id: 'cancel-edit-button' }).isDisabled())
});

step("User clears the edit field should disable the buttons again in validation", async function () {
	await clear(taiko.textBox({ id: 'edit' }));
	await taiko.waitFor(500)
	assert.ok(await button({ id: 'submit-edit-button' }).isDisabled())
});

step("Check Data Source button should not be visible", async () => {
	assert.ok(! await taiko.button({ id: 'show_source_button' }).isVisible());
});