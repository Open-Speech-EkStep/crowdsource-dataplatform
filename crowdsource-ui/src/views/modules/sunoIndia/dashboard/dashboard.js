const { updateLineGraph } = require('../common/lineGraph');
const { onChangeUser,showUserProfile,onOpenUserDropDown } = require('../common/header');
const { generateIndiaMap } = require('../common/map');
const { setSpeakerDetails, setUserNameOnInputFocus, setUserModalOnShown,setStartRecordingBtnOnClick,setGenderRadioButtonOnClick } = require('../common/speakerDetails');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString } = require('../common/utils');
const { CURRENT_MODULE,CONTRIBUTION_LANGUAGE, MODULE,SPEAKER_DETAILS_KEY } = require('../common/constants');
const { hasUserRegistered } = require('../common/common');
const fetch = require('../common/fetch');

const {setSpeakerData} = require('../common/contributionStats');
const {initializeFeedbackModal} = require('../common/feedback')
const LOCALE_STRINGS = 'localeString';
let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const url = language ? '/aggregate-data-count/asr?byLanguage=true' : '/aggregate-data-count/asr'
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
                    generateIndiaMap(language, 'asr');
                    updateLineGraph(language, activeDurationText, 'asr',"Transcribed","Validated");
                    setSpeakerData(data.data, language);
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

$(document).ready(function () {
    localStorage.setItem(CURRENT_MODULE,MODULE.suno.value);
    initializeFeedbackModal();
    localStorage.removeItem('previousLanguage');
    const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
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
        updateLineGraph(selectedLanguage, selectedDuration, 'asr',"Transcribed","Validated");
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

    $("#contribute-now").on('click', (e) => {
        localStorage.setItem("i18n", "en");
        localStorage.setItem(CONTRIBUTION_LANGUAGE, languageWithNoContribution);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html',MODULE.suno.value);
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
    onChangeUser('./dashboard.html',MODULE.suno.value);
    onOpenUserDropDown();

    toggleFooterPosition();

});

module.exports = {fetchDetail, isLanguageAvailable, updateLanguage}