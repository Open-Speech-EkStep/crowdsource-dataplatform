const { updateLineGraph } = require('../common/lineGraph');
const { generateIndiaMap } = require('../common/map');
const { setStartRecordingBtnOnClick, setSpeakerDetails, setUserNameOnInputFocus, setUserModalOnShown } = require('../common/userDetails');
const { toggleFooterPosition, getLocaleString } = require('../common/utils');
const { DEFAULT_CON_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE, MODULE,LIKHO_FROM_LANGUAGE,
    LIKHO_TO_LANGUAGE } = require('../common/constants');
const fetch = require('../common/fetch');

const {setSpeakerData} = require('../common/contributionStats');
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
                  updateLineGraph(language, activeDurationText, 'parallel',"Translations done","Translations corrected");
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
          } catch (error) {
              console.log(error);
          }
      })
      .catch((err) => {
          console.log(err);
      });
}


$(document).ready(function () {
    localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
    localStorage.removeItem('previousLanguage');
    const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
    const contributionLanguage2 = localStorage.getItem(LIKHO_TO_LANGUAGE);
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage,contributionLanguage2);
    }

    $('#duration').on('click', (e) => {
        const $durationLiInactive = $('#duration').find('li.inactive');
        const $durationLiActive = $('#duration').find('li.active');
        $durationLiInactive.removeClass('inactive').addClass('active');
        $durationLiActive.removeClass('active').addClass('inactive');
        const selectedDuration = e.target.dataset.value;
        const selectedLanguage = $('#language option:selected').val();
        updateLineGraph(selectedLanguage, selectedDuration, 'parallel',"Translations done","Translations corrected");
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



    let fromLanguage = $('#from-dash-language option:first-child').val();
    let toLanguage = $('#to-dash-language option:first-child').val();

    $('#from-dash-language').on('change', (e) => {
      fromLanguage = e.target.value === "" ? "" : e.target.value;
        if(toLanguage !== "" && fromLanguage !== "") {
            updateLanguage(fromLanguage + '-' +toLanguage);
        } else {
            updateLanguage("");
        }
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
        setStartRecordingBtnOnClick("./record.html",MODULE.likho.value);
    });

    setSpeakerDetails(speakerDetailsKey, $userName);
    $startRecordBtnTooltip.tooltip('disable');
    setUserNameOnInputFocus();
    setUserModalOnShown($userName);
    toggleFooterPosition();

});

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

module.exports = {fetchDetail, isLanguageAvailable, updateLanguage}