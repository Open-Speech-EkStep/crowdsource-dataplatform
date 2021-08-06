const {
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE
} = require('./constants');
const { setLangNavBar } = require('../common/languageNavBar')

const { getContributedAndTopLanguage, showByHoursChart, updateLocaleLanguagesDropdown, safeJqueryErrorHandling } = require('./common');
const { setSpeakerData } = require('./contributionStats');
const { context_root } = require('./env-api');

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

const getDefaultLang = function () {
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
const getStats = (module) => {
  $.getJSON(`${context_root}/aggregated-json/cumulativeCount.json`, (jsonData) => {
    $.getJSON(`${context_root}/aggregated-json/participationStats.json`, (jsonData2) => {
      const bData2 = jsonData2.find(d => d.type == module["api-type"]) || {};
      const bData = jsonData.find(d => d.type == module["api-type"]) || {};
      bData.total_speakers = bData2.count || 0;
      getStatistics(bData || {}, null, module.value);
    });
  }).fail((e) => {
    safeJqueryErrorHandling(e);
  });
}
const getChartStats = (module) => {
  $.getJSON(`${context_root}/aggregated-json/topLanguagesByHoursContributed.json`, (jsonData) => {
    const top_languages_by_hours = jsonData.filter(d => d.type == module["api-type"]);
    localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(top_languages_by_hours));
    const languages = getContributedAndTopLanguage(top_languages_by_hours, module.value);
    localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
    showByHoursChart(module.value);

    if (top_languages_by_hours.length === 0) {
      $("#bar_charts_container").hide();
      $("#view_all_btn").hide();
      $("#contribution_stats").hide();
    } else {
      $("#bar_charts_container").show();
      $("#view_all_btn").show();
      $("#contribution_stats").show();
    }
  }).fail((e) => {
    safeJqueryErrorHandling(e);
  });
}
const getSpeakerChartStats = (module) => {
  $.getJSON(`${context_root}/aggregated-json/topLanguagesBySpeakerContributions.json`, (jsonData) => {
    const top_languages_by_speakers = jsonData.filter(d => d.type == module["api-type"]);
    localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(top_languages_by_speakers));
  }).fail((e) => {
    safeJqueryErrorHandling(e);
  });
}
const getStatsSummary = function (url, module, callBack = () => { }) {

  getStats(module);
  getChartStats(module);
  getSpeakerChartStats(module);
  callBack();

}


module.exports = { getStatistics, getStatsSummary, getDefaultLang, setDefaultLang }