const { updateGraph } = require('./draw-chart');
const { onChangeUser, showUserProfile, onOpenUserDropDown } = require('./header');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setGenderRadioButtonOnClick,
  setStartRecordingBtnOnClick,
} = require('./speakerDetails');
const {
  updateLocaleLanguagesDropdown,
  calculateTime,
  getLocaleString,
  formatTime,
  getJson,
} = require('./utils');
const {
  DEFAULT_CON_LANGUAGE,
  CONTRIBUTION_LANGUAGE,
  SPEAKER_DETAILS_KEY,
  INITIATIVES,
  CURRENT_MODULE,
} = require('../../../build/js/common/constants');
const { hasUserRegistered, showErrorPopup } = require('./common');
const fetch = require('./fetch');
const moment = require('moment');
const LOCALE_STRINGS = 'localeString';
let timer;

// eslint-disable-next-line no-unused-vars
let languageToRecord = '';

const fetchDetail = language => {
  const url = language ? '/aggregate-data-count/text?byLanguage=true' : '/aggregate-data-count/text';
  return fetch(url)
    .then(data => {
      if (!data.ok) {
        throw data.status || 500;
      } else {
        return Promise.resolve(data.json());
      }
    })
    .catch(errStatus => {
      showErrorPopup(errStatus);
      throw errStatus;
    });
};

const getSpeakersData = (data, lang) => {
  localStorage.setItem('previousLanguage', lang);
  const speakersData = {
    languages: 0,
    speakers: 0,
    contributions: 0,
    validations: 0,
  };

  if (data && data.length) {
    if (!lang) {
      speakersData.languages = parseInt(data[0].total_languages) || 0;
      speakersData.speakers = parseInt(data[0].total_speakers) || 0;
      speakersData.contributions = parseFloat(data[0].total_contributions) || 0;
      speakersData.validations = parseFloat(data[0].total_validations) || 0;
    } else {
      const langSpeakersData = data.filter(item => item.language.toLowerCase() === lang.toLowerCase());
      speakersData.speakers = parseInt(langSpeakersData[0].total_speakers) || 0;
      speakersData.contributions = parseFloat(langSpeakersData[0].total_contributions) || 0;
      speakersData.validations = parseFloat(langSpeakersData[0].total_validations) || 0;
    }
  }
  return speakersData;
};

function isLanguageAvailable(data, lang) {
  let langaugeExists = false;
  if (!lang) return true;
  data.forEach(item => {
    if (item.language.toLowerCase() === lang.toLowerCase()) {
      langaugeExists = true;
    }
  });
  return langaugeExists;
}

function updateLanguage(language) {
  const $speakersData = $('#speaker-data');
  const $speakerDataDetails = $speakersData.find('#contribution-details');
  const $speakerDataLanguagesWrapper = $('#languages-wrapper');
  const $speakerContributionData = $speakersData.find('.contribution-data');
  const $speakerDataLanguagesValue = $('#languages-value');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataContributionValue = $('#contributed-value');
  const $speakersDataValidationValue = $('#validated-value');
  const activeDurationText = $('#duration').find('.active')[0].dataset.value;

  getJson('/aggregated-json/lastUpdatedAtQuery.json').then(res => {
    const lastUpdatedAt = moment(res[0]['timezone']).format('DD-MM-YYYY, h:mm:ss a');
    if (lastUpdatedAt) {
      $('#data-updated').text(` ${lastUpdatedAt}`);
      $('#data-updated').removeClass('d-none');
    } else {
      $('#data-updated').addClass('d-none');
    }
  });

  const url = language
    ? '/aggregated-json/cumulativeDataByLanguage.json'
    : '/aggregated-json/cumulativeCount.json';
  getJson('/aggregated-json/participationStats.json').then(participationData => {
    getJson(url)
      .then(data => {
        try {
          participationData = participationData.length
            ? participationData.find(d => d.type == INITIATIVES.text.type)
            : {};
          const bData = data.filter(d => d.type == INITIATIVES.text.type) || [];
          if (language == '' && bData.length !== 0) {
            if(!participationData){
              participationData = {}
            }
            bData[0].total_speakers = participationData.count || 0;
          }
          const langaugeExists = isLanguageAvailable(bData, language);

          if (langaugeExists) {
            $speakerDataLanguagesWrapper.addClass('d-none');
            $speakerDataDetails.addClass('d-none');
            updateGraph(language, activeDurationText);
            const speakersData = getSpeakersData(bData, language);
            const {
              hours: contributedHours,
              minutes: contributedMinutes,
              seconds: contributedSeconds,
            } = calculateTime(speakersData.contributions.toFixed(3) * 60 * 60);
            const {
              hours: validatedHours,
              minutes: validatedMinutes,
              seconds: validatedSeconds,
            } = calculateTime(speakersData.validations.toFixed(3) * 60 * 60);

            if (speakersData.languages) {
              $speakerDataLanguagesValue.text(speakersData.languages);
              $speakerDataLanguagesWrapper.removeClass('d-none');
              $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4');
              $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xl-3');
            } else {
              $speakerDataLanguagesWrapper.addClass('d-none');
              $speakerContributionData.removeClass('col-12 col-md-3 col-lg-3 col-xl-3');
              $speakerContributionData.addClass('col-12 col-md-4 col-lg-4 col-xl-4');
            }

            $speakersDataContributionValue.text(
              formatTime(contributedHours, contributedMinutes, contributedSeconds)
            );
            $speakersDataValidationValue.text(formatTime(validatedHours, validatedMinutes, validatedSeconds));
            $speakersDataSpeakerValue.text(speakersData.speakers);

            $speakerDataDetails.removeClass('d-none');
          } else {
            const previousLanguage = localStorage.getItem('previousLanguage');
            languageToRecord = language;
            $('#language').val(previousLanguage);
            $('#languageSelected').text(` ${language}, `);
            $('#no-data-found').removeClass('d-none');
            timer = setTimeout(() => {
              $('#no-data-found').addClass('d-none');
            }, 5000);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
}

const initializeBlock = function () {
  localStorage.removeItem('previousLanguage');
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.text.value);
  if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  let sentenceLanguage = DEFAULT_CON_LANGUAGE;
  const $userName = $('#username');
  updateLanguage('');
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (contributionLanguage) {
    updateLocaleLanguagesDropdown(contributionLanguage);
  }
  $('#language').on('change', e => {
    const selectedLanguage = e.target.value;
    sentenceLanguage = selectedLanguage;
    $('#no-data-found').addClass('d-none');
    updateLanguage(selectedLanguage);
  });

  $('#duration').on('click', e => {
    const $durationLiInactive = $('#duration').find('li.inactive');
    const $durationLiActive = $('#duration').find('li.active');
    $durationLiInactive.removeClass('inactive').addClass('active');
    $durationLiActive.removeClass('active').addClass('inactive');

    const selectedDuration = e.target.dataset.value;
    const selectedLanguage = $('#language option:selected').val();
    updateGraph(selectedLanguage, selectedDuration, true);
  });

  $('#no-data-found').on('mouseenter', () => {
    clearTimeout(timer);
  });
  $('#no-data-found').on('mouseleave', () => {
    timer = setTimeout(() => {
      $('#no-data-found').addClass('d-none');
    }, 5000);
  });

  const noDataFoundEl = document.getElementById('no-data-found');
  noDataFoundEl.addEventListener(
    'touchstart',
    function () {
      clearTimeout(timer);
    },
    { passive: true }
  );
  noDataFoundEl.addEventListener(
    'touchend',
    function () {
      timer = setTimeout(() => {
        $('#no-data-found').addClass('d-none');
      }, 5000);
    },
    { passive: true }
  );

  $('#contribute-now').on('click', () => {
    sessionStorage.setItem('i18n', 'en');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
    localStorage.setItem('selectedType', 'contribute');
    if (!hasUserRegistered()) {
      $('#userModal').modal('show');
      setStartRecordingBtnOnClick('./record.html', INITIATIVES.text.value);
    } else {
      location.href = './record.html';
    }
  });

  setGenderRadioButtonOnClick();
  $startRecordBtnTooltip.tooltip('disable');
  setUserNameOnInputFocus();
  setUserModalOnShown($userName);
  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./dashboard.html', INITIATIVES.text.value);
  onOpenUserDropDown();
};

$(document).ready(function () {
  getLocaleString()
    .then(() => {
      initializeBlock();
    })
    .catch(() => {
      initializeBlock();
    });
});

module.exports = { fetchDetail, getSpeakersData, isLanguageAvailable, updateLanguage };
