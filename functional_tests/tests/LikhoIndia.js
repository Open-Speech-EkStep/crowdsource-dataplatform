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

step("Validate Likho India content", async function() {
  assert.ok(await text('Help your language by translating text').exists());
  assert.ok(await text('Validate').exists());
  assert.ok(await text('Translate').exists());
});

step("User should see the top Language graph and other stats for Likho India", async function() {
  assert.ok(await text("Your language pair and top 3 most contributed language pairs").exists());
  assert.ok(await text("Total translations").exists());
  assert.ok(await text("Language pairs").exists());
  assert.ok(await text("People participated").exists());
  assert.ok(await text("Translations done").exists());
  assert.ok(await text("Translations validated").exists());
});

step("Select <lang> Language from <dropdown_id>", async function (lang, dropdown_id) {
  await taiko.waitFor(1000)
  const selectLanguageDropDown = taiko.dropDown({ id: dropdown_id })
  assert.ok(await selectLanguageDropDown.exists());
  await selectLanguageDropDown.select(lang);
});

step("Close button should close the pop up and user should see Likho India Home page", async function() {
  if (await taiko.text('User Details').exists()) {
    assert.ok('user details pop-up exists')
    await taiko.waitFor(700)
    await click(taiko.button({ class: 'close float-right' }))
  }

  assert.ok(await text("Help your language by translating text").exists());
});

step("Validate Thank you page content for Likho India", async function() {
  assert.ok(await text('Thank you for contributing!').exists())
  assert.ok(await text('10000 translations').exists())
});

step("When User clicks on <type> field and type <txt> submit should be disabled and cancel button should be enabled", async function(type, txt) {
	const editfield = taiko.textBox({ id: type })
    await taiko.waitFor(500)
    await write(txt, into(editfield))
    await taiko.waitFor(500)
    assert.ok( await button({ id: 'submit-edit-button' }).isDisabled())
    assert.ok(! await button({ id: 'cancel-edit-button' }).isDisabled())
});

step("User should see an error message <msg>", async function(msg) {
	await taiko.waitFor(300)
   assert.ok(await text(msg).exists())
});

step("<arg0> should not visible", async function(arg0) {
	await taiko.waitFor(1000)
    if (await text(arg0).exists()) {
        const resp = await text(arg0).isVisible();
        assert.ok(!resp)
    }
});

step("When user clicks on back button, user should land on Likho India home page", async function() {
	if (await taiko.text('Home').exists()) {
    assert.ok('Home button exists')
    await click(taiko.text("Home"))
    await taiko.waitFor(1000)
}
assert.ok(await text("Help your language by translating text").isVisible());
});

step("When user clicks on Contribute more button , user should see no data available message for Likho India", async function() {
	await taiko.waitFor(500)
    await click(link('Contribute More'))
    await taiko.waitFor(2000)
    assert.ok(await text('Thank you for your enthusiasm to translate the sentences').exists())
});

step("when user clicks on the Validate more button user should no data available message for Likho", async function() {
    await taiko.waitFor(1000)
      assert.ok(await text('Thank you for your enthusiasm to validate the translations').exists())
});

step("User should see no data available message for Likho India", async function() {
	await taiko.waitFor(1000)
      assert.ok(await text('Thank you for your enthusiasm to validate the translations').exists())
});