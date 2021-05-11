const {constructChart}= require('../common/horizontalBarGraph');
const { onActiveNavbar } = require('../common/header');
const {getContributedAndTopLanguage,redirectToLocalisedPage, showFucntionalCards} = require('../common/common');
const {setSpeakerData} = require('../common/contributionStats');
const {toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString,performAPIRequest} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('../common/userDetails');

const {updateHrsForCards} = require('../common/card')
const {setLangNavBar} = require('../common/languageNavBar')

const {
  DEFAULT_CON_LANGUAGE,
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
} = require('../common/constants');

function getStatistics(response) {
  const $speakersData = $("#speaker-data");
  const $speakersDataLoader = $speakersData.find('#loader1');
  const $speakerDataDetails = $speakersData.find('#contribution-details');

  $speakersDataLoader.removeClass('d-none');
  $speakerDataDetails.addClass('d-none');

  setSpeakerData([response]);

  $speakersDataLoader.addClass('d-none');
  $speakerDataDetails.removeClass('d-none');

}


const chartReg = {};
function showByHoursChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  constructChart(
    JSON.parse(topLanguagesByHoursData),
    "total_contributions",
    "language"
  );
}

const getDefaultTargetedDiv = function (key, value, $sayListenLanguage) {
  let targetIndex = 0;
  const $sayListenLanguageItems = $sayListenLanguage.children();
  $sayListenLanguageItems.each(function (index, element) {
    if (element.getAttribute('value') === DEFAULT_CON_LANGUAGE) {
      targetIndex = index;
    }
  });
  $sayListenLanguageItems.each(function (index, element) {
    if (element.getAttribute(key) === value) {
      targetIndex = index;
    }
  });

  return $sayListenLanguageItems[targetIndex];
}

const getDefaultLang = function (){
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const $sayListenLanguage = $('#say-listen-language');

  if (!contributionLanguage) {
    const $homePage = document.getElementById('home-page');
    const defaultLangId = $homePage.getAttribute('default-lang');
    const targetedDiv = getDefaultTargetedDiv('id', defaultLangId, $sayListenLanguage);
    const language = targetedDiv.getAttribute("value");
    localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
    return language;
  }
  return contributionLanguage;
}

const setDefaultLang = function () {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const $sayListenLanguage = $('#say-listen-language');
  const $languageNavBar = $('#language-nav-bar')
  const $navBarLoader = $('#nav-bar-loader');
  $navBarLoader.addClass('d-none');
  $languageNavBar.removeClass('d-none');

  if (!contributionLanguage) {
    const $homePage = document.getElementById('home-page');
    const defaultLangId = $homePage.getAttribute('default-lang');
    const targetedDiv = getDefaultTargetedDiv('id', defaultLangId, $sayListenLanguage);
    const language = targetedDiv.getAttribute("value");
    localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
    // updateHrsForCards(language);
    updateLocaleLanguagesDropdown(language);
    setLangNavBar(targetedDiv, language, $languageNavBar);
    return;
  }
  const targetedDiv = getDefaultTargetedDiv('value', contributionLanguage, $sayListenLanguage);
  // updateHrsForCards(contributionLanguage);
  updateLocaleLanguagesDropdown(contributionLanguage);
  setLangNavBar(targetedDiv, contributionLanguage, $languageNavBar);
}

const getStatsSummary = function () {
  performAPIRequest('/stats/summary/asr')
    .then(response => {
      const languages = getContributedAndTopLanguage(response.top_languages_by_hours);
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
      showByHoursChart();
      localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response.top_languages_by_speakers));
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
      getStatistics(response.aggregate_data_count[0]);
      setDefaultLang();
      if(response.top_languages_by_hours.length === 0) {
        $("#bar_charts_container").hide();
        $("#view_all_btn").hide();
      } else {
        $("#bar_charts_container").show();
        $("#view_all_btn").show();
      }
    }).catch(err=>{
    console.log(err)
  });
}

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const $userName = $('#username');
  let sentenceLanguage = DEFAULT_CON_LANGUAGE;

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
      // updateHrsForCards(language);

      redirectToLocalisedPage();
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
      // updateHrsForCards(language);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
    }
    showFucntionalCards('asr');
  });

  $('#start_recording').on('click', () => {
    sentenceLanguage = top_lang;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    setStartRecordingBtnOnClick('./record.html');
  });

  $('#start_validating').on('click',()=>{
    sentenceLanguage = top_lang;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
    setStartRecordingBtnOnClick('./validator-page.html');
  })

  showFucntionalCards('asr');
  setSpeakerDetails(speakerDetailsKey, $userName);
  setUserNameOnInputFocus();
  setStartRecordingBtnOnClick();
  setUserModalOnShown($userName);
  getStatsSummary();

}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE,'suno');
  getLocaleString().then(()=>{
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar('suno');
});


module.exports = {
  getDefaultTargetedDiv,
};
