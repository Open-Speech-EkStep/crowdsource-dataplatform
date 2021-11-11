const { updateLineGraph } = require('../common/lineGraph');
const { onChangeUser,showUserProfile,onOpenUserDropDown } = require('../common/header');
const { generateIndiaMap } = require('../common/map');
const { setUserNameOnInputFocus, setUserModalOnShown,setStartRecordingBtnOnClick,setGenderRadioButtonOnClick } = require('../common/speakerDetails');
const { updateLocaleLanguagesDropdown, getLocaleString } = require('../common/utils');
const { CURRENT_MODULE,CONTRIBUTION_LANGUAGE,SPEAKER_DETAILS_KEY,INITIATIVES } = require('../common/constants');
const { hasUserRegistered, showErrorPopup } = require('../common/common');
const fetch = require('../common/fetch');
const { getJson } = require('../common/utils');
const moment = require('moment');

const {setSpeakerData} = require('../common/contributionStats');
const {initializeFeedbackModal} = require('../common/feedback')
const LOCALE_STRINGS = 'localeString';
let timer;
// eslint-disable-next-line no-unused-vars
let languageToRecord = '';

const fetchDetail = (language) => {
    const url = language ? '/aggregate-data-count/asr?byLanguage=true' : '/aggregate-data-count/asr'
    return fetch(url).then(data => {
        if (!data.ok) {
          throw (data.status || 500);
        } else {
          return Promise.resolve(data.json());
        }
      })
      .catch(errStatus => {
        showErrorPopup(errStatus);
        throw errStatus
      }) 
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
    const $speakerDataDetails = $speakersData.find('#contribution-details');
    const $speakerDataLanguagesWrapper = $('#languages-wrapper');
    const activeDurationText = $('#duration').find('.active')[0].dataset.value;
    getJson("/aggregated-json/lastUpdatedAtQuery.json")
        .then(res => {
            const lastUpdatedAt = moment(res[0]['timezone']).format('DD-MM-YYYY, h:mm:ss a');
            if (lastUpdatedAt) {
                $('#data-updated').text(` ${lastUpdatedAt}`);
                $('#data-updated').removeClass('d-none');
            } else {
                $('#data-updated').addClass('d-none');
            }
        });
    getJson('/aggregated-json/participationStats.json')
        .then((participationData) => {
            const url = language ? '/aggregated-json/cumulativeDataByLanguage.json' : '/aggregated-json/cumulativeCount.json';
            getJson(url)
                .then((data) => {
                    try {
                        participationData = participationData.find(d => d.type == INITIATIVES.asr.type);
                        const sData = data.filter(d => d.type == INITIATIVES.asr.type) || [];
                        if (language == "") {
                            sData[0].total_speakers = participationData.count || 0;
                        }
                        const langaugeExists = isLanguageAvailable(sData, language);

                        if (langaugeExists) {
                            $speakerDataLanguagesWrapper.addClass('d-none');
                            $speakerDataDetails.addClass('d-none');
                            generateIndiaMap(language, INITIATIVES.asr);
                            updateLineGraph(language, activeDurationText, INITIATIVES.asr, "Transcribed", "Validated");
                            setSpeakerData(sData, language);
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
                    } catch (error) { console.log(error) }
                })
                .catch((err) => { console.log(err) });
        });

}

const initializeBlock = function () {
    localStorage.setItem(CURRENT_MODULE,INITIATIVES.asr.value);
    initializeFeedbackModal();
    localStorage.removeItem('previousLanguage');
    // const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    // const age = document.getElementById('age');
    // const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
    let languageWithNoContribution ;
    $('#language').on('change', (e) => {
        const selectedLanguage = e.target.value;
        languageWithNoContribution = selectedLanguage;
        $('#no-data-found').addClass('d-none');
        updateLanguage(selectedLanguage);
    });

    $('#duration').on('click', (e) => {
        const $durationLiInactive = $('#duration').find('li.inactive');
        const $durationLiActive = $('#duration').find('li.active');
        $durationLiInactive.removeClass('inactive').addClass('active');
        $durationLiActive.removeClass('active').addClass('inactive');
        const selectedDuration = e.target.dataset.value;
        const selectedLanguage = $('#language option:selected').val();
        updateLineGraph(selectedLanguage, selectedDuration, INITIATIVES.asr, "Transcribed","Validated");
    });

    $("#no-data-found").on('mouseenter', () => {
        clearTimeout(timer);
    });
    $("#no-data-found").on('mouseleave', () => {
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

    $("#contribute-now").on('click', () => {
        sessionStorage.setItem("i18n", "en");
        localStorage.setItem(CONTRIBUTION_LANGUAGE, languageWithNoContribution);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html',INITIATIVES.asr.value);
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
    onChangeUser('./dashboard.html',INITIATIVES.asr.value);
    onOpenUserDropDown();

    // toggleFooterPosition();

};

$(document).ready(function () {
    getLocaleString().then(()=>{
        initializeBlock();
    }).catch(() => {
        initializeBlock();
    });
});

module.exports = {fetchDetail, isLanguageAvailable, updateLanguage}