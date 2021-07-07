const { redirectToLocalisedPage } = require('./locale');
const { onActiveNavbar, onChangeUser, showUserProfile,onOpenUserDropDown } = require('./header');
const {  getStatistics, showByHoursChart, showBySpeakersChart } = require('./home-page-charts');
const {  updateLocaleLanguagesDropdown, getLocaleString, performAPIRequest, calculateTime, formatTime } = require('./utils')
const {
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick,
} = require('./speakerDetails');

const { getContributedAndTopLanguage,hasUserRegistered } = require('./common');
const { addToLanguage } = require('../../views/common/languageNavBar/languageNavBar');
const {
    DEFAULT_CON_LANGUAGE,
    TOP_LANGUAGES_BY_HOURS,
    TOP_LANGUAGES_BY_SPEAKERS,
    AGGREGATED_DATA_BY_LANGUAGE,
    CONTRIBUTION_LANGUAGE,
    LOCALE_STRINGS,
    ALL_LANGUAGES,
    MODULE,
  SPEAKER_DETAILS_KEY
} = require('./constants');

const updateLocaleText = function (total_contributions, total_validations, language) {
    const $say_p_3 = $("#say-p-3");
    const $listen_p_3 = $("#listen-p-3");
    const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    const {
        hours: cHours,
        minutes: cMinutes,
        seconds: cSeconds
    } = calculateTime(parseFloat(total_contributions).toFixed(3)*60*60);
    const {
        hours: vHours,
        minutes: vMinutes,
        seconds: vSeconds
    } = calculateTime(parseFloat(total_validations).toFixed(3)*60*60);

    const localeLanguage = localeStrings[language];

    let hrsRecordedIn = localeStrings['hrs recorded in'];
    hrsRecordedIn = hrsRecordedIn.replace("%hours", formatTime(cHours, cMinutes, cSeconds));
    hrsRecordedIn = hrsRecordedIn.replace("%language", localeLanguage);
    $say_p_3.text(hrsRecordedIn);

    let hrsValidatedIn = localeStrings['hrs validated in'];
    hrsValidatedIn = hrsValidatedIn.replace("%hours", formatTime(vHours, vMinutes, vSeconds));
    hrsValidatedIn = hrsValidatedIn.replace("%language", localeLanguage);
    $listen_p_3.text(hrsValidatedIn);
}

function updateHrsForSayAndListen(language) {
    const $sayLoader = $('#say-loader');
    const $listenLoader = $('#listen-loader');
    $sayLoader.removeClass('d-none');
    $listenLoader.removeClass('d-none');
    const aggregateDetails = JSON.parse(localStorage.getItem(AGGREGATED_DATA_BY_LANGUAGE));
    const totalInfo = aggregateDetails && aggregateDetails.find((element) => element.language === language);
    if (totalInfo) {
        updateLocaleText(totalInfo.total_contributions, totalInfo.total_validations, language);
    } else {
        updateLocaleText(0, 0, language);
    }
    $sayLoader.addClass('d-none');
    $listenLoader.addClass('d-none');
    updateLocaleLanguagesDropdown(language);
}

const clearLocalStorage = function () {
    localStorage.removeItem(TOP_LANGUAGES_BY_HOURS);
    localStorage.removeItem(TOP_LANGUAGES_BY_SPEAKERS);
    localStorage.removeItem(AGGREGATED_DATA_BY_LANGUAGE);
    localStorage.removeItem(LOCALE_STRINGS);
}

const getStatsSummary = function () {
    performAPIRequest('/stats/summary/text')
        .then((response) => {
            const languages = getContributedAndTopLanguage(response.top_languages_by_hours, MODULE.bolo.value);
            localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
            showByHoursChart()
            const speakers = getContributedAndTopLanguage(response.top_languages_by_speakers, "speakers");
            localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(speakers));
            localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
            getStatistics(response && response.aggregate_data_count && response.aggregate_data_count.length ? response.aggregate_data_count[0] : {});
            const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
            updateHrsForSayAndListen(contributionLanguage);
            if (response.top_languages_by_hours.length === 0) {
                $("#bar_charts_container").hide();
                $("#view_all_btn").hide();
                $("#contribution_stats").hide();
            } else {
                $("#bar_charts_container").show();
                $("#view_all_btn").show();
                $("#contribution_stats").show();
            }
        });
}


function initializeBlock() {
    const $userName = $('#username');
    let top_lang = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if(!top_lang){
        localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
        top_lang = DEFAULT_CON_LANGUAGE;
    }
    updateLocaleLanguagesDropdown(top_lang);

    addToLanguage('from-language', ALL_LANGUAGES);
    let fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

    if (fromLanguage) {
        $(`#from-language option[value=${fromLanguage}]`).attr("selected", "selected");
    }

    $('#from-language').on('change', (e) => {
        fromLanguage = e.target.value;
        top_lang = fromLanguage;
        localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
        localStorage.setItem("i18n", "en");
        updateHrsForSayAndListen(fromLanguage);
        redirectToLocalisedPage();
        getStatsSummary();
    });

    $('#start_recording').on('click', () => {
        localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('../record.html',MODULE.bolo.value);
        } else {
            location.href ='../record.html';
        }
    });

    $('#start_validating').on('click', () => {
        localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
        localStorage.setItem("selectedType", "validate");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('../validator-page.html',MODULE.bolo.value);
        } else {
            location.href ='../validator-page.html';
        }
    });

    $('[name="topLanguageChart"]').on('change', (event) => {
        if (event.target.value === 'hours') {
            showByHoursChart();
        } else {
            showBySpeakersChart();
        }
    });

    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();

    setUserModalOnShown($userName);
    $startRecordBtnTooltip.tooltip('disable');
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();
    onChangeUser('./home.html',MODULE.bolo.value);
    onOpenUserDropDown();
    if(hasUserRegistered()){
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }

    const $say = $('#say');
    const $listen = $('#listen');
    const $listen_p_2 = $('#listen-p-2');
    const $say_p_2 = $('#say-p-2');
    const $say_container = $('#say_container');
    const $listen_container = $('#listen_container');
    $say.hover(() => {
        $(".card1").css("box-shadow","0 8px 0 #43c0d7,0 0 32px #43c0d7")
        $say_p_2.removeClass('d-none');
        $say_container.addClass('say-active');
    }, () => {
        $(".card1").css("box-shadow","0 8px 0 #43c0d7, 0px 0px 32px rgb(0 0 0 / 10%)")
        $say_p_2.addClass('d-none');
        $say_container.removeClass('say-active');
    });

    $listen.hover(() => {
        $(".card2").css("box-shadow","0 8px 0 #43c0d7,0 0 32px #43c0d7")
        $listen_p_2.removeClass('d-none');
        $listen_container.addClass('listen-active');
    }, () => {
        $(".card2").css("box-shadow","0 8px 0 #43c0d7, 0px 0px 32px rgb(0 0 0 / 10%)")
        $listen_p_2.addClass('d-none');
        $listen_container.removeClass('listen-active');
    });
    getStatsSummary();

}

$(document).ready(function () {
    localStorage.setItem('module', 'bolo');
    clearLocalStorage();
    onActiveNavbar('bolo');
    getLocaleString().then(() => {
        initializeBlock();
    }).catch(err => {
        initializeBlock();
    });
});


module.exports = {
    updateHrsForSayAndListen,
    getStatsSummary
};
