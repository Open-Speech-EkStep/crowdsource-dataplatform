const taiko = require('taiko');
const assert = require('assert');

const getSelectors = require('./constant')

const { text, scrollUp, click } = require('taiko');

beforeSpec(async () => {
  selectors = await getSelectors(taiko)
});

step( 'Validate language dropdown, initiative tab, badges level & participation radios exist', async function () {
    await taiko.waitFor(1000);
    await text('How can you win Brand Contributor Badges').exists();
    assert.ok(await selectors.languageDropdown.exists());

    assert.ok(await selectors.asrLink.exists());
    assert.ok(await selectors.textLink.exists());
    assert.ok(await selectors.parallelLink.exists());
    assert.ok(await selectors.ocrLink.exists());

    assert.ok(await selectors.bronzeMedalImage.exists());
    assert.ok(await selectors.silverMedalImage.exists());
    assert.ok(await selectors.goldMedalImage.exists());
    assert.ok(await selectors.platinumMedalImage.exists());

    assert.ok(await selectors.contributionRadioButton.exists());
    assert.ok(await selectors.validationRadioButton.exists());

    await taiko.text('Please keep contributing actively to stand a chance to get recognised.').exists();
    await taiko.text('Levels and badges may take upto 48 hours to update.').exists();
  }
);

step('Validate default selected values', async function () {
  await taiko.waitFor(1000);
  assert.ok((await selectors.languageDropdown.value()) === 'English');
  assert.ok(await selectors.asrActiveLink.exists());
});

step('User should select <arg> language from dropdown', async function (arg) {
  await selectors.languageDropdown.select(arg);
});

step('Select <initiative> initiative from tab', async function (initiative) {
  await taiko.waitFor(2000);
  await scrollUp(5000);
  await click(selectors[`${initiative}Link`]);
});

step('Select <type> radio button', async type => {
  let radioBtn;
  if (type == 'contribution') {
    radioBtn = selectors.contributionRadioButton;
  } else radioBtn = selectors.validationRadioButton;
  await radioBtn.exists();
  await click(radioBtn);
});

step('<text> text exists on page', async text => {
  assert.ok(await taiko.text(text).isVisible());
});

step('User select <type> badge', async function (type) {
  assert.ok(await selectors[`${type}MedalImage`].exists());
  await click(selectors[`${type}MedalImage`]);
});
