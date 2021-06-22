const { onActiveNavbar } = require('../common/header');
const { showLanguagePopup } = require('../common/locale');
const {redirectToLocalisedPage, showFucntionalCards, getAvailableLanguages,landToHome,hasUserRegistered} = require('../common/common');
const {toggleFooterPosition, getLocaleString,updateLocaleLanguagesDropdown} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick,
  setGenderRadioButtonOnClick
} = require('../common/speakerDetails');

const {setLangNavBar} = require('../common/languageNavBar')
const {getStatsSummary,getDefaultLang,setDefaultLang} = require('../common/commonHome');

const {
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  MODULE
} = require('../common/constants');

const { initializeFeedbackModal } = require('../common/feedback');

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  let sentenceLanguage;

  toggleFooterPosition();
  let top_lang = getDefaultLang();

  const $languageNavBar = $('#language-nav-bar');
  const $sayListenLanguage = $('#say-listen-language');

  $sayListenLanguage.on('click', (e) => {
    const targetedDiv = e.target;
    const language = targetedDiv.getAttribute("value");
    if (top_lang !== language) {
      top_lang = language;
      localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
      localStorage.setItem("i18n", "en");
      setLangNavBar(targetedDiv, language, $languageNavBar);
      redirectToLocalisedPage();
      // updateHrsForCards(language);
    }
  })

  $languageNavBar.on('click', (e) => {
    const targetedDiv = e.target;
    const language = targetedDiv.getAttribute('value');
    if (top_lang !== language) {
      localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
      top_lang = language;
      const $6th_place = $('#6th_option')
      const previousActiveDiv = $languageNavBar.find('.active') || $6th_place;
      previousActiveDiv.removeClass('active');
      $6th_place.addClass('d-none');
      targetedDiv.classList.add('active');
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
    }
    showFucntionalCards('ocr', language);
  });

  $('#start_recording').on('click', () => {
    sentenceLanguage = top_lang;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    localStorage.setItem("selectedType", "contribute");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html',MODULE.dekho.value);
    } else {
      location.href ='./record.html';
    }
  });

  $('#start_validating').on('click',()=>{
    sentenceLanguage = top_lang;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    localStorage.setItem("selectedType", "validate");
    if(!hasUserRegistered()){
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./validator-page.html',MODULE.dekho.value);
    } else {
      location.href ='./validator-page.html';
    }
  })
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  showFucntionalCards('ocr', language);

  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();

  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  getStatsSummary('/stats/summary/ocr',MODULE.dekho.value, setDefaultLang);
}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,MODULE.dekho.value);
  // landToHome();
  initializeFeedbackModal();
  getAvailableLanguages("ocr");
  getLocaleString().then(()=>{
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.dekho.value);
});


module.exports = {
  initializeBlock,
};
