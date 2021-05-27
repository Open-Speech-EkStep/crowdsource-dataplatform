const fetch = require('../common/fetch')
const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CURRENT_MODULE,
  MODULE,
  TOP_LANGUAGES_BY_HOURS,
  ALL_LANGUAGES,
  LIKHO_FROM_LANGUAGE,
  LIKHO_TO_LANGUAGE
} = require("../common/constants");

const {
  setPageContentHeight,
  toggleFooterPosition,
  getLocaleString,
  performAPIRequest,
} = require("../common/utils");

const {downloadPdf} = require('../common/downloadableBadges');
const { showUserProfile } = require('../common/header');
const {showByHoursChart,getContributedAndTopLanguage,setBadge} = require('../common/common');

const CURRENT_INDEX = "likhoCurrentIndex";
const SPEAKER_DETAILS = "speakerDetails";
const likhoCountKey = 'likhoCount';
const totalSentence = Number(localStorage.getItem(likhoCountKey));

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  const invalidToLang = toLanguage.toLowerCase() === "english" || toLang.hasLocaleText === false;
  const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  if (invalidToLang && invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else if (invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  } else if (invalidToLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else if (toLanguage.toLowerCase() === language.toLowerCase()){
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
        <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  }
}

const getFormattedTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.ceil(remainingAfterHours % SIXTY);
  return {hours, minutes, seconds};
};

const updateShareContent = function (language, rank) {
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const boloIndiaTitle = "Bolo India: A crowdsourcing initiative for Indian languages";
  let localeText = "";
  if (rank === 0) {
    localeText = localeStrings["social sharing text without rank"];
  } else {
    localeText = localeStrings["social sharing text with rank"];
    localeText = localeText.replace("%language", language);
    localeText = localeText.replace("%rank", rank);
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
    `https://www.linkedin.com/shareArticle?mini=true&url=https://boloindia.nplt.in&title=${localeStrings[boloIndiaTitle]}&summary=${localeText}`
  );
};

const getLanguageStats = function () {
  fetch("/stats/summary/parallel")
    .then((res) => res.json())
    .then((response) => {
      if (response.aggregate_data_by_language.length > 0) {
        const contributionLanguage = localStorage.getItem(
          LIKHO_FROM_LANGUAGE
        );
        const module = localStorage.getItem(CURRENT_MODULE);
        const languages = getContributedAndTopLanguage(module == MODULE.likho.value || module == MODULE.dekho.value ? response.top_languages_by_contribution_count : response.top_languages_by_hours, MODULE.likho.value);
        localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
        showByHoursChart(MODULE.likho.value);
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
  const contributionLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
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
    `/rewards?type=parallel&language=${contributionLanguage}&source=contribute&userName=${userName}`
  ).then((data) => {
    setBadge(data,localeStrings);
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

    setPageContentHeight();
    setSentencesContributed();
    toggleFooterPosition();

    const contributionLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
    const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
    if (contributionLanguage && toLanguage) {
      updateLocaleLanguagesDropdown(contributionLanguage, toLanguage);
    }
    getLanguageStats();
  }
}

$(document).ready(function () {

  localStorage.setItem(CURRENT_MODULE,MODULE.likho.value);

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
