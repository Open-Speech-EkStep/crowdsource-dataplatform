const fetch = require('../common/fetch')
const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  TOP_LANGUAGES_BY_HOURS
} = require("../common/constants");
const { onChangeUser,onOpenUserDropDown,showUserProfile } = require('../common/header');

const {
  setPageContentHeight,
  toggleFooterPosition,
  updateLocaleLanguagesDropdown,
  getLocaleString,
  performAPIRequest,
} = require("../common/utils");

const {downloadPdf} = require('../common/downloadableBadges');
const {showByHoursChart,showByHoursChartThankyouPage, getContributedAndTopLanguage,setBadge} = require('../common/common');

const CURRENT_INDEX = "sunoValidationCurrentIndex";
const SPEAKER_DETAILS = "speakerDetails";
const sunoValidatorCountKey = 'sunoValidatorCount';
const totalSentence = Number(localStorage.getItem(sunoValidatorCountKey));
const {initializeFeedbackModal} = require('../common/feedback');

const getFormattedTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.ceil(remainingAfterHours % SIXTY);
  return {hours, minutes, seconds};
};

const updateShareContent = function (language, rank) {
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const boloIndiaTitle = "Bhasha Daan: A crowdsourcing initiative for Indian languages";
  let localeText = "";
  if (rank === 0) {
    localeText = localeStrings["social sharing text without rank"];
  } else {
    localeText = localeStrings["social sharing text with rank"];
    localeText = localeText.replace("<x>", language);
    localeText = localeText.replace("<y>", rank);
  }
  //const text = `I've contributed towards building open language repository for India on https://boloindia.nplt.in You and I can make a difference by donating our voices that can help machines learn our language and interact with us through great linguistic applications. Our ${language} language ranks ${rank} on BoloIndia. Do your bit and empower the language?`;
  const $whatsappShare = $("#whatsapp_share");
  $whatsappShare.attr(
    "href",
    `https://api.whatsapp.com/send?text=${localeText}`
  );
  const $twitterShare = $("#twitter_share");
  $twitterShare.attr(
    "href",
    `https://twitter.com/intent/tweet?text=${localeText}`
  );
  const $linkedinShare = $("#linkedin_share");
  $linkedinShare.attr(
    "href",
    `https://www.linkedin.com/shareArticle?mini=true&url=https://bhashini.gov.in/bhashadaan&title=${localeStrings[boloIndiaTitle]}&summary=${localeText}`
  );
};

const getLanguageStats = function () {
  fetch("/stats/summary/asr")
    .then((res) => res.json())
    .then((response) => {
      if (response.aggregate_data_by_language.length > 0) {
        const contributionLanguage = localStorage.getItem(
          CONTRIBUTION_LANGUAGE
        );
        const languages = getContributedAndTopLanguage(response.top_languages_by_hours, MODULE.suno.value);
        localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
        showByHoursChart(MODULE.suno.value, "thankyou");
        const data = response.aggregate_data_by_language.sort((a, b) =>
          Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1
        );
        const rank = data.findIndex(
          (x) => x.language.toLowerCase() === contributionLanguage.toLowerCase()
        );
        const $contributedLangTime = $("#contribute_language_time");
        const $contributeLanguageProgress = $("#contribute_language_progress");
        if (rank > -1) {
          const tc = data[rank].total_contributions;
          const {hours: hr, minutes: min, seconds: sec} = getFormattedTime(
            Number(tc) * 3600
          );
          $contributedLangTime.text(`${hr}hrs ${min}min ${sec}sec`);
          const rh = Number(tc) * 3600;
          const rhp = (rh / (100 * 3600)) * 100;
          $contributeLanguageProgress.css("width", `${rhp}%`);
        } else {
          $contributedLangTime.text("0 hrs");
          $contributedLangTime.css("right", 0);
          $contributeLanguageProgress.css("width", `0%`);
        }
        const $languageId = $("#languageId");
        $languageId.text(data[0].language);
        const $languageChoiceId = $("#languageChoiceId");
        $languageChoiceId.text(contributionLanguage);
        if (rank > -1) {
          updateShareContent(contributionLanguage, rank + 1);
        } else {
          updateShareContent(contributionLanguage, data.length + 1);
        }
      } else {
        updateShareContent("", 0);
      }
    });
};

function setSentencesContributed() {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const speakerDetails = localStorage.getItem("speakerDetails");
  let userName = "";
  if (speakerDetails) {
    userName = JSON.parse(speakerDetails).userName;
  }

  let rawLocaleString = localStorage.getItem(LOCALE_STRINGS);
  if (!rawLocaleString) {
    getLocaleString().then(() => {
      rawLocaleString = localStorage.getItem(LOCALE_STRINGS);
    })
  }

  const localeStrings = JSON.parse(rawLocaleString);
  performAPIRequest(
    `/rewards?type=asr&language=${contributionLanguage}&source=validate&userName=${userName}`
  ).then((data) => {
    setBadge(data,localeStrings,"validator");
  });
}

function executeOnLoad() {
  const currentIndexInStorage = Number(localStorage.getItem(CURRENT_INDEX));
  const localSpeakerDataParsed = JSON.parse(
    localStorage.getItem(SPEAKER_DETAILS)
  );

  if (!localSpeakerDataParsed) {
    location.href = "./home.html";
  } else if (currentIndexInStorage < totalSentence - 1) {
    location.href = "./home.html";
  } else {
    showUserProfile(localSpeakerDataParsed.userName)
    onChangeUser('./validator-thank-you.html',MODULE.suno.value);
    onOpenUserDropDown();
    setSentencesContributed();

    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (contributionLanguage) {
      updateLocaleLanguagesDropdown(contributionLanguage);
    }

    const localStrings = JSON.parse(
      localStorage.getItem(LOCALE_STRINGS)
    );

    const localeLanguageStr = localStrings[contributionLanguage];
    $("#contributionLanguage5").html(localeLanguageStr);
    $("#contributionLanguage1").html(localeLanguageStr);
    $("#contributionLanguage2").html(localeLanguageStr);
    $("#contributionLanguage3").html(localeLanguageStr);
    $("#contributionLanguage4").html(localeLanguageStr);
    $("#contributedLanguage").html(localeLanguageStr);
    $("#conLanWhenGetBadge").html(localeLanguageStr)
    getLanguageStats();
  }
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,MODULE.suno.value);
  initializeFeedbackModal();
  // $("#bronze_badge_link, #silver_badge_link, #gold_badge_link, #platinum_badge_link").on('click', function () {
  //   if (!$(this).attr("disabled")) {
  //     downloadPdf($(this).attr("data-badge"));
  //   }
  // });

  $("#download_pdf").on('click', function () {
    downloadPdf($(this).attr("data-badge"));
  });
  getLocaleString()
    .then((data) => {
      executeOnLoad();
    })
    .catch((err) => {
      executeOnLoad();
    });
});

module.exports = {setSentencesContributed};
