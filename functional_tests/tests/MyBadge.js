const taiko = require('taiko');
const assert = require('assert');
const getSelectors = require('./constant');

const {  click, scrollUp,setCookie,text} = require('taiko');


beforeSpec(async () => {
    selectors = await getSelectors(taiko)
});

step("Select MyBadges from the dropdown", async function () {
    await setCookie("userId", "789456123abcde", {
        url: process.env.api_test_url
    })
    await click(selectors.userOptionButton);
    assert.ok(selectors.myBadgesText.isVisible());
    await click(selectors.myBadgesText);
    await taiko.waitFor(1000);
    assert.ok(selectors.yourMedalGalleryText.isVisible())
    assert.ok(await selectors.badgeInstruction.isVisible())
    assert.ok(await selectors.badgeInstruction2.isVisible())
})

step("<congratstext> text should be visible", async function (congratstext) {
    await taiko.waitFor(500)
    assert.ok(await text(congratstext).isVisible());
});

step("when user navigates to <tab> tab user should see badges", async function (tab) {

    if (tab == "ocr-tab") {
        await scrollUp(5000);
        await click(selectors.ocrInitiativeTab);
        await taiko.waitFor(1000);
        assert.ok(await selectors.odiaText.isVisible());

        assert.ok(await selectors.odiaOcrBronzeValidateBadge.exists())
        assert.ok(await selectors.odiaOcrSilverValidateBadge.exists())
        assert.ok(await selectors.odiaOcrGoldValidateBadge.exists())
        assert.ok(await selectors.asOcrBronzeContributeBadge.exists())
        assert.ok(await selectors.asOcrSilverContributeBadge.exists())

        await click(selectors.odiaOcrBronzeValidateBadge);
        assert.ok(await selectors.badgeClickablePopup.isVisible())
    } 
    else if (tab == "parallel-tab") {
        await scrollUp(5000);
        await click(selectors.translationInitiativeTab);
        await taiko.waitFor(300)
        assert.ok(await selectors.bnTranslationBronzeValidateBadge.isVisible())
        assert.ok(await selectors.bnTranslationSilverValidateBadge.isVisible())
        assert.ok(await selectors.bnTranslationGoldValidateBadge.isVisible())
        assert.ok(await selectors.bnTranslationPlatinumValidateBadge.isVisible())

        assert.ok(await selectors.medalPlaceholder.isVisible())
    } 
    else if (tab == "asr-tab") {
        await scrollUp(5000);
        await click(selectors.ttsInitiativeTab);
        await taiko.waitFor(300)
        assert.ok(await selectors.noBadgeEarnedText.isVisible())
    }
});

step("When user clicks on back button, user should land on Crowdsourcing home page", async function () {
    await scrollUp(5000);
    if (await selectors.homeText) {
        assert.ok('Home button exists')
        await click(selectors.homeText)
        await taiko.waitFor(1500)
    }
    assert.ok(await selectors.brandContributorText.isVisible());
});