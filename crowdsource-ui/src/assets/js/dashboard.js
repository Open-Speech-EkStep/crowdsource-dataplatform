const { updateGraph } = require('./draw-chart');
const { onChangeUser, showUserProfile,onOpenUserDropDown } = require('./header');
const { setSpeakerDetails,
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick } = require('./speakerDetails');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, calculateTime, getLocaleString, getJson, formatTime } = require('./utils');
const { DEFAULT_CON_LANGUAGE, ALL_LANGUAGES,MODULE,CONTRIBUTION_LANGUAGE ,SPEAKER_DETAILS_KEY} = require('../../../build/js/common/constants');
// const { hasUserRegistered } = require('../../../build/js/common/common');
const { hasUserRegistered } = require('./common');
const fetch = require('./fetch');
const { data } = require('jquery');
const {whitelisting_email} = require('./env-api')
const LOCALE_STRINGS = 'localeString';
let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const byLanguage = language ? true : false;
    const url = language ? '/aggregate-data-count/text?byLanguage=true' : '/aggregate-data-count/text'
    return fetch(url).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

const getSpeakersData = (data, lang) => {
    localStorage.setItem('previousLanguage', lang);
    const speakersData = {
        languages: 0,
        speakers: 0,
        contributions: 0,
        validations: 0
    }
    if (!lang) {
        speakersData.languages = parseInt(data[0].total_languages);
        speakersData.speakers = parseInt(data[0].total_speakers);
        speakersData.contributions = parseFloat(data[0].total_contributions);
        speakersData.validations = parseFloat(data[0].total_validations);
    } else {
        const langSpeakersData = data.filter(item => item.language.toLowerCase() === lang.toLowerCase());
        speakersData.speakers = parseInt(langSpeakersData[0].total_speakers);
        speakersData.contributions = parseFloat(langSpeakersData[0].total_contributions);
        speakersData.validations = parseFloat(langSpeakersData[0].total_validations);
    }
    return speakersData;
}

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
    const $speakersDataLoader = $speakersData.find('#loader1');
    const $speakerDataDetails = $speakersData.find('#contribution-details');
    const $speakerContributionData = $speakersData.find('.contribution-data');
    const $speakerDataLanguagesWrapper = $('#languages-wrapper');
    const $speakerDataLanguagesValue = $('#languages-value');
    const $speakersDataSpeakerValue = $('#speaker-value');
    const $speakersDataContributionValue = $('#contributed-value');
    const $speakersDataValidationValue = $('#validated-value');
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
                    updateGraph(language, activeDurationText);
                    const speakersData = getSpeakersData(data.data, language);
                    const {
                        hours: contributedHours,
                        minutes: contributedMinutes,
                        seconds: contributedSeconds
                    } = calculateTime(speakersData.contributions.toFixed(3)*60*60);
                    const {
                        hours: validatedHours,
                        minutes: validatedMinutes,
                        seconds: validatedSeconds
                    } = calculateTime(speakersData.validations.toFixed(3)*60*60);

                    if (speakersData.languages) {
                        $speakerDataLanguagesValue.text(speakersData.languages);
                        $speakerDataLanguagesWrapper.removeClass('d-none');
                        $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4')
                        $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xl-3');
                    } else {
                        $speakerDataLanguagesWrapper.addClass('d-none');
                        $speakerContributionData.removeClass('col-12 col-md-3 col-lg-3 col-xl-3');
                        $speakerContributionData.addClass('col-12 col-md-4 col-lg-4 col-xl-4')
                    }

                    $speakersDataContributionValue.text(formatTime(contributedHours, contributedMinutes, contributedSeconds));
                    $speakersDataValidationValue.text(formatTime(validatedHours, validatedMinutes, validatedSeconds));
                    $speakersDataSpeakerValue.text(speakersData.speakers);

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
    localStorage.removeItem('previousLanguage');
    localStorage.setItem('module','bolo');
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
    $('#language').on('change', (e) => {
        const selectedLanguage = e.target.value;
        sentenceLanguage = selectedLanguage
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
        updateGraph(selectedLanguage, selectedDuration, true);
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
        localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html',MODULE.bolo.value);
        } else {
            location.href ='./record.html';
        }
    });

    setGenderRadioButtonOnClick();
    $startRecordBtnTooltip.tooltip('disable');
    setUserNameOnInputFocus();
    setUserModalOnShown($userName);
    if(hasUserRegistered()){
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }
    onChangeUser('./dashboard.html',MODULE.bolo.value);
    onOpenUserDropDown();
});

module.exports = {fetchDetail, getSpeakersData, isLanguageAvailable, updateLanguage}