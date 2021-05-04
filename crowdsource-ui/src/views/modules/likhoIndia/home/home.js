const {constructChart}= require('../common/horizontalBarGraph');
const { onActiveNavbar } = require('../common/header');
const {setSpeakerData} = require('../common/contributionStats');
const {getContributedAndTopLanguage} = require('../common/common');
const {toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString,performAPIRequest} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('../common/userDetails');
const fetch = require('../common/fetch');

const {updateHrsForCards} = require('../common/card')
const {setLangNavBar} = require('../common/languageNavBar')

const {
  DEFAULT_CON_LANGUAGE,
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  SELECTED_MODULE,
  CURRENT_MODULE,
  MODULE,
} = require('../common/constants');

const setLanguageList = () => {
  return fetch('/available-languages/parallel').then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
};

function getStatistics(response) {
  console.log(response)
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
  performAPIRequest('/stats/summary/parallel')
    .then(response => {
      const data = [{"language":"Hindi","total_contributions":"0.402"},{"language":"English","total_contributions":"0.069"},{"language":"Bengali","total_contributions":"0.033"},{"language":"Marathi","total_contributions":"0.031"},{"language":"Tamil","total_contributions":"0.020"},{"language":"Kannada","total_contributions":"0.017"},{"language":"Gujarati","total_contributions":"0.010"},{"language":"Assamese","total_contributions":"0.007"},{"language":"Malayalam","total_contributions":"0.006"},{"language":"Punjabi","total_contributions":"0.004"},{"language":"Odia","total_contributions":"0.003"},{"language":"Telugu","total_contributions":"0.002"}]
      const languages = getContributedAndTopLanguage(data);
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
      showByHoursChart();
      localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response.top_languages_by_speakers));
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
      response.aggregate_data_count = [{total_languages: "0", total_speakers: "4", total_contributions: "0.000", total_validations: "0.000"}]
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

const addLanguagesIn = function (id, list){
  const selectBar = document.getElementById(id);
  let options = '';
  list.forEach(lang => {
    options = options.concat(`<option value=${lang}>${lang}</option>`);
  })
  selectBar.innerHTML = options;
}

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');

  toggleFooterPosition();

  setLanguageList().then(languagePairs => {
    const {datasetLanguages,contributionLanguages } = languagePairs;
    addLanguagesIn('from-language', ["Hindi", "English","Marathi"]);
    const defaultFrom = datasetLanguages[0];
    addLanguagesIn('to-language', contributionLanguages[defaultFrom]);
    $('#from-language').on('change', (e) => {
      const fromLanguage = e.target.value;
      const dummyData = {"contributionLanguages":{"Hindi":["English","Urdu"],English:["Assamese","Benagali"],Marathi:["Tamil","Telugu"]}}
      addLanguagesIn('to-language', dummyData.contributionLanguages[fromLanguage]);
      localStorage.setItem('from-language', fromLanguage);
    });

    $('#to-language').on('change', (e) => {
      const toLanguage = e.target.value;
      localStorage.setItem('to-language', toLanguage);
      localStorage.setItem("i18n", "en");
      window.location.href = "./home.html";
      updateLocaleLanguagesDropdown(toLanguage);
    });
  })

  $('#start_recording').on('click', () => {
    setStartRecordingBtnOnClick('./record.html');
  });

  $('#start_validating').on('click',()=>{
    setStartRecordingBtnOnClick('./validator-page.html');
  })

  showByHoursChart();

  setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
  setUserNameOnInputFocus();
  setStartRecordingBtnOnClick();
  setUserModalOnShown($userName);
  getStatsSummary();

}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  getLocaleString().then(()=>{
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.likho.value);
});


module.exports = {
  getDefaultTargetedDiv,
};
