const { redirectToLocalisedPage } = require('./locale');
const { onActiveNavbar, onChangeUser, showUserProfile, onOpenUserDropDown } = require('./header');
const { getStatistics, showByHoursChart, showBySpeakersChart } = require('./home-page-charts');
const { updateLocaleLanguagesDropdown, getLocaleString } = require('./utils')
const {
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick,
} = require('./speakerDetails');

const { getContributedAndTopLanguage, hasUserRegistered, safeJqueryErrorHandling } = require('./common');
const { addToLanguage } = require('../../views/common/languageNavBar/languageNavBar');
const { updateGoalProgressBarFromJson, showFunctionalCards } = require('../../../build/js/common/common')


const {
    DEFAULT_CON_LANGUAGE,
    TOP_LANGUAGES_BY_HOURS,
    TOP_LANGUAGES_BY_SPEAKERS,
    AGGREGATED_DATA_BY_LANGUAGE,
    CUMULATIVE_DATA,
    CONTRIBUTION_LANGUAGE,
    LOCALE_STRINGS,
    ALL_LANGUAGES,
    MODULE,
    SPEAKER_DETAILS_KEY
} = require('./constants');
const { context_root } = require('./env-api');
const { updateHrsForCards } = require('../../../build/js/common/card');

const clearLocalStorage = function () {
    localStorage.removeItem(TOP_LANGUAGES_BY_HOURS);
    localStorage.removeItem(TOP_LANGUAGES_BY_SPEAKERS);
    localStorage.removeItem(AGGREGATED_DATA_BY_LANGUAGE);
    localStorage.removeItem(CUMULATIVE_DATA);
    localStorage.removeItem(LOCALE_STRINGS);
}

const getStatsSummary = function () {
    $.getJSON(`${context_root}/aggregated-json/cumulativeCount.json`, (jsonData) => {
        $.getJSON(`${context_root}/aggregated-json/participationStats.json`, (jsonData2) => {
            const bData2 = jsonData2.find(d => d.type == 'text') || {};
            const bData = jsonData.find(d => d.type == 'text') || {};
            bData.total_speakers = bData2.count || 0;
            getStatistics(bData || {});
        });
    }).fail((e) => {
        safeJqueryErrorHandling(e);
    });
    $.getJSON(`${context_root}/aggregated-json/topLanguagesByHoursContributed.json`, (jsonData) => {
        const top_languages_by_hours = jsonData.filter(d => d.type == "text");
        localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(top_languages_by_hours));
        const languages = getContributedAndTopLanguage(top_languages_by_hours, MODULE.bolo.value);
        localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
        showByHoursChart();
        if (top_languages_by_hours.length === 0) {
            $("#bar_charts_container").hide();
            $("#view_all_btn").hide();
            $("#contribution_stats").hide();
        } else {
            $("#bar_charts_container").show();
            $("#view_all_btn").show();
            $("#contribution_stats").show();
        }
    }).fail((e) => {
        safeJqueryErrorHandling(e);
    });
    $.getJSON(`${context_root}/aggregated-json/topLanguagesBySpeakerContributions.json`, (jsonData) => {
        const top_languages_by_speakers = jsonData.filter(d => d.type == "text");
        const speakers = getContributedAndTopLanguage(top_languages_by_speakers, "speakers");
        localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(speakers));
    }).fail((e) => {
        safeJqueryErrorHandling(e);
    });
    $.getJSON(`${context_root}/aggregated-json/cumulativeDataByLanguage.json`, (jsonData) => {
        const cumulativeData = jsonData.filter(d => d.type == "text") || [];

        localStorage.setItem(CUMULATIVE_DATA, JSON.stringify(cumulativeData));
        const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
        updateHrsForCards(contributionLanguage);
    })
}


function initializeBlock() {
    const $userName = $('#username');
    let top_lang = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (!top_lang) {
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
        sessionStorage.setItem("i18n", "en");
        updateHrsForCards(fromLanguage);
        showFunctionalCards('text', fromLanguage);
        redirectToLocalisedPage();
        getStatsSummary();
        const chartRadio = document.querySelector(
            'input[name = "topLanguageChart"][value="hours"]'
        );
        if (chartRadio) {
            chartRadio.checked = true;
        } 
    });

    $('#left').on('click', () => {
        localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
        localStorage.setItem("selectedType", "contribute");
        if (!hasUserRegistered()) {
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html', MODULE.bolo.value);
        } else {
            location.href = './record.html';
        }
    });

    $('#right').on('click', () => {
        localStorage.setItem(CONTRIBUTION_LANGUAGE, top_lang);
        localStorage.setItem("selectedType", "validate");
        if (!hasUserRegistered()) {
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./validator-page.html', MODULE.bolo.value);
        } else {
            location.href = './validator-page.html';
        }
    });

    $('[name="topLanguageChart"]').on('change', (event) => {
        if (event.target.value === 'hours') {
            showByHoursChart();
        } else {
            showBySpeakersChart();
        }
    });
    const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    showFunctionalCards('text', language);
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();

    setUserModalOnShown($userName);
    $startRecordBtnTooltip.tooltip('disable');
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();
    onChangeUser('./home.html', MODULE.bolo.value);
    onOpenUserDropDown();
    if (hasUserRegistered()) {
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }

    updateGoalProgressBarFromJson(MODULE.bolo['api-type']);
    getStatsSummary();
}

$(document).ready(function () {
    localStorage.setItem('module', 'bolo');
    clearLocalStorage();
    onActiveNavbar('bolo');
    getLocaleString().then(() => {
        initializeBlock();
    }).catch(err => {
        console.log(err);
        initializeBlock();
    });
});

module.exports = {
    getStatsSummary
};
