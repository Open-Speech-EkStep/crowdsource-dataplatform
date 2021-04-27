const {constructChart}= require('./horizontalBarGraph');
const {drawMap,getStatistics} = require('./map');
const {toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString,performAPIRequest} = require('./utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('./userDetails');

const {updateHrsForCards} = require('./card')
const {setLangNavBar} = require('./languageNavBar')

const {
  DEFAULT_CON_LANGUAGE,
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
} = require('./constants');


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

function showBySpeakersChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesBySpeakers = localStorage.getItem(
    TOP_LANGUAGES_BY_SPEAKERS
  );
  constructChart(
    JSON.parse(topLanguagesBySpeakers),
    "total_speakers",
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
    updateHrsForCards(language);
    updateLocaleLanguagesDropdown(language);
    setLangNavBar(targetedDiv, language, $languageNavBar);
    return;
  }
  const targetedDiv = getDefaultTargetedDiv('value', contributionLanguage, $sayListenLanguage);
  updateHrsForCards(contributionLanguage);
  updateLocaleLanguagesDropdown(contributionLanguage);
  setLangNavBar(targetedDiv, contributionLanguage, $languageNavBar);
}

const getStatsSummary = function () {
  performAPIRequest('/stats/summary')
    .then(response => {
      drawMap({data: response.aggregate_data_by_state});
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(response.top_languages_by_hours));
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
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
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
      window.location.href = "/";
      setLangNavBar(targetedDiv, language, $languageNavBar);
      updateHrsForCards(language);
      updateLocaleLanguagesDropdown(language);
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
      updateHrsForCards(language);
      updateLocaleLanguagesDropdown(language);
      localStorage.setItem("i18n", "en");
      window.location.href = "/";
    }
  });

  $('#start_recording').on('click', () => {
    sentenceLanguage = top_lang;
    localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
  });

  $('[name="topLanguageChart"]').on('change', (event) => {
    if (event.target.value === 'hours') {
      showByHoursChart();
    } else {
      showBySpeakersChart();
    }
  });

  setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setUserNameOnInputFocus();
  setStartRecordingBtnOnClick();
  setUserModalOnShown($userName);
  getStatsSummary();

}

$(document).ready(function () {
  getLocaleString().then(()=>{
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
});


module.exports = {
  getDefaultTargetedDiv,
};
