const { onActiveNavbar,onChangeUser, showUserProfile,onOpenUserDropDown } = require('../common/header');

const {redirectToLocalisedPage, showFucntionalCards, getAvailableLanguages,updateLocaleLanguagesDropdown, updateGoalProgressBar,hasUserRegistered, showByHoursChart} = require('../common/common');
const {getLocaleString} = require('../common/utils');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick,
} = require('../common/speakerDetails');

const {addToLanguage} = require('../common/languageNavBar')
const {getStatsSummary} = require('../common/commonHome');
const {
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  SPEAKER_DETAILS_KEY,
  ALL_LANGUAGES
} = require('../common/constants');

const {initializeFeedbackModal} = require('../common/feedback');

function initializeBlock() {
  const $userName = $('#username');
  let sentenceLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if(!sentenceLanguage){
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
    localStorage.setItem("i18n", "en");
    redirectToLocalisedPage();
    getStatsSummary('/stats/summary/asr',MODULE.suno.value, ()=>{});
    showFucntionalCards('asr',fromLanguage);
  });

  $('#start_recording').on('click', () => {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
    localStorage.setItem("selectedType", "contribute");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html',MODULE.suno.value);
    } else {
      location.href ='./record.html';
    }
  });

  $('#start_validating').on('click',()=>{
    localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
    localStorage.setItem("selectedType", "validate");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html',MODULE.suno.value);
    } else {
      location.href ='./validator-page.html';
    }
  })

  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  showFucntionalCards('asr', language);
  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  onChangeUser('./home.html',MODULE.suno.value);
  onOpenUserDropDown();
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  $('[name="topLanguageChart"]').on('change', (event) => {    
    showByHoursChart('suno', 'home', event.target.value);
});
updateGoalProgressBar(`/progress/asr`);
  getStatsSummary('/stats/summary/asr',MODULE.suno.value, ()=>{});
}



$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,MODULE.suno.value);
  initializeFeedbackModal();
  getAvailableLanguages("asr");
  getLocaleString().then(()=>{
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.suno.value);
});


module.exports = {
  initializeBlock
};
