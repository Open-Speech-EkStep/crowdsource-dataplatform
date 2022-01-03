const taiko = require('taiko');
const assert = require('assert');

const { click, link, text, scrollTo } = require('taiko');

const getSelectors = require('./constant')

beforeSpec(async () => {
  selectors = await getSelectors(taiko)
});

step('Validate Translation Initiative content', async function () {
  assert.ok(await selectors.translationInitiativeHeading.exists());
  assert.ok(await selectors.validateText.exists());
  assert.ok(await selectors.translateText.exists());
  await scrollTo('Overall Summary');
  assert.ok(await selectors.translationInitiativeContributionHeading1.isVisible());
  assert.ok(await selectors.overAllSummaryText.isVisible());
  await scrollTo('Contribution Tracker');
  assert.ok(await selectors.contributionTrackerText.isVisible());
});

step('User should see the top Language graph and other stats for Translation Initiative', async function () {
  assert.ok(await selectors.translationInitiativeContributionHeading2.exists());
  assert.ok(await selectors.languagePairText.exists());
  assert.ok(await selectors.peopleParticipatedText.exists());
  assert.ok(await selectors.translationDoneText.exists());
  assert.ok(await selectors.translationValidatedText.exists());
});

step('Select <lang> Language from <dropdown_id>', async function (lang, dropdown_id) {
  await taiko.waitFor(2000);
  const selectLanguageDropDown = taiko.dropDown({ 'data-testid': dropdown_id });
  assert.ok(await selectLanguageDropDown.exists());
  await selectLanguageDropDown.select(lang);
});

step('Close button should close the pop up and user should see Translation Initiative Home page', async function () {
  if (await selectors.userDetailsText.exists()) {
    assert.ok('user details pop-up exists');
    await taiko.waitFor(700);
    await click(selectors.userDetailsCloseButton);
  }
  assert.ok(await selectors.translationInitiativeHeading.exists());
});

step('User should see an error message <msg>', async function (msg) {
  await taiko.waitFor(300);
  assert.ok(await text(msg).exists());
});

step('<arg0> should not visible', async function (arg0) {
  await taiko.waitFor(2000);
  if (await text(arg0).isVisible()) {
    const resp = await text(arg0).isVisible();
    assert.ok(!resp);
  }
});

step(
  'When user clicks on Translation Initiative breadcrumb, user should land on Translation Initiative home page',
  async function () {
    await taiko.waitFor(1500);
    await selectors.translationBreadcrumb.exists();
    await click(selectors.translationBreadcrumb);
    assert.ok(await selectors.translationInitiativeHeading.isVisible());
  }
);

step(
  'User skips all <count> sentences user should land on Translation Initiative Thank you page',
  async function (count) {
    const skipbutton = selectors.skipButton;
    for (let i = 0; i < count; i++) {
      await click(skipbutton);
      await taiko.waitFor(2000);
    }
    await taiko.waitFor(1000);
    assert.ok(await selectors.contributeToYourLanguageText.isVisible());
    assert.ok(await selectors.parallelOrTargetAchievedText.isVisible());
    assert.ok(await selectors.parallelValidateThankYouPageText1.isVisible());
    assert.ok(await selectors.validateThankYouPageText.isVisible());
    assert.ok(await selectors.shareOnText.isVisible());
    assert.ok(await selectors.knowMore.isVisible());
  }
);
