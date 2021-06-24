const { onActiveNavbar, onChangeUser, showUserProfile } = require('../common/header');
const {  redirectToLocalisedPage,getAvailableLanguages, showFucntionalCards,landToHome,hasUserRegistered } = require('../common/common');
const {
  toggleFooterPosition,
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
  LIKHO_TO_LANGUAGE
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

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  const invalidToLang = toLanguage.toLowerCase() === "english" || toLang.hasLocaleText === false;
  const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  if (invalidToLang && invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else if (invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  } else if (invalidToLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else if (toLanguage.toLowerCase() === language.toLowerCase()) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
        <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  }
}

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  toggleFooterPosition();

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
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
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
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      showFucntionalCards('parallel', fromLanguage, toLanguage);
      localStorage.setItem(LIKHO_FROM_LANGUAGE, fromLanguage);
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
    }

    $('#from-language').on('change', (e) => {
      fromLanguage = e.target.value;
      localStorage.setItem(LIKHO_FROM_LANGUAGE, fromLanguage);
      const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
      addToLanguage('to-language', languages);
      $('#to-language option:first-child').attr("selected", "selected");
      toLanguage = $('#to-language option:first-child').val();
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
    });

    $('#to-language').on('change', (e) => {
      toLanguage = e.target.value;
      const fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
      localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
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
  setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();

  onChangeUser('./home.html',MODULE.likho.value );
  const SPEAKER_DETAILS = "speakerDetails";
  const localSpeakerDataParsed = JSON.parse(
    localStorage.getItem(SPEAKER_DETAILS)
  );
  showUserProfile(localSpeakerDataParsed.userName);
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
