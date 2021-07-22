const fetch = require('../common/fetch')
const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CURRENT_MODULE,
  MODULE,
  TOP_LANGUAGES_BY_HOURS,
  ALL_LANGUAGES,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  LIKHO_TO_LANGUAGE
} = require("../common/constants");

const {
  setPageContentHeight,
  toggleFooterPosition,
  getLocaleString,
  performAPIRequest,
} = require("../common/utils");

const {downloadPdf} = require('../common/downloadableBadges');
const { showUserProfile,onChangeUser,onOpenUserDropDown } = require('../common/header');
const {showByHoursChart, showByHoursChartThankyouPage, getContributedAndTopLanguage,setBadge,  updateLikhoLocaleLanguagesDropdown,updateGoalProgressBar,replaceSubStr,getTopLanguage} = require('../common/common');
const {initializeFeedbackModal} = require('../common/feedback');

const CURRENT_INDEX = "likhoValidatorCurrentIndex";
const SPEAKER_DETAILS = "speakerDetails";
const likhoValidatorCountKey = 'likhoValidatorCount';
const totalSentence = Number(localStorage.getItem(likhoValidatorCountKey));

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
  fetch("/stats/summary/parallel")
    .then((res) => res.json())
    .then((response) => {
      if (response.aggregate_data_by_language.length > 0) {
        const contributionLanguage = localStorage.getItem(
          CONTRIBUTION_LANGUAGE
        );
        const module = localStorage.getItem(CURRENT_MODULE);
        const languages = getTopLanguage(response.aggregate_data_by_language, MODULE.likho.value, 'total_validation_count','total_validations');
        localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify(languages));
        showByHoursChartThankyouPage(MODULE.likho.value, "thankyou");
        // const languages = getContributedAndTopLanguage(module == MODULE.likho.value || module == MODULE.dekho.value ? response.top_languages_by_contribution_count : response.top_languages_by_hours, MODULE.likho.value);
        // localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
        // showByHoursChart(MODULE.likho.value, "thankyou");
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
    `/rewards?type=parallel&language=${contributionLanguage}&source=validate&userName=${userName}`
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
    showUserProfile(localSpeakerDataParsed.userName);
    onChangeUser('./validator-thank-you.html',MODULE.likho.value);
    onOpenUserDropDown();
    setPageContentHeight();
    setSentencesContributed();
    // toggleFooterPosition();

    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
    if (contributionLanguage && toLanguage) {
      updateLikhoLocaleLanguagesDropdown(contributionLanguage, toLanguage);
    }

    const localStrings = JSON.parse(
      localStorage.getItem(LOCALE_STRINGS)
    );

    const localeLanguageStr = localStrings[contributionLanguage];
    const localeToLanguageStr = localStrings[toLanguage];
    $("#metric-language").text(localeLanguageStr+"-"+localeToLanguageStr);
    // replaceSubStr($(".progress-average-metric"), "<from-language>", localeLanguageStr);
    // replaceSubStr($(".progress-average-metric"), "<to-language>", localeToLanguageStr);
    replaceSubStr($("#languageNotInTopWeb"), "<from-language>", localeLanguageStr);
    replaceSubStr($("#languageNotInTopWeb"), "<to-language>", localeToLanguageStr);
    replaceSubStr($("#languageInTopWeb"), "<from-language>", localeLanguageStr);
    replaceSubStr($("#languageInTopWeb"), "<to-language>", localeToLanguageStr);
    replaceSubStr($("#languageNotInTopMob"), "<from-language>", localeLanguageStr);
    replaceSubStr($("#languageNotInTopMob"), "<to-language>", localeToLanguageStr);
    replaceSubStr($("#languageInTopMob"), "<from-language>", localeLanguageStr);
    replaceSubStr($("#languageInTopMob"), "<to-language>", localeToLanguageStr);
    replaceSubStr($(".x-axis-label"), "<from-language>", localeLanguageStr);
    replaceSubStr($(".x-axis-label"), "<to-language>", localeToLanguageStr);
    $("#conLanWhenGetBadge").html(`${localeLanguageStr}-${localeToLanguageStr}`)

    getLanguageStats();
    updateGoalProgressBar(`/progress/parallel/${contributionLanguage}-${toLanguage}/validate`)
  }
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,MODULE.likho.value);
  localStorage.setItem("selectedType","validate");
  initializeFeedbackModal();

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
