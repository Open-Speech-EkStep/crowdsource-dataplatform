const taiko = require('taiko');
const assert = require('assert');

const { button, write, click, link, clear, text, into, scrollDown, scrollTo, $ } = require('taiko');

const getSelectors = require('./constant');

beforeSpec(async () => {
  selectors = await getSelectors(taiko);
});

step('Select <HeaderLink> from header', async function (HeaderLink) {
  await taiko.waitFor(500);
  if (await text('Error!!!').exists()) {
    await click(selectors.closeButton);
  }
  await click(link(HeaderLink));
});

step('Validate Speech Validation content', async function () {
  assert.ok(await selectors.ttsInitiativeHeading.exists());
  assert.ok(await selectors.validateText.exists());
  assert.ok(await selectors.transcribeText.exists());
  await scrollTo('Overall Summary');
  assert.ok(await selectors.contributionTrackerText.isVisible());
  assert.ok(await selectors.overAllSummaryText.isVisible());
  assert.ok(await selectors.ttsInitiativeContributionHeading1.isVisible());
  assert.ok(await selectors.top3contributionText.isVisible());
});

step('Username field should be present', async function () {
  await taiko.waitFor(1000);
  assert.ok(await selectors.userNameField.exists());
});

step(
  'When user clicks on View all Details buttton user should be able to see <arg0> , <arg1>',
  async function (arg0, arg1) {
    await taiko.scrollDown(10000);
    await taiko.waitFor(500);
    await click(selectors.viewAllDetails);
    await taiko.waitFor(1000);
    assert.ok(await text(arg0).exists());
    assert.ok(await text(arg1).exists());
  }
);

step('Add <usrnm> Username', async function (usrnm) {
  if (await selectors.userDetailsText.exists()) {
    const username = selectors.userNameField;
    await taiko.waitFor(700);
    await clear(selectors.userNameField);
    await write(usrnm, into(username));
    await taiko.waitFor(500);
  }
});

step('When user clicks on the Test Speaker button, user should see <arg0>', async function (arg0) {
  await click(selectors.testSpeakerIcon);
  assert.ok(await button({ 'data-testid': arg0 }).exists());
});

step(
  'User clicks on  <arg0> button user should see <arg1> and <arg2> , <arg3> should be  enabled',
  async function (arg0, arg1, arg2, arg3) {
    await click(taiko.button(arg0));
    await taiko.waitFor(500);
    assert.ok(await text(arg1).exists());
    assert.ok(await text(arg2).exists());
    assert.ok(!(await taiko.button(arg3).isDisabled()));
  }
);

step('User should see the top Language graph and other stats', async function () {
  assert.ok(await selectors.contributionTrackerText.exists());
  assert.ok(await selectors.languageText.exists());
  assert.ok(await selectors.peopleParticipatedText.exists());
  assert.ok(await selectors.durationTranscribedText.exists());
  assert.ok(await selectors.durationValidatedText.exists());
});

step('When user clicks on back button, user should land on home page', async function () {
  await taiko.waitFor(650);
  if (await selectors.homeText.exists()) {
    assert.ok('Home button exists');
    await click(selectors.homeText);
    await taiko.waitFor(1500);
  }
  assert.ok(await selectors.ttsInitiativeHeading.exists());
});

step(
  'When user clicks on Speech Validation breadcrumb, user should land on Speech Validation home page',
  async function () {
    await selectors.breadCrumb.exists();
    await click(selectors.breadCrumb);
    await taiko.waitFor(1000);
    assert.ok(await selectors.ttsInitiativeHeading.isVisible());
  }
);

step(
  'When User clicks on <type> field and type <text> submit and cancel button should be enabled',
  async function (type, text) {
    const editfield = taiko.textBox(type);
    await taiko.waitFor(500);
    await write(text, into(editfield));
    await taiko.waitFor(1000);
    assert.ok(!(await selectors.submitButton.isDisabled()));
    assert.ok(!(await selectors.cancelButton.isDisabled()));
  }
);

step(
  'When User clicks on <type> field and type <text> submit should be disabled and cancel button should be enabled',
  async function (type, text) {
    const editfield = taiko.textBox(type);
    await taiko.waitFor(500);
    await write(text, into(editfield));
    await taiko.waitFor(500);
    assert.ok(await selectors.submitButton.isDisabled());
    assert.ok(!(await selectors.cancelButton.isDisabled()));
  }
);

step('When user clicks on submit button user should see <thankutext>', async function (thankutext) {
  await click(selectors.submitButton);
  await taiko.waitFor(500);
  await taiko.text(thankutext).exists();
  await taiko.waitFor(1200);
});

step(
  'When user clicks on Play button, Pause button should appear and when user clicks on pause, play should appear',
  async function () {
    await selectors.playIcon.exists();
    await click(selectors.playIcon);
    await selectors.pauseIcon.exists();
    await click(selectors.pauseIcon);
    await click(selectors.playIcon);
    await selectors.replayIcon.exists();
  }
);

step(
  'User clicks on Play button, and then on pause button, then clicks on <type> field and type <text>, then resume, submit button should be disabled',
  async function (type, text) {
    await selectors.playIcon.exists();
    await click(selectors.playIcon);
    await selectors.pauseIcon.exists();
    await click(selectors.pauseIcon);
    const editfield = taiko.textBox(type);
    await taiko.waitFor(500);
    await write(text, into(editfield));
    await selectors.playIcon.exists();
    await click(selectors.playIcon);
    await selectors.replayIcon.exists();
    assert.ok(await selectors.submitButton.isDisabled());
    await clear(editfield);
  }
);

step(
  'When user skips the rest of the <count> sentences , User should see Thank you Page',
  async function (count) {
    const skipbutton = selectors.skipButton;
    for (let i = 0; i < count; i++) {
      await click(skipbutton);
      await taiko.waitFor(1200);
    }
    await selectors.youContributedText.exists();
    assert.ok(await selectors.youContributedText.exists());
  }
);

step('When user click on Lets Go Button', async function () {
  await click(selectors.button);
  await taiko.waitFor(1200);
});

step('Check <card> option should be <state> on Home page', async function (card, state) {
  if (card == 'Transcribe' && state == 'disabled') {
    assert.ok(await selectors.contributeCardText.isVisible());
  }

  if (card == 'Transcribe' && state == 'enabled') {
    assert.ok(!(await selectors.contributeCardText.isVisible()));
  }

  if (card == 'Label' && state == 'disabled') {
    assert.ok(await selectors.contributeCardText.isVisible());
  }

  if (card == 'Label' && state == 'enabled') {
    assert.ok(!(await selectors.contributeCardText.isVisible()));
  }

  if (card == 'Validate' && state == 'disabled') {
    assert.ok(await selectors.validateCardText.isVisible());
  }

  if (card == 'Validate' && state == 'enabled') {
    assert.ok(!(await selectors.validateCardText.isVisible()));
  }
});

step(
  'When user clicks on submit button for Odia language user should see <thankutext>',
  async function (thankutext) {
    await click(selectors.submitButton);
    await taiko.waitFor(3000);
    await taiko.text(thankutext).exists();
  }
);

step(
  'User plays the audio , <button1> should be enabled & <button2> should be disabled',
  async function (button1, button2) {
    await taiko.waitFor(500);
    await click(selectors.playIcon);
    await taiko.waitFor(1000);
    assert.ok(!(await taiko.button(button1).isDisabled()));
    assert.ok(await taiko.button(button2).isDisabled());
    await taiko.waitFor(5000);
    assert.ok(!(await taiko.button(button2).isDisabled()));
  }
);

step(
  'User clicks on Play button, and then on pause button, then clicks on <needchange>, then clicks on <edit> field and type <text>, then resume, submit button should be disabled, then skip',
  async function (needchange, type, text) {
    await taiko.waitFor(1000);
    await selectors.playIcon.exists();
    await click(selectors.playIcon);
    await selectors.pauseIcon.exists();
    await click(selectors.pauseIcon);
    await click(taiko.button(needchange));
    await taiko.waitFor(500);
    const editfield = taiko.textBox(type);
    await taiko.waitFor(500);
    await write(text, into(editfield));
    await selectors.playIcon.exists();
    await click(selectors.playIcon);
    await selectors.replayIcon.exists();
    assert.ok(await selectors.submitButton.isDisabled());
    await click(selectors.skipButton);
  }
);

step('Validate Thank you page content for Speech Validation', async function () {
  await taiko.waitFor(1000);
  assert.ok(await selectors.asrValidateThankYouPageText1.isVisible());
  assert.ok(await selectors.asrValidateThankYouPageText2.isVisible());
  assert.ok(await selectors.asrValidateThankYouPageText3.isVisible());
});

step(
  'When user clicks on Play button, Pause button should appear and when user clicks on pause, play should visible',
  async function () {
    await taiko.waitFor(1000);
    await click(selectors.playIcon);
    await taiko.waitFor(500);
    await click(selectors.pauseIcon);
  }
);

step('User clicks on play button', async function () {
  await taiko.waitFor(500);
  await click(selectors.playIcon);
  await taiko.waitFor(4000);
});

step('Change user name to <usrnm>', async function (usrnm) {
  await selectors.userOptionButton.exists();
  await click(selectors.userOptionButton);
  assert.ok(await selectors.changeUserText.isVisible());
  await click(selectors.changeUserText);
  await taiko.waitFor(1000);
  assert.ok(await selectors.userNameField.isVisible());
  if (await selectors.userDetailsText.exists()) {
    const username = selectors.userNameField;
    await taiko.waitFor(700);
    await clear(selectors.userNameField);
    await taiko.waitFor(300);
    await write(usrnm, into(username));
    await taiko.waitFor(500);
  }
  await click(selectors.button);
  await taiko.waitFor(1000);
});
