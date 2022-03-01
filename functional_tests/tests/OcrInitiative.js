const taiko = require('taiko');
const assert = require('assert');

const { button, click, image, link, clear, text, scrollTo } = require('taiko');
const getSelectors = require('./constant');
beforeSpec(async () => {
  selectors = await getSelectors(taiko);
});

step('Validate Image Validation content', async function () {
  assert.ok(await selectors.ocrInitiativeHeading.exists());
  assert.ok(await selectors.validateText.exists());
  assert.ok(await selectors.labelText.exists());
  await scrollTo('Contributions made to Image Validation');
  await taiko.waitFor(500);
  assert.ok(await selectors.contributionTrackerText.isVisible());
  assert.ok(await selectors.overAllSummaryText.isVisible());
  assert.ok(await selectors.ocrInitiativeContributionHeading.isVisible());
  assert.ok(await selectors.top3contributionText.isVisible());
});

step('User should see the top Language graph and other stats for Image Validation', async function () {
  assert.ok(await selectors.top3contributionText.exists());
  assert.ok(await selectors.languageText.exists());
  assert.ok(await selectors.peopleParticipatedText.exists());
  assert.ok(await selectors.imageLabelledText.exists());
  assert.ok(await selectors.imageValidatedText.exists());
});

step(
  'When user clicks on Image Validation breadcrumb, user should land on Image Validation home page',
  async function () {
    await selectors.ocrBreadcrumb.exists();
    await click(selectors.ocrBreadcrumb);
    await taiko.waitFor(1000);
    assert.ok(await selectors.ocrInitiativeHeading.isVisible());
  }
);

step('User clears <type> field should disable the buttons again', async function (type) {
  await clear(taiko.textBox(type));
  await taiko.waitFor(500);
  assert.ok(await selectors.submitButton.isDisabled());
  assert.ok(await selectors.cancelButton.isDisabled());
});

step('<name> button should be enabled', async function (name) {
  await taiko.waitFor(1000);
  assert.ok(!(await taiko.button(name).isDisabled()));
});

step('<name> button should be disabled', async function (name) {
  await taiko.waitFor(1000);
  assert.ok(await taiko.button(name).isDisabled());
});

step('<arg0> should be enabled , <arg1> <arg2> buttons should be enabled', async function (arg0, arg1, arg2) {
  await taiko.waitFor(3000);
  assert.ok(!(await taiko.button({ id: arg0 }).isDisabled()));
  assert.ok(!(await taiko.button({ id: arg1 }).isDisabled()));
  assert.ok(!(await taiko.button({ id: arg2 }).isDisabled()));
});

step('User should see the text <text>', async function (text) {
  await taiko.waitFor(500);
  assert.ok(taiko.text(text).isVisible());
});

step(
  'When user clicks on Contribute more button , user should see no data available message for <initiative>',
  async function (initiative) {
    await taiko.waitFor(500);
    await click(selectors.contributeMoreText);
    await taiko.waitFor(2000);

    if (initiative == 'Image Validation') {
      assert.ok(await selectors.ocrThankYouEnthusiamText.exists());
    }
    if (initiative == 'Translation Initiative') {
      assert.ok(await selectors.translationThankYouEnthusiamText.exists());
    }
    if (initiative == 'TTS Initiative') {
      assert.ok(await selectors.ttsThankYouEnthusiamText.exists());
    }
  }
);

step(
  'When user clicks on Validate more button , user should see no data available message for <initiative>',
  async function (initiative) {
    await taiko.waitFor(500);
    await click(selectors.validateMoreText);
    await taiko.waitFor(2000);

    if (initiative == 'Image Validation') {
      assert.ok(await selectors.ocrValidateThankYouEnthusiamText.exists());
    }
    if (initiative == 'Translation Initiative') {
      assert.ok(await selectors.translationValidateThankYouEnthusiamText.exists());
    }
    if (initiative == 'TTS Initiative') {
      assert.ok(await selectors.ttsValidateThankYouEnthusiamText.exists());
    }
  }
);
step('When user clicks on Validate more button', async function () {
  await taiko.waitFor(500);
  await click(selectors.validateMoreText);
  await taiko.waitFor(2000);
});

step('Validate thank you page bronze Badge for Image Validation', async function () {
  await taiko.waitFor(2000);
  assert.ok(await selectors.badgeWinText.isVisible());
  assert.ok(await selectors.ocrBronzeBadgeWinText.isVisible());
  assert.ok(await selectors.ocrKnValidateImageLabelTexts.isVisible());
  assert.ok(await selectors.shareOnText.isVisible());
  assert.ok(await selectors.downloadText.isVisible());
  assert.ok(await selectors.enBronzeBadgeImage.isVisible());
  assert.ok(!(await selectors.bronzeBadgeDownload.isDisabled()));
});

step('User should see add extension and watch video link', async function () {
  await taiko.waitFor(1000);
  assert.ok(await selectors.installNow.exists());
  assert.ok(await selectors.watchVideo.exists());
});

step('User should store the progress bar for <initiative>', async function (initiative) {
  await taiko.waitFor(2000);
  await taiko.$('#progress_bar').exists();
  const contributionMade = await selectors.targetProgress.text();
  const contributedValue = contributionMade.split('/');
  initialProgressValue = contributedValue[0];
  assert.ok(await text(`${initiative} Target Achieved`).isVisible());
});

step('Clicking watch video link should open video', async function () {
  assert.ok(await selectors.watchVideo.exists());
  assert.ok(await selectors.installNow.exists());
  taiko.waitFor(500);
});

step('Validate Thank you page content for Image Validation', async function () {
  assert.ok(await selectors.ocrValidateThankYouPageText1.exists());
  assert.ok(await selectors.ocrValidateThankYouPageText2.exists());
  assert.ok(await selectors.ocrValidateThankYouPageText3.isVisible());
});

step('User clears <type> field should disable the buttons again in validation', async function (type) {
  await clear(taiko.textBox(type));
  await taiko.waitFor(500);
  assert.ok(await selectors.submitButton.isDisabled());
});

step(
  'User should be able to see bronze Badge after winning with <contributionLeft> <label> contribution left',
  async function (contributionLeft, label) {
    assert.ok(await selectors.bronzeValidatorText.isVisible());
    assert.ok(await selectors.yourBagdeText.isVisible());
    assert.ok(await selectors.shareOnText.isVisible());
    assert.ok(await text(`Validate ${contributionLeft} ${label} to earn your Silver Badge.`).isVisible());
    assert.ok(await selectors.bronzeBadgeImage.isVisible());
  }
);

step(
  'User clicks on <arg0> , he should see thank you page with heading <contributed> <label> contributed',
  async function (arg0, contributed, label) {
    await click(taiko.button(arg0));
    await taiko.waitFor(2000);
    assert.ok(await text(`You validated ${contributed} ${label} for your language!`).isVisible());
  }
);
