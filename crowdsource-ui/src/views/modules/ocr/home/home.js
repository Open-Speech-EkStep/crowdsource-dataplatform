const { onActiveNavbar, onChangeUser, showUserProfile, onOpenUserDropDown } = require('../common/header');
const { redirectToLocalisedPage, showFunctionalCards, hasUserRegistered, updateLocaleLanguagesDropdown, updateGoalProgressBarFromJson } = require('../common/common');
const { getLocaleString,fetchLocationInfo,safeJson } = require('../common/utils');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick
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

  let top_lang = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (!top_lang) {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
    top_lang = DEFAULT_CON_LANGUAGE;
  }

  updateLocaleLanguagesDropdown(top_lang)

  addToLanguage('from-language', ALL_LANGUAGES);
  let fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

  if (fromLanguage) {
    $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
  }

  $('#from-language').on('change', (e) => {
    fromLanguage = e.target.value;
    top_lang = fromLanguage;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
    sessionStorage.setItem("i18n", "en");
    redirectToLocalisedPage();
    getStatsSummary('/stats/summary/ocr', INITIATIVES.ocr, () => { });
    showFunctionalCards('ocr', fromLanguage);
  });

  $('#left').on('click', () => {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    localStorage.setItem("selectedType", "contribute");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html', INITIATIVES.ocr.value);
    } else {
      location.href = './record.html';
    }
  });

  $('#right').on('click', () => {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    localStorage.setItem("selectedType", "validate");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html', INITIATIVES.ocr.value);
    } else {
      location.href = './validator-page.html';
    }
  })
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  showFunctionalCards('ocr', language);
  updateGoalProgressBarFromJson(INITIATIVES.ocr.type);
  getStatsSummary('/stats/summary/ocr', INITIATIVES.ocr, () => { });
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();

  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();
  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./home.html', INITIATIVES.ocr.value);
  onOpenUserDropDown();
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
  initializeFeedbackModal();
  fetchLocationInfo()
    .then(res => {
      return safeJson(res);
    })
    .then(response => {
      localStorage.setItem('state_region', response.regionName);
      localStorage.setItem('country', response.country);
    })
    .catch(err => {
      console.log(err);
    });
  getLocaleString().then(() => {
    initializeBlock();
  }).catch(() => {
    initializeBlock();
  });
  onActiveNavbar(INITIATIVES.ocr.value);
});


module.exports = {
  initializeBlock,
};
