const { updateLineGraph } = require('../common/lineGraph');
const { generateIndiaMap } = require('../common/map');
const { setSpeakerDetails, setUserNameOnInputFocus, setUserModalOnShown,setStartRecordingBtnOnClick } = require('../common/userDetails');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString } = require('../common/utils');
const { CURRENT_MODULE,CONTRIBUTION_LANGUAGE } = require('../common/constants');
const fetch = require('../common/fetch');

const {setSpeakerData} = require('../common/contributionStats');
const {checkGivingFeedbackFor} = require('../common/feedback')
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
                    updateLineGraph(language, activeDurationText, 'asr',"Hrs transcribed","Hrs validated");
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
            } catch (error) {
                console.log(error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

$(document).ready(function () {
    localStorage.setItem(CURRENT_MODULE,'suno');
    checkGivingFeedbackFor();
    localStorage.removeItem('previousLanguage');
    const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
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
        updateLineGraph(selectedLanguage, selectedDuration, 'asr',"Hrs transcribed","Hrs validated");
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
        setStartRecordingBtnOnClick('./record.html')
    });

    setSpeakerDetails(speakerDetailsKey, $userName);
    $startRecordBtnTooltip.tooltip('disable');
    setUserNameOnInputFocus();
    setUserModalOnShown($userName);

    toggleFooterPosition();

});

module.exports = {fetchDetail, isLanguageAvailable, updateLanguage}