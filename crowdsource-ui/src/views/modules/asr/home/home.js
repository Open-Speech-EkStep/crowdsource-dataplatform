const { onActiveNavbar, onChangeUser, showUserProfile, onOpenUserDropDown } = require('../common/header');

const { redirectToLocalisedPage, showFunctionalCards, updateLocaleLanguagesDropdown, updateGoalProgressBarFromJson, hasUserRegistered, showByHoursChart } = require('../common/common');
const { getLocaleString } = require('../common/utils');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick,
} = require('../common/speakerDetails');

const { addToLanguage } = require('../common/languageNavBar')
const { getStatsSummary } = require('../common/commonHome');
const {
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  SPEAKER_DETAILS_KEY,
  ALL_LANGUAGES,INITIATIVES
} = require('../common/constants');

const { initializeFeedbackModal } = require('../common/feedback');

function initializeBlock() {
  const $userName = $('#username');
  let sentenceLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (!sentenceLanguage) {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
    sentenceLanguage = DEFAULT_CON_LANGUAGE;
  }
  updateLocaleLanguagesDropdown(sentenceLanguage);

  addToLanguage('from-language', ALL_LANGUAGES);
  let fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

  if (fromLanguage) {
    $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
  }

  $('#from-language').on('change', (e) => {
    fromLanguage = e.target.value;
    sentenceLanguage = fromLanguage
    localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
    sessionStorage.setItem("i18n", "en");
    redirectToLocalisedPage();
    getStatsSummary('/stats/summary/asr', INITIATIVES.asr, () => { });
    showFunctionalCards('asr', fromLanguage);
    const chartRadio = document.querySelector(
      'input[name = "topLanguageChart"][value="hours"]'
    );
    if (chartRadio) {
      chartRadio.checked = true;
    }
  });

  $('#left').on('click', () => {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
    localStorage.setItem("selectedType", "contribute");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html', INITIATIVES.asr.value);
    } else {
      location.href = './record.html';
    }
  });

  $('#right').on('click', () => {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
    localStorage.setItem("selectedType", "validate");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html', INITIATIVES.asr.value);
    } else {
      location.href = './validator-page.html';
    }
  })

  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  showFunctionalCards('asr', language);
  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  onChangeUser('./home.html', INITIATIVES.asr.value);
  onOpenUserDropDown();
  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  $('[name="topLanguageChart"]').on('change', (event) => {
    showByHoursChart(INITIATIVES.asr.value, 'home', event.target.value);
  });
  updateGoalProgressBarFromJson(INITIATIVES.asr.type);
  getStatsSummary('/stats/summary/asr', INITIATIVES.asr, () => { });
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
  initializeFeedbackModal();
  getLocaleString().then(() => {
    initializeBlock();
  }).catch(() => {
    initializeBlock();
  });
  onActiveNavbar(INITIATIVES.asr.value);
});

module.exports = {
  initializeBlock
};
