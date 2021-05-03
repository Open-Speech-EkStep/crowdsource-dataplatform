const fetch = require('../common/fetch')
const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CONTRIBUTION_LANGUAGE,
  TOP_LANGUAGES_BY_HOURS
} = require("../common/constants");
const {
  setPageContentHeight,
  toggleFooterPosition,
  updateLocaleLanguagesDropdown,
  getLocaleString,
  performAPIRequest,
} = require("../common/utils");

const {constructChart}= require('../common/horizontalBarGraph');


const CURRENT_INDEX = "currentIndex";
const SPEAKER_DETAILS = "speakerDetails";

function setSentencesContributed() {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const speakerDetails = localStorage.getItem("speakerDetails");
  let userName = "";
  if (speakerDetails) {
    userName = JSON.parse(speakerDetails).userName;
  }
  performAPIRequest(
    `/rewards?language=${contributionLanguage}&category=speak&userName=${userName}`
  ).then((data) => {
    localStorage.setItem('nextHourGoal', data.nextHourGoal);
    $("#user-contribution").text(data.contributionCount);
    $("#language-hour-goal").text(data.nextHourGoal);
  });
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


const chartReg = {};
function showByHoursChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  constructChart(
    JSON.parse(topLanguagesByHoursData),
    "total_contributions",
    "language"
  );
}



const getLanguageStats = function () {
  fetch("/stats/summary?aggregateDataByLanguage=true")
    .then((res) => res.json())
    .then((response) => {
      if (response.aggregate_data_by_language.length > 0) {
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


function executeOnLoad() {
  const currentIndexInStorage = Number(localStorage.getItem(CURRENT_INDEX));
  const localSpeakerDataParsed = JSON.parse(
    localStorage.getItem(SPEAKER_DETAILS)
  );

  // if (!localSpeakerDataParsed) {
  //   location.href = "./home.html#start-record";
  // } else if (currentIndexInStorage < totalSentence) {
  //   location.href = "./home.html#start-record";
  // } else {
    $("#nav-user").removeClass("d-none");
    $("#nav-login").addClass("d-none");
    $("#nav-username").text(localSpeakerDataParsed.userName);

    setPageContentHeight();
  setSentencesContributed();
  // }

  toggleFooterPosition();
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (contributionLanguage) {
    updateLocaleLanguagesDropdown(contributionLanguage);
  }
  showByHoursChart();
  getLanguageStats();
}

$(document).ready(function () {
  getLocaleString()
    .then((data) => {
      executeOnLoad();
    })
    .catch((err) => {
      executeOnLoad();
    });
});

module.exports = {setSentencesContributed};
