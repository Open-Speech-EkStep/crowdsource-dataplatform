const { constructChart } = require('../common/horizontalBarGraph');
const { onActiveNavbar } = require('../common/header');
const { setSpeakerData } = require('../common/contributionStats');
const { getContributedAndTopLanguage } = require('../common/common');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString, performAPIRequest } = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('../common/userDetails');
const fetch = require('../common/fetch');

const { updateHrsForCards } = require('../common/card')

const {
  TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  TO_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  ALL_LANGUAGES
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

const getStatsSummary = function () {
  performAPIRequest('/stats/summary/parallel')
    .then(response => {
      const data = [{ "language": "Hindi", "total_contributions": "0.402" }, { "language": "English", "total_contributions": "0.069" }, { "language": "Bengali", "total_contributions": "0.033" }, { "language": "Marathi", "total_contributions": "0.031" }, { "language": "Tamil", "total_contributions": "0.020" }, { "language": "Kannada", "total_contributions": "0.017" }, { "language": "Gujarati", "total_contributions": "0.010" }, { "language": "Assamese", "total_contributions": "0.007" }, { "language": "Malayalam", "total_contributions": "0.006" }, { "language": "Punjabi", "total_contributions": "0.004" }, { "language": "Odia", "total_contributions": "0.003" }, { "language": "Telugu", "total_contributions": "0.002" }]
      const languages = getContributedAndTopLanguage(data);
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
      showByHoursChart();
      localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response.top_languages_by_speakers));
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
      getStatistics(response.aggregate_data_count[0]);
      if (response.top_languages_by_hours.length === 0) {
        $("#bar_charts_container").hide();
        $("#view_all_btn").hide();
      } else {
        $("#bar_charts_container").show();
        $("#view_all_btn").show();
      }
    }).catch(err => {
      console.log(err)
    });
}

const addLanguagesIn = function (id, list) {
  const selectBar = document.getElementById(id);
  let options = '';
  list.forEach(lang => {
    options = options.concat(`<option value=${lang}>${lang}</option>`);
  })
  selectBar.innerHTML = options;
}

const checkIsValidating = (contributionLanguages, fromLanguage, toLanguage) => {
  const keys = contributionLanguages[fromLanguage];
  if (keys) {
    keys.forEach(item => {
      if (item === toLanguage) {
        $("#right").removeClass("validate-disabled");
      } else {
        $("#right").addClass("validate-disabled");
      }
    });
  }
  localStorage.setItem(TO_LANGUAGE, toLanguage);
}

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const $userName = $('#username');
  toggleFooterPosition();

  setLanguageList().then(languagePairs => {
    const { datasetLanguages, contributionLanguages } = languagePairs;
    addLanguagesIn('from-language', datasetLanguages);
    $('#from-language option:first-child').attr("selected", "selected");
    $('#to-language option:first-child').attr("selected", "selected");
    let fromLanguage = $('#from-language option:first-child').val();
    let toLanguage = $('#to-language option:first-child').val();
    checkIsValidating(contributionLanguages, fromLanguage, toLanguage);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
    $('#from-language').on('change', (e) => {
      fromLanguage = e.target.value;
      localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
      localStorage.setItem(TO_LANGUAGE, toLanguageList[0]);
      updateLocaleLanguagesDropdown(fromLanguage);
    });

    $('#to-language').on('change', (e) => {
      toLanguage = e.target.value;
      checkIsValidating(contributionLanguages, fromLanguage, toLanguage);
    });
  })

  $('#start_recording').on('click', () => {
    setStartRecordingBtnOnClick('./record.html');
  });

  $('#start_validating').on('click', () => {
    setStartRecordingBtnOnClick('./validator-page.html');
  })

  setSpeakerDetails(speakerDetailsKey, $userName);
  setUserNameOnInputFocus();
  setUserModalOnShown($userName);
  getStatsSummary();

}

$(document).ready(function () {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  getLocaleString().then(() => {
    initializeBlock();
  }).catch(err => {
    initializeBlock();
  });
  onActiveNavbar(MODULE.likho.value);
});
