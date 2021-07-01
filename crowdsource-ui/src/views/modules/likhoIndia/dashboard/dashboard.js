const { updateLineGraph } = require('../common/lineGraph');
const { generateIndiaMap } = require('../common/map');
const { setStartRecordingBtnOnClick, setSpeakerDetails, setUserNameOnInputFocus, setUserModalOnShown,setGenderRadioButtonOnClick } = require('../common/speakerDetails');
const { toggleFooterPosition, getLocaleString } = require('../common/utils');
const { hasUserRegistered , updateLikhoLocaleLanguagesDropdown} = require('../common/common');
const platform = require('../common/platform')
const { DEFAULT_CON_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE, MODULE,LIKHO_FROM_LANGUAGE,SPEAKER_DETAILS_KEY,
    LIKHO_TO_LANGUAGE } = require('../common/constants');
const fetch = require('../common/fetch');

const {setSpeakerData} = require('../common/contributionStats');
const {initializeFeedbackModal} = require('../common/feedback')

const { onChangeUser , showUserProfile,onOpenUserDropDown} = require('../common/header');

const LOCALE_STRINGS = 'localeString';
let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const url = language ? '/aggregate-data-count/parallel?byLanguage=true' : '/aggregate-data-count/parallel'
    return fetch(url).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

function isLanguageAvailable(data, lang) {
    let langaugeExists = false;
    if (!lang) return true;
    data.forEach(item => {
        if(item.language) {
            if (item.language.toLowerCase() === lang.toLowerCase()) {
                langaugeExists = true;
            }
        }
    });
    return langaugeExists;
}

const addToLanguage = function (id, list) {
    const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    let defaultText = 'All Languages';
    if(localeStrings){
        defaultText = localeStrings['All Languages'];
    }

    const selectBar = document.getElementById(id);
    let options = '';
    options = options.concat(`<option value="">${defaultText}</option>`);
    list.forEach(lang => {
      options = options.concat(`<option value=${lang.value}>${lang.text}</option>`);
    });
    selectBar.innerHTML = options;
  }

function updateLanguage(language) {
    const $speakersData = $('#speaker-data');
    const $speakersDataLoader = $speakersData.find('#loader1');
    const $speakerDataDetails = $speakersData.find('#contribution-details');
    const $speakerDataLanguagesWrapper = $('#languages-wrapper');
    const activeDurationText = $('#duration').find('.active')[0].dataset.value;

    fetchDetail(language)
      .then((data) => {
          try {
              const langaugeExists = isLanguageAvailable(data.data, language);
              if (data.last_updated_at) {
                  $('#data-updated').text(` ${data.last_updated_at}`);
                  $('#data-updated').removeClass('d-none');
              } else {
                  $('#data-updated').addClass('d-none');
              }
              if (langaugeExists) {
                  $speakersDataLoader.removeClass('d-none');
                  $speakerDataLanguagesWrapper.addClass('d-none');
                  $speakerDataDetails.addClass('d-none');
                  generateIndiaMap(language, 'parallel');
                  updateLineGraph(language, activeDurationText, 'parallel',"Translations done","Translations validated");
                  setSpeakerData(data.data, language, 'likho');
                  $speakersDataLoader.addClass('d-none');
                  $speakerDataDetails.removeClass('d-none');
              } else {
                  const previousLanguage = localStorage.getItem('previousLanguage');
                  languageToRecord = language;
                  $("#language").val(previousLanguage);
                  $("#languageSelected").text(` ${language}, `);
                  $("#no-data-found").removeClass('d-none');
                  timer = setTimeout(() => {
                      $('#no-data-found').addClass('d-none');
                  }, 5000);
              }
          } catch (error) {}
      })
      .catch((err) => {});
}


const executeOnLoad = function () {
    if(platform.name == "Firefox") {
        $("#from-dash-language").css('text-indent', '-25px');
        $("#to-dash-language").css('text-indent', '-25px');
    } else {
        $("#from-dash-language").css('text-indent', '75px');
        $("#to-dash-language").css('text-indent', '75px');
    }
    localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
    initializeFeedbackModal();
    localStorage.removeItem('previousLanguage');
    const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
    const contributionLanguage2 = localStorage.getItem(LIKHO_TO_LANGUAGE);
    if(contributionLanguage) {
        updateLikhoLocaleLanguagesDropdown(contributionLanguage, contributionLanguage2);
    }

    $('#duration').on('click', (e) => {
        const $durationLiInactive = $('#duration').find('li.inactive');
        const $durationLiActive = $('#duration').find('li.active');
        $durationLiInactive.removeClass('inactive').addClass('active');
        $durationLiActive.removeClass('active').addClass('inactive');
        const selectedDuration = e.target.dataset.value;
        const selectedLanguage = $('#language option:selected').val();
        updateLineGraph(selectedLanguage, selectedDuration, 'parallel',"Translations done","Translations validated");
    });

    $("#no-data-found").on('mouseenter', (e) => {
        clearTimeout(timer);
    });
    $("#no-data-found").on('mouseleave', (e) => {
        timer = setTimeout(() => {
            $('#no-data-found').addClass('d-none');
        }, 5000);
    });

    const noDataFoundEl = document.getElementById('no-data-found');
    noDataFoundEl.addEventListener('touchstart', function () {
        clearTimeout(timer);
    }, {passive: true});
    noDataFoundEl.addEventListener('touchend', function () {
        timer = setTimeout(() => {
            $('#no-data-found').addClass('d-none');
        }, 5000);
    }, {passive: true});

    addToLanguage('to-dash-language', ALL_LANGUAGES);

    let fromLanguage = $('#from-dash-language option:first-child').val();
    let toLanguage = $('#to-dash-language option:first-child').val();

    $('#from-dash-language').on('change', (e) => {
      fromLanguage = e.target.value === "" ? "" : e.target.value;
      const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
      addToLanguage('to-dash-language', languages);
      $('#to-language option:first-child').attr("selected", "selected");
      toLanguage = $('#to-language option:first-child').val();
        // if(toLanguage !== "" && fromLanguage !== "") {
        //     updateLanguage(fromLanguage + '-' +toLanguage);
        // } else {
        //     updateLanguage("");
        // }
    });

    $('#to-dash-language').on('change', (e) => {
      toLanguage = e.target.value === "" ? "" : e.target.value;
      if(toLanguage !== "" && fromLanguage !== "") {
        updateLanguage(fromLanguage + '-' +toLanguage);
      } else {
        updateLanguage("");
      }
    });

    $("#contribute-now").on('click', (e) => {
        localStorage.setItem("i18n", "en");
        sentenceLanguage = languageToRecord;
        localStorage.setItem(LIKHO_FROM_LANGUAGE, fromLanguage);
        localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html',MODULE.likho.value);
        } else {
            location.href ='./record.html';
        }
    });

    setUserModalOnShown($userName);
    // setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();
    $startRecordBtnTooltip.tooltip('disable');
    if(hasUserRegistered()){
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }
    onChangeUser('./dashboard.html',MODULE.likho.value);
    onOpenUserDropDown();

    // toggleFooterPosition();

};

$(document).ready(() => {
    getLocaleString().then(() => {
        executeOnLoad();
    }).catch(() => {
        executeOnLoad();
    });
})



module.exports = {fetchDetail, isLanguageAvailable, updateLanguage}