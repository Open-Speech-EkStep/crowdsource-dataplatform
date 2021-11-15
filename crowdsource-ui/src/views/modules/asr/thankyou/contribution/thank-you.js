const {
  SIXTY,
  HOUR_IN_SECONDS,
  LOCALE_STRINGS,
  CONTRIBUTION_LANGUAGE,
  AGGREGATED_DATA_BY_LANGUAGE,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  CURRENT_MODULE,
  config,INITIATIVES
} = require('../common/constants');
const { onChangeUser, onOpenUserDropDown, showUserProfile } = require('../common/header');
const {
  updateLocaleLanguagesDropdown,
  getLocaleString,
  performAPIRequest,
  showElement,
  hideElement,
  translate,
  getJson,
} = require('../common/utils');
const { downloadPdf } = require('../common/downloadableBadges');
const { initializeFeedbackModal } = require('../common/feedback');
const {
  setBadge,
  showByHoursChartThankyouPage,
  updateGoalProgressBarFromJson,
  replaceSubStr,
  getTopLanguage,
  redirectToHomeForDirectLanding
} = require('../common/common');

const asrCountKey = `${config.initiativeKey_1}Count`;
const CURRENT_INDEX = `${config.initiativeKey_1}CurrentIndex`;
const SPEAKER_DETAILS = 'speakerDetails';
const totalSentence = Number(localStorage.getItem(asrCountKey));

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
  const asrTitle = `${config.title_1} ${config.title_2}: A crowdsourcing initiative for Indian languages`;
  let localeText = '';
  if (rank === 0) {
    localeText = localeStrings['social sharing text without rank'];
  } else {
    localeText = localeStrings['social sharing text with rank'];
    localeText = localeText.replace('<x>', translate(language));
    localeText = localeText.replace('<y>', rank);
    localeText = localeText.replace('<initiative name>', localeStrings[config.initiative_1]);
  }
  
  const $whatsappShare = $('#whatsapp_share');
  $whatsappShare.attr('href', `https://api.whatsapp.com/send?text=${localeText}`);
  const $twitterShare = $('#twitter_share');
  $twitterShare.attr('href', `https://twitter.com/intent/tweet?text=${localeText}`);
  const $linkedinShare = $('#linkedin_share');
  $linkedinShare.attr(
    'href',
    `https://www.linkedin.com/shareArticle?mini=true&url=https://${config.brand_url}/${localisedLanguage}/home.html&title=${localeStrings[asrTitle]}&summary=${localeText}`
  );
};

const getLanguageStats = function () {
  return getJson('/aggregated-json/cumulativeDataByLanguage.json').then(jsonData => {
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const defaultData = [
      {
          "language": contributionLanguage,
          "total_speakers": 0,
          "total_contributions": 0.0,
          "total_validations": 0.0,
          "total_contribution_count": 0,
          "total_validation_count": 0,
          "type": INITIATIVES.asr.type
      },
    ]

    const filteredDataByLanguage = jsonData.filter(d => d.type == INITIATIVES.asr.type);
    const top_languages_by_hours = filteredDataByLanguage.length ? filteredDataByLanguage : defaultData;
    if (top_languages_by_hours.length > 0) {
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(top_languages_by_hours));
      const languages = getTopLanguage(
        top_languages_by_hours,
        INITIATIVES.asr.value,
        'total_contribution_count',
        'total_contributions'
      );
      localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify(languages));
      showByHoursChartThankyouPage(INITIATIVES.asr.value, 'thankyou', 'sentences');
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
    `/rewards?type=asr&language=${contributionLanguage}&source=contribute&userName=${userName}`
  ).then(data => {
    setBadge(data, localeStrings, 'contribute');
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
    onChangeUser('./thank-you.html', INITIATIVES.asr.value);
    onOpenUserDropDown();

    // setPageContentHeight();
    // setSentencesContributed();
    // toggleFooterPosition();

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
    updateGoalProgressBarFromJson('asr', 'contribute', contributionLanguage);
  }
}

$(document).ready(function () {
  redirectToHomeForDirectLanding();
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
  localStorage.setItem('selectedType', 'contribute');
  initializeFeedbackModal();
  $('#download_pdf').on('click', function () {
    downloadPdf($(this).attr('data-badge'));
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
