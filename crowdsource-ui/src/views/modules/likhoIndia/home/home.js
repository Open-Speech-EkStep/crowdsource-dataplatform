const { onActiveNavbar, onChangeUser, showUserProfile ,onOpenUserDropDown} = require('../common/header');
const {  redirectToLocalisedPage,getAvailableLanguages, showFucntionalCards,landToHome,hasUserRegistered,updateLikhoLocaleLanguagesDropdown } = require('../common/common');
const {
  // toggleFooterPosition,
  getLocaleString,
} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick
} = require('../common/speakerDetails');
const {getStatsSummary} = require('../common/commonHome')

const { updateHrsForCards } = require('../common/card')

const {
  CURRENT_MODULE,
  MODULE,
  ALL_LANGUAGES,
  LIKHO_FROM_LANGUAGE,
  LIKHO_TO_LANGUAGE,
  SPEAKER_DETAILS_KEY,
  CONTRIBUTION_LANGUAGE,
  DEFAULT_CON_LANGUAGE
} = require('../common/constants');

const {initializeFeedbackModal} = require('../common/feedback')

const addToLanguage = function (id, list) {
  const selectBar = document.getElementById(id);
  let options = '';
  list.forEach(lang => {
    options = options.concat(`<option value=${lang.value}>${lang.text}</option>`);
  })
  selectBar.innerHTML = options;
}


function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  // toggleFooterPosition();

  let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if(!contributionLanguage){
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
  }

  getAvailableLanguages('parallel').then(languagePairs => {
    const { datasetLanguages, contributionLanguages } = languagePairs;
    let fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
    let toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);

    let nativeLanguage  = [];
    datasetLanguages.forEach((item) => {
        const data = ALL_LANGUAGES.find(ele => ele.value == item);
        if(data) {
          nativeLanguage.push(data);
        }
     }
    );
    addToLanguage('from-language', nativeLanguage);
    
    if (fromLanguage && toLanguage) {
      const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
      addToLanguage('to-language', languages);
      updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
      showFucntionalCards('parallel', fromLanguage, toLanguage);
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
      $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
      $(`#to-language option[value=${toLanguage}]`).attr("selected", "selected");
    } else {
      $('#from-language option:first-child').attr("selected", "selected");
      fromLanguage = $('#from-language option:first-child').val();
      const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
      addToLanguage('to-language', languages);
      $('#to-language option:first-child').attr("selected", "selected");
      toLanguage = $('#to-language option:first-child').val();
      updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
      showFucntionalCards('parallel', fromLanguage, toLanguage);
      localStorage.setItem(LIKHO_FROM_LANGUAGE, fromLanguage);
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
    }

    $('#from-language').on('change', (e) => {
      fromLanguage = e.target.value;
      localStorage.setItem(LIKHO_FROM_LANGUAGE, fromLanguage);
      localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
      const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
      addToLanguage('to-language', languages);
      $('#to-language option:first-child').attr("selected", "selected");
      toLanguage = $('#to-language option:first-child').val();
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
      updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
      showFucntionalCards('parallel', fromLanguage, toLanguage);
      getStatsSummary('/stats/summary/parallel',MODULE.likho.value);
    });

    $('#to-language').on('change', (e) => {
      toLanguage = e.target.value;
      const fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
      updateLikhoLocaleLanguagesDropdown(fromLanguage, toLanguage);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
      showFucntionalCards('parallel', fromLanguage, toLanguage);
      getStatsSummary('/stats/summary/parallel',MODULE.likho.value);
    });
  })

  $('#start_recording').on('click', () => {
    localStorage.setItem("selectedType", "contribute");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html',MODULE.likho.value);
    } else {
      location.href ='./record.html';
    }

  });

  $('#start_validating').on('click', () => {
    localStorage.setItem("selectedType", "validate");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html',MODULE.likho.value);
    } else {
      location.href ='./validator-page.html';
    }
  })

  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();

  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  // setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./home.html',MODULE.likho.value );
  onOpenUserDropDown();
  getStatsSummary('/stats/summary/parallel',MODULE.likho.value);

}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  initializeFeedbackModal();
  getLocaleString().then(() => {
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.likho.value);
});
