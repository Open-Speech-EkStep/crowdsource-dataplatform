const { onActiveNavbar, onChangeUser, showUserProfile, onOpenUserDropDown } = require('../common/header');
const { redirectToLocalisedPage, showFucntionalCards, updateGoalProgressBarFromJson, hasUserRegistered, updateLikhoLocaleLanguagesDropdown } = require('../common/common');
const {
  getLocaleString,
} = require('../common/utils');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick
} = require('../common/speakerDetails');
const { getStatsSummary } = require('../common/commonHome')


const {
  CURRENT_MODULE,
  MODULE,
  ALL_LANGUAGES,
  LIKHO_TO_LANGUAGE,
  SPEAKER_DETAILS_KEY,
  CONTRIBUTION_LANGUAGE,
  DEFAULT_CON_LANGUAGE
} = require('../common/constants');

const { initializeFeedbackModal } = require('../common/feedback');

const addToLanguage = function (id, list) {
  const selectBar = document.getElementById(id);
  let options = '';
  list.forEach(lang => {
    options = options.concat(`<option value=${lang.value}>${lang.text}</option>`);
  })
  selectBar.innerHTML = options;
}

const updatePage = (fromLanguage, toLanguage) => {
  showFucntionalCards('parallel', fromLanguage, toLanguage);
  getStatsSummary('/stats/summary/parallel', MODULE.likho);
}


function initializeBlock() {
  const $userName = $('#username');

  let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (!contributionLanguage) {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
  }

  let fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  let toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);

  addToLanguage('from-language', ALL_LANGUAGES);
  if (fromLanguage && toLanguage) {
    const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
    addToLanguage('to-language', languages);
    updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
    showFucntionalCards('parallel', fromLanguage, toLanguage);
    localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
    $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
    $(`#to-language option[value=${toLanguage}]`).attr("selected", "selected");
  } else {
    fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (fromLanguage) {
      $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
    } else {
      $('#from-language option:first-child').attr("selected", "selected");
      fromLanguage = $('#from-language option:first-child').val();
    }
    const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
    addToLanguage('to-language', languages);
    $('#to-language option:first-child').attr("selected", "selected");
    toLanguage = $('#to-language option:first-child').val();
    updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
    showFucntionalCards('parallel', fromLanguage, toLanguage);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
    localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
  }

  $('#from-language').on('change', (e) => {
    fromLanguage = e.target.value;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
    const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
    addToLanguage('to-language', languages);
    $('#to-language option:first-child').attr("selected", "selected");
    toLanguage = $('#to-language option:first-child').val();
    localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
    updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
    sessionStorage.setItem("i18n", "en");
    redirectToLocalisedPage();
    updatePage(fromLanguage, toLanguage);
  });

  $('#to-language').on('change', (e) => {
    toLanguage = e.target.value;
    const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
    updatePage(fromLanguage, toLanguage);
  });

  $('#start_recording').on('click', () => {
    localStorage.setItem("selectedType", "contribute");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html', MODULE.likho.value);
    } else {
      location.href = './record.html';
    }

  });

  $('#start_validating').on('click', () => {
    localStorage.setItem("selectedType", "validate");
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html', MODULE.likho.value);
    } else {
      location.href = './validator-page.html';
    }
  })

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
  onChangeUser('./home.html', MODULE.likho.value);
  onOpenUserDropDown();
  updateGoalProgressBarFromJson(MODULE.likho['api-type']);
  getStatsSummary('/stats/summary/parallel', MODULE.likho);
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  initializeFeedbackModal();
  getLocaleString().then(() => {
    initializeBlock();
  }).catch(() => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.likho.value);
});
