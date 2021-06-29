const { onActiveNavbar,onChangeUser, showUserProfile,onOpenUserDropDown } = require('../common/header');

const {redirectToLocalisedPage, showFucntionalCards, getAvailableLanguages,updateLocaleLanguagesDropdown, landToHome,hasUserRegistered} = require('../common/common');
const {toggleFooterPosition, getLocaleString} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick,
} = require('../common/speakerDetails');

const {setLangNavBar} = require('../common/languageNavBar')
const {updateHrsForCards} = require('../common/card')
const {getStatsSummary,getDefaultLang,setDefaultLang} = require('../common/commonHome');
const {
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  SPEAKER_DETAILS_KEY
} = require('../common/constants');

const {initializeFeedbackModal} = require('../common/feedback');

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  let sentenceLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if(!sentenceLanguage){
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
    sentenceLanguage = DEFAULT_CON_LANGUAGE;
  }
  // toggleFooterPosition();
  // let top_lang = getDefaultLang();
  // if(top_lang){
    updateLocaleLanguagesDropdown(sentenceLanguage);
  // }

  const $languageNavBar = $('#language-nav-bar');
  const $sayListenLanguage = $('#say-listen-language');
  // updateHrsForCards(top_lang);

  $sayListenLanguage.on('click', (e) => {
    const targetedDiv = e.target;
    const language = targetedDiv.getAttribute("value");
    if (sentenceLanguage !== language) {
      sentenceLanguage = language;
      localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
      localStorage.setItem("i18n", "en");
      setLangNavBar(targetedDiv, language, $languageNavBar);
      // updateHrsForCards(language);
      redirectToLocalisedPage();
    }
    showFucntionalCards('asr', language);
  })

  $languageNavBar.on('click', (e) => {
    const targetedDiv = e.target;
    const language = targetedDiv.getAttribute('value');
    if (sentenceLanguage !== language) {
      localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
      sentenceLanguage = language;
      const $6th_place = $('#6th_option')
      const previousActiveDiv = $languageNavBar.find('.active') || $6th_place;
      previousActiveDiv.removeClass('active');
      $6th_place.addClass('d-none');
      targetedDiv.classList.add('active');
      localStorage.setItem("i18n", "en");
      // updateHrsForCards(language);
      redirectToLocalisedPage();
    }
    showFucntionalCards('asr', language);
  });

  $('#start_recording').on('click', () => {
    // sentenceLanguage = top_lang;
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
    // sentenceLanguage = top_lang;
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
  // setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  onChangeUser('./home.html',MODULE.suno.value);
  onOpenUserDropDown();
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  getStatsSummary('/stats/summary/asr',MODULE.suno.value, setDefaultLang);
}



$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,MODULE.suno.value);
  // landToHome();
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
