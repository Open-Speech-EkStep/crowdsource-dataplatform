const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CURRENT_MODULE,
  CONTRIBUTION_LANGUAGE,
  MODULE,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  AGGREGATED_DATA_BY_LANGUAGE
} = require("../common/constants");
const {
  updateLocaleLanguagesDropdown,
  getLocaleString,
  performAPIRequest,
  showElement,
  hideElement,
  getJson,
  translate
} = require("../common/utils");
const { downloadPdf } = require('../common/downloadableBadges');
const { initializeFeedbackModal } = require('../common/feedback')

const { setBadge, showByHoursChartThankyouPage, updateGoalProgressBarFromJson, replaceSubStr, getTopLanguage } = require('../common/common');
const { onChangeUser, showUserProfile, onOpenUserDropDown } = require('../common/header');

const CURRENT_INDEX = "currentIndex";
const SPEAKER_DETAILS = "speakerDetails";
const totalSentence = Number(localStorage.getItem('count'));

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
    `/rewards?type=text&language=${contributionLanguage}&source=contribute&userName=${userName}`
  ).then((data) => {
    setBadge(data, localeStrings, 'contribute');
  });
}

const getFormattedTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.ceil(remainingAfterHours % SIXTY);
  return { hours, minutes, seconds };
};

const updateShareContent = function (language, rank) {
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localisedLanguage = sessionStorage.getItem("i18n");
  const boloIndiaTitle = "Bhasha Daan: A crowdsourcing initiative for Indian languages";
  let localeText = "";
  if (rank === 0) {
    localeText = localeStrings["social sharing text without rank"];
  } else {
    localeText = localeStrings["social sharing text with rank"];
    localeText = localeText.replace("<x>", translate(language));
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
    `https://www.linkedin.com/shareArticle?mini=true&url=https://bhashini.gov.in/bhashadaan/${localisedLanguage}/home.html&title=${localeStrings[boloIndiaTitle]}&summary=${localeText}`
  );
};

const getLanguageStats = function () {
  return getJson('/aggregated-json/cumulativeDataByLanguage.json')
    .then(jsonData => {
      const top_languages_by_hours = jsonData.filter(d => d.type == MODULE.bolo['api-type']);
      if (top_languages_by_hours.length > 0) {
        localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(top_languages_by_hours));
        const languages = getTopLanguage(top_languages_by_hours, MODULE.bolo.value, 'total_contribution_count', 'total_contributions');
        localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify(languages));
        showByHoursChartThankyouPage(MODULE.bolo.value, "thankyou");
        const data = top_languages_by_hours.sort((a, b) =>
          Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1
        );
        const { hours, minutes, seconds } = getFormattedTime(
          Number(data[0].total_contributions) * 3600
        );
        const $highestLangTime = $("#highest_language_time");
        $highestLangTime.text(`${hours}hrs ${minutes}min ${seconds}sec`);

        const $highestLanguageProgress = $("#highest_language_progress");
        const hlh = Number(data[0].total_contributions) * 3600;
        const hlp = (hlh / (100 * 3600)) * 100;
        $highestLanguageProgress.css("width", `${hlp}%`);

        const contributionLanguage = localStorage.getItem(
          CONTRIBUTION_LANGUAGE
        );
        const rank = data.findIndex(
          (x) => x.language.toLowerCase() === contributionLanguage.toLowerCase()
        );
        const $contributedLangTime = $("#contribute_language_time");
        const $contributeLanguageProgress = $("#contribute_language_progress");
        if (rank > -1) {
          const tc = data[rank].total_contributions;
          const { hours: hr, minutes: min, seconds: sec } = getFormattedTime(
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
    })
};

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
    onChangeUser('./thank-you.html', MODULE.bolo.value);
    onOpenUserDropDown();
  }

  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (contributionLanguage) {
    updateLocaleLanguagesDropdown(contributionLanguage);
  }
  const localStrings = JSON.parse(
    localStorage.getItem(LOCALE_STRINGS)
  );

  const localeLanguageStr = localStrings[contributionLanguage];
  // replaceSubStr($(".progress-average-metric"), "<language>", localeLanguageStr);
  $("#metric-language").text(localeLanguageStr);
  replaceSubStr($("#languageNotInTopWeb"), "<language>", localeLanguageStr);
  replaceSubStr($("#languageInTopWeb"), "<language>", localeLanguageStr);
  replaceSubStr($("#languageNotInTopMob"), "<language>", localeLanguageStr);
  replaceSubStr($("#languageInTopMob"), "<language>", localeLanguageStr);
  replaceSubStr($(".x-axis-label"), "<language>", localeLanguageStr);
  $("#conLanWhenGetBadge").html(localeLanguageStr)

  hideElement($("#loader"))
  showElement($("#data-wrapper"))

  updateGoalProgressBarFromJson(MODULE.bolo['api-type'], 'contribute', contributionLanguage);
  getLanguageStats().then(() => {
    setSentencesContributed();
  });
}


$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, 'bolo');
  localStorage.setItem("selectedType", "contribute");
  initializeFeedbackModal();
  $("#download_pdf").on('click', function () {
    downloadPdf($(this).attr("data-badge"));
  });

  getLocaleString()
    .then(() => {
      executeOnLoad();
    })
    .catch(() => {
      executeOnLoad();
    });
});

module.exports = { setSentencesContributed };
