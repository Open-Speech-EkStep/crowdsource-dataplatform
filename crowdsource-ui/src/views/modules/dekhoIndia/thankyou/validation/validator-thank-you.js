const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CONTRIBUTION_LANGUAGE,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  AGGREGATED_DATA_BY_LANGUAGE,
} = require('../common/constants');
const {
  updateLocaleLanguagesDropdown,
  getLocaleString,
  performAPIRequest,
  showElement,
  hideElement,
  getJson,
  translate,
} = require('../common/utils');
const { downloadPdf } = require('../common/downloadableBadges');
const {
  // showByHoursChart,
  showByHoursChartThankyouPage,
  // getContributedAndTopLanguage,
  setBadge,
  updateGoalProgressBarFromJson,
  replaceSubStr,
  getTopLanguage,
} = require('../common/common');
const { showUserProfile, onChangeUser, onOpenUserDropDown } = require('../common/header');
const { initializeFeedbackModal } = require('../common/feedback');
const CURRENT_INDEX = 'dekhoValidatorCurrentIndex';
const dekhoValidatorCountKey = 'dekhoValidatorCount';
const totalSentence = Number(localStorage.getItem(dekhoValidatorCountKey));
const SPEAKER_DETAILS = 'speakerDetails';

const getFormattedTime = totalSeconds => {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.ceil(remainingAfterHours % SIXTY);
  return { hours, minutes, seconds };
};

const updateShareContent = function (language, rank) {
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localisedLanguage = sessionStorage.getItem('i18n');
  const boloIndiaTitle = 'Bhasha Daan: A crowdsourcing initiative for Indian languages';
  let localeText = '';
  if (rank === 0) {
    localeText = localeStrings['social sharing text without rank'];
  } else {
    localeText = localeStrings['social sharing text with rank'];
    localeText = localeText.replace('<x>', translate(language));
    localeText = localeText.replace('<y>', rank);
    localeText = localeText.replace('<initiative name>', localeStrings['Dekho India']);
  }
  //const text = `I've contributed towards building open language repository for India on https://boloindia.nplt.in You and I can make a difference by donating our voices that can help machines learn our language and interact with us through great linguistic applications. Our ${language} language ranks ${rank} on BoloIndia. Do your bit and empower the language?`;
  const $whatsappShare = $('#whatsapp_share');
  $whatsappShare.attr('href', `https://api.whatsapp.com/send?text=${localeText}`);
  const $twitterShare = $('#twitter_share');
  $twitterShare.attr('href', `https://twitter.com/intent/tweet?text=${localeText}`);
  const $linkedinShare = $('#linkedin_share');
  $linkedinShare.attr(
    'href',
    `https://www.linkedin.com/shareArticle?mini=true&url=https://bhashini.gov.in/bhashadaan/${localisedLanguage}/home.html&title=${localeStrings[boloIndiaTitle]}&summary=${localeText}`
  );
};

const getLanguageStats = function () {
  return getJson('/aggregated-json/cumulativeDataByLanguage.json').then(jsonData => {
    const top_languages_by_hours = jsonData.filter(d => d.type == MODULE.dekho['api-type']);
    if (top_languages_by_hours.length > 0) {
      const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(top_languages_by_hours));
      const languages = getTopLanguage(
        top_languages_by_hours,
        MODULE.dekho.value,
        'total_validation_count',
        'total_validations'
      );
      localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify(languages));
      showByHoursChartThankyouPage(MODULE.dekho.value, 'thankyou');
      const data = top_languages_by_hours.sort((a, b) =>
        Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1
      );
      const rank = data.findIndex(x => x.language.toLowerCase() === contributionLanguage.toLowerCase());
      const $contributedLangTime = $('#contribute_language_time');
      const $contributeLanguageProgress = $('#contribute_language_progress');
      if (rank > -1) {
        const tc = data[rank].total_contributions;
        const { hours: hr, minutes: min, seconds: sec } = getFormattedTime(Number(tc) * 3600);
        $contributedLangTime.text(`${hr}hrs ${min}min ${sec}sec`);
        const rh = Number(tc) * 3600;
        const rhp = (rh / (100 * 3600)) * 100;
        $contributeLanguageProgress.css('width', `${rhp}%`);
      } else {
        $contributedLangTime.text('0 hrs');
        $contributedLangTime.css('right', 0);
        $contributeLanguageProgress.css('width', `0%`);
      }
      const $languageId = $('#languageId');
      $languageId.text(data[0].language);
      const $languageChoiceId = $('#languageChoiceId');
      $languageChoiceId.text(contributionLanguage);
      if (rank > -1) {
        updateShareContent(contributionLanguage, rank + 1);
      } else {
        updateShareContent(contributionLanguage, data.length + 1);
      }
    } else {
      updateShareContent('', 0);
    }
  });
};

function setSentencesContributed() {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const speakerDetails = localStorage.getItem('speakerDetails');
  let userName = '';
  if (speakerDetails) {
    userName = JSON.parse(speakerDetails).userName;
  }

  let rawLocaleString = localStorage.getItem(LOCALE_STRINGS);
  if (!rawLocaleString) {
    getLocaleString().then(() => {
      rawLocaleString = localStorage.getItem(LOCALE_STRINGS);
    });
  }

  const localeStrings = JSON.parse(rawLocaleString);
  performAPIRequest(
    `/rewards?type=ocr&language=${contributionLanguage}&source=validate&userName=${userName}`
  ).then(data => {
    setBadge(data, localeStrings, 'validator');
  });
}

function executeOnLoad() {
  const currentIndexInStorage = Number(localStorage.getItem(CURRENT_INDEX));
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(SPEAKER_DETAILS));

  if (!localSpeakerDataParsed) {
    location.href = './home.html';
  } else if (currentIndexInStorage < totalSentence - 1) {
    location.href = './home.html';
  } else {
    showUserProfile(localSpeakerDataParsed.userName);
    onChangeUser('./validator-thank-you.html', MODULE.dekho.value);
    onOpenUserDropDown();

    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (contributionLanguage) {
      updateLocaleLanguagesDropdown(contributionLanguage);
    }
    const localStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));

    const localeLanguageStr = localStrings[contributionLanguage];
    $('#metric-language').text(localeLanguageStr);
    // replaceSubStr($(".progress-average-metric"), "<language>", localeLanguageStr);
    replaceSubStr($('#languageNotInTopWeb'), '<language>', localeLanguageStr);
    replaceSubStr($('#languageInTopWeb'), '<language>', localeLanguageStr);
    replaceSubStr($('#languageNotInTopMob'), '<language>', localeLanguageStr);
    replaceSubStr($('#languageInTopMob'), '<language>', localeLanguageStr);
    replaceSubStr($('.x-axis-label'), '<language>', localeLanguageStr);
    $('#conLanWhenGetBadge').html(localeLanguageStr);

    hideElement($('#loader'));
    showElement($('#data-wrapper'));

    getLanguageStats().then(() => {
      setSentencesContributed();
    });
    updateGoalProgressBarFromJson(MODULE.dekho['api-type'], 'validate', contributionLanguage);
  }
}

$(document).ready(function () {
  $('#download_pdf').on('click', function () {
    downloadPdf($(this).attr('data-badge'));
  });

  localStorage.setItem(CURRENT_MODULE, MODULE.dekho.value);
  localStorage.setItem('selectedType', 'validate');
  initializeFeedbackModal();
  getLocaleString()
    .then(() => {
      executeOnLoad();
    })
    .catch(() => {
      executeOnLoad();
    });
});

module.exports = { setSentencesContributed };
