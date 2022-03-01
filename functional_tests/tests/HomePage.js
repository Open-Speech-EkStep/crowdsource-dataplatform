const taiko = require('taiko');
const assert = require('assert');

const { button, write, click, scrollUp, image, below, link, clear, text, into } = require('taiko');

const getSelectors = require('./constant');
beforeSpec(async () => {
  selectors = await getSelectors(taiko);
});

step('<page> page should be displayed', async function (page) {
  const url = await taiko.currentURL();
  assert.ok(url.includes(page));
  await taiko.goBack();
});

step('Section should have text <title>', async function (title) {
  assert.ok(await text(title).exists());
});

step('<navlink> link must be active', async function (navlink) {
  assert.ok(await text(navlink, taiko.above(button(navlink))).exists());
});

step('Check If Current Tab is <module>', async function (module) {
  await taiko.waitFor(1500);
  assert.ok(await selectors.startParticipatingText.exists());
  switch (module) {
    case 'Speech Contribution':
      assert.ok(await selectors.asrInitiativeHeading.isVisible());
      break;
    case 'Speech Validation':
      assert.ok(await selectors.ttsInitiativeHeading.isVisible());
      break;
    case 'Translation Validation':
      assert.ok(await selectors.translationInitiativeHeading.isVisible());
      break;
    case 'Image Validation':
      assert.ok(await selectors.ocrInitiativeHeading.isVisible());
      break;
    default:
      assert.fail('Not a valid module');
  }
});

step('Clicking <btnName> should navigate to <module> Page', async function (btnName, module) {
  const btn = link(btnName);
  const pageName = {
    'Speech Contribution': 'asr-initiative',
    'Speech Validation': 'tts-initiative',
    'Image Validation': 'ocr-initiative',
    'Translation Validation': 'translation-initiative',
  };
  assert.ok(await btn.exists());
  await click(btn);
  await taiko.waitFor(1000);
  assert.ok((await taiko.currentURL()).includes(pageName[module]));
  await taiko.goBack();
  await taiko.waitFor(500);
});

step('Move tab to <tabName>', async function (tabName) {
  assert.ok(await selectors.startParticipatingText.exists());
  await taiko.waitFor(1200);
  await scrollUp(5000);
  await click(tabName, taiko.above('Start Participating'));
  await taiko.waitFor(500);
});

step('Click <name> Link', async function (name) {
  await taiko.waitFor(2000);
  await taiko.scrollDown(10000);
  assert.ok(await link(name).exists());
  await click(link(name));
});

step('Select <lang> from localisation dropdown', async function (lang) {
  await taiko.waitFor(2000);
  await click(selectors.languageIconImage);
  await click(text(lang));
  await taiko.waitFor(1000);
});

step('Validate participation section content', async function () {
  await taiko.waitFor(1500);
  const titleText = 'Total Participation';
  const asrText = text('Speech Validation', taiko.below(titleText));
  const textText = text('Speech Contribution', taiko.toRightOf(asrText));
  const parallelText = text('Translation Validation', taiko.toRightOf(textText));
  const ocrText = text('Image Validation', taiko.toRightOf(parallelText));
  await taiko.waitFor(1500);
  assert.ok(await text(titleText).exists());
  assert.ok(await textText.exists());
  assert.ok(await parallelText.exists());
  assert.ok(await asrText.exists());
  assert.ok(await ocrText.exists());
});
