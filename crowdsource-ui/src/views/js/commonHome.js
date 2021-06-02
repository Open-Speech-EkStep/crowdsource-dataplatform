const {
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  MODULE
} = require('./constants');
const {performAPIRequest,updateLocaleLanguagesDropdown} = require('../common/utils');
const {setLangNavBar} = require('../common/languageNavBar')

const {getContributedAndTopLanguage,showByHoursChart} = require('./common');
const {setSpeakerData} = require('./contributionStats');

function getStatistics(response, language, module) {
  const $speakersData = $("#speaker-data");
  const $speakersDataLoader = $speakersData.find('#loader1');
  const $speakerDataDetails = $speakersData.find('#contribution-details');

  $speakersDataLoader.removeClass('d-none');
  $speakerDataDetails.addClass('d-none');
  setSpeakerData(response ? [response] : null, language, module);

  $speakersDataLoader.addClass('d-none');
  $speakerDataDetails.removeClass('d-none');

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

const getStatsSummary = function (url, module, callBack=()=>{}) {
  performAPIRequest(url)
    .then(response => {
      const languages = getContributedAndTopLanguage(module == MODULE.likho.value || module == MODULE.dekho.value ? response.top_languages_by_contribution_count : response.top_languages_by_hours, module);
      console.log("local language", languages);
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
      showByHoursChart(module);
      localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response.top_languages_by_speakers));
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
      getStatistics(response.aggregate_data_count[0], null, module);
      callBack();
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


module.exports = {getStatistics, getStatsSummary,getDefaultLang,setDefaultLang}