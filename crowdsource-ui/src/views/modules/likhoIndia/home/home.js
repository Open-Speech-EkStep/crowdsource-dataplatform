const {constructChart} = require('../common/horizontalBarGraph');
const {onActiveNavbar} = require('../common/header');
const {setSpeakerData} = require('../common/contributionStats');
const {getContributedAndTopLanguage, redirectToLocalisedPage} = require('../common/common');
const {
  toggleFooterPosition,
  getLocaleString,
  performAPIRequest
} = require('../common/utils');
const {
  setSpeakerDetails,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('../common/userDetails');
const fetch = require('../common/fetch');

const {updateHrsForCards} = require('../common/card')

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

  setSpeakerData([response], null, "likho");

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
      const languages = getContributedAndTopLanguage(response.top_languages_by_hours, "likho");
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

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  const invalidToLang = toLanguage.toLowerCase() === "english" || toLanguage.hasLocaleText === false;
  const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  if (invalidToLang && invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else if (invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  } else if (invalidToLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else if (toLanguage.toLowerCase() === language.toLowerCase()){
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
        <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  }
}

function initializeBlock() {
  const speakerDetailsKey = 'speakerDetails';
  const $userName = $('#username');
  toggleFooterPosition();

  setLanguageList().then(languagePairs => {
    const {datasetLanguages, contributionLanguages} = languagePairs;
    let fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    let toLanguage = localStorage.getItem(TO_LANGUAGE);
    addLanguagesIn('from-language', datasetLanguages);
    if (fromLanguage && toLanguage){
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      checkIsValidating(contributionLanguages, fromLanguage, toLanguage);
      $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
      $(`#to-language option[value=${toLanguage}]`).attr("selected", "selected");
    } else {
      $('#from-language option:first-child').attr("selected", "selected");
      $('#to-language option:first-child').attr("selected", "selected");
       fromLanguage = $('#from-language option:first-child').val();
       toLanguage = $('#to-language option:first-child').val();
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      checkIsValidating(contributionLanguages, fromLanguage, toLanguage);
      localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
      localStorage.setItem(TO_LANGUAGE, toLanguage);
    }

    $('#from-language').on('change', (e) => {
      fromLanguage = e.target.value;
      localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
    });

    $('#to-language').on('change', (e) => {
      toLanguage = e.target.value;
      const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
      localStorage.setItem(TO_LANGUAGE, toLanguage);
      updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
      localStorage.setItem("i18n", "en");
      redirectToLocalisedPage();
      checkIsValidating(contributionLanguages, fromLanguage, toLanguage);
      getStatsSummary();
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
