const { showLanguagePopup, redirectToLocalisedPage } = require('./locale');
const { onActiveNavbar, onChangeUser, showUserProfile,onOpenUserDropDown } = require('./header');
const {whitelisting_email} = require('./env-api')
const { drawMap, getStatistics, showByHoursChart, showBySpeakersChart } = require('./home-page-charts');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, getLocaleString, performAPIRequest, calculateTime, formatTime } = require('./utils')
const {
    setSpeakerDetails,
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick,
} = require('./speakerDetails');

const {
    setBoloSpeakerDetails,
    setBoloUserModalOnShown,
    setBoloUserNameOnInputFocus,
    setLetGoBtnOnClick
} = require('./bolo_user_details');
const { getContributedAndTopLanguage,hasUserRegistered } = require('./common');
// const { hasUserRegistered } = require('../../../build/js/common/common');
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
const SPEAKER_DETAILS = "speakerDetails";
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

    let hrsRecordedIn = localeStrings['hrs recorded in'];
    hrsRecordedIn = hrsRecordedIn.replace("%hours", formatTime(cHours, cMinutes, cSeconds));
    hrsRecordedIn = hrsRecordedIn.replace("%language", language);
    $say_p_3.text(hrsRecordedIn);

    let hrsValidatedIn = localeStrings['hrs validated in'];
    hrsValidatedIn = hrsValidatedIn.replace("%hours", formatTime(vHours, vMinutes, vSeconds));
    hrsValidatedIn = hrsValidatedIn.replace("%language", language);
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

const getDefaultTargetedDiv = function (key, value, $sayListenLanguage) {
    let targetIndex = 0;
    const $sayListenLanguageItems = $sayListenLanguage.children();
    $sayListenLanguageItems.each(function (index, element) {
        if (element.getAttribute('value') === DEFAULT_CON_LANGUAGE) {
            targetIndex = index;
        }
    });
    $sayListenLanguageItems.each(function (index, element) {
        if (element.getAttribute(key) === value) {
            targetIndex = index;
        }
    });

    return $sayListenLanguageItems[targetIndex];
}

const setLangNavBar = (targetedDiv, top_lang, $languageNavBar) => {
    const allDivs = $languageNavBar.children();
    let targetedDivIndex = -1
    allDivs.each(function (index, element) {
        if (element.getAttribute('value') === top_lang) {
            targetedDivIndex = index;
        }
    });

    const previousActiveDiv = $languageNavBar.find('.active');
    previousActiveDiv.removeClass('active');
    const $6th_place = document.getElementById('6th_option');
    const lang = ALL_LANGUAGES.find(ele => ele.value === top_lang);
    $6th_place.innerText = lang.text;
    if (targetedDivIndex < 0) {
        $6th_place.classList.remove('d-none');
        $6th_place.classList.add('active');
        $6th_place.setAttribute('value', top_lang);
    } else {
        allDivs[targetedDivIndex].classList.add('active');
        $6th_place.classList.remove('active');
        $6th_place.classList.add('d-none');
    }
}

const getDefaultLang = function () {
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const $sayListenLanguage = $('#say-listen-language');

    if (!contributionLanguage) {
        const $homePage = document.getElementById('home-page');
        const defaultLangId = $homePage.getAttribute('default-lang');
        const targetedDiv = getDefaultTargetedDiv('id', defaultLangId, $sayListenLanguage);
        const language = targetedDiv.getAttribute("value");
        localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
        return language;
    }
    return contributionLanguage;
}

const setDefaultLang = function () {
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const $sayListenLanguage = $('#say-listen-language');
    const $languageNavBar = $('#language-nav-bar')
    const $navBarLoader = $('#nav-bar-loader');
    $navBarLoader.addClass('d-none');
    $languageNavBar.removeClass('d-none');

    if (!contributionLanguage) {
        const $homePage = document.getElementById('home-page');
        const defaultLangId = $homePage.getAttribute('default-lang');
        const targetedDiv = getDefaultTargetedDiv('id', defaultLangId, $sayListenLanguage);
        const language = targetedDiv.getAttribute("value");
        localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
        updateHrsForSayAndListen(language);
        setLangNavBar(targetedDiv, language, $languageNavBar);
        return;
    }
    const targetedDiv = getDefaultTargetedDiv('value', contributionLanguage, $sayListenLanguage);
    updateHrsForSayAndListen(contributionLanguage);
    setLangNavBar(targetedDiv, contributionLanguage, $languageNavBar);
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
            // drawMap({data: response.aggregate_data_by_state});
            const languages = getContributedAndTopLanguage(response.top_languages_by_hours, MODULE.bolo.value);
            localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(languages));
            showByHoursChart()
            const speakers = getContributedAndTopLanguage(response.top_languages_by_speakers, "speakers");
            localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(speakers));
            localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
            getStatistics(response && response.aggregate_data_count && response.aggregate_data_count.length ? response.aggregate_data_count[0] : {});
            setDefaultLang();
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

const setSayListenBackground = function () {
    const $say = $("#say");
    const $listen = $("#listen");
    const $sayWidth = $say.outerWidth(true);
    const $listenWidth = $listen.outerWidth(true);
    const totalWidth = $sayWidth + $listenWidth;
    $say.css("background-size", `${totalWidth}px auto`);
    $listen.css("background-size", `${totalWidth}px auto`);
}


function initializeBlock() {
    const speakerDetailsKey = 'speakerDetails';
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    const $boloUserName = $('#bolo-username');
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;

    setSayListenBackground();
    let top_lang = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if(!top_lang){
        localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
        top_lang = DEFAULT_CON_LANGUAGE;
    }
    const $languageNavBar = $('#language-nav-bar');
    const $sayListenLanguage = $('#say-listen-language');

    $sayListenLanguage.on('click', (e) => {
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute("value");
        if (top_lang !== language) {
            top_lang = language;
            localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
            localStorage.setItem("i18n", "en");
            window.location.href = "./home.html";
            setLangNavBar(targetedDiv, language, $languageNavBar);
            updateHrsForSayAndListen(language);
        }
    })

    $languageNavBar.on('click', (e) => {
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute('value');
        if (top_lang !== language) {
            localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
            top_lang = language;
            const $6th_place = $('#6th_option')
            const previousActiveDiv = $languageNavBar.find('.active') || $6th_place;
            previousActiveDiv.removeClass('active');
            $6th_place.addClass('d-none');
            targetedDiv.classList.add('active');
            updateHrsForSayAndListen(language);
            localStorage.setItem("i18n", "en");
            window.location.href = "./home.html";
        }
    });

    $('#start_recording').on('click', () => {
        sentenceLanguage = top_lang;
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
        sentenceLanguage = top_lang;
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
    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();
    onChangeUser('./home.html',MODULE.bolo.value);
    onOpenUserDropDown();
    if(hasUserRegistered()){
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }

    // setBoloUserModalOnShown($boloUserName);
    // setBoloSpeakerDetails(speakerDetailsKey, $boloUserName);
    // setBoloUserNameOnInputFocus();

    const $say = $('#say');
    const $listen = $('#listen');
    const $listen_p_2 = $('#listen-p-2');
    const $say_p_2 = $('#say-p-2');
    const $say_container = $('#say_container');
    const $listen_container = $('#listen_container');
    $say.hover(() => {
        $(".card1").css("box-shadow", "0px 0px 32px rgba(66, 178, 198, 0.6)")
        $say_p_2.removeClass('d-none');
        $say_container.addClass('say-active');
    }, () => {
        $(".card1").css("box-shadow", "0px 0px 32px rgb(0 0 0 / 10%)")
        $say_p_2.addClass('d-none');
        $say_container.removeClass('say-active');
    });

    $listen.hover(() => {
        $(".card2").css("box-shadow", "0px 0px 32px rgba(166, 192, 251, 0.6)")
        $listen_p_2.removeClass('d-none');
        $listen_container.addClass('listen-active');
    }, () => {
        $(".card2").css("box-shadow", "0px 0px 32px rgb(0 0 0 / 10%)")
        $listen_p_2.addClass('d-none');
        $listen_container.removeClass('listen-active');
    });

    getStatsSummary();

}

toggleFooterPosition();

const renderCoachMarks = function () {
    const localString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    const step1 = 'You can select the language in which you want to participate';
    const step2 = 'You can change the language in which you want to read content';
    const step3 = 'Click on the card to start contributing your voice';
    const step4 = 'Click on the card to validate what others have spoken';
    const tourSteps = [
        {
            element: '#contribution_lang_navbar',
            title: '',
            preventInteraction: true,
            placement: "bottom",
            content: localString[step1]
        },
        {
            element: '#locale_language_dropdown',
            title: '',
            preventInteraction: true,
            placement: "bottom",
            content: localString[step2]
        },
        {
            element: '#say',
            title: '',
            preventInteraction: true,
            placement: "bottom",
            content: localString[step3]
        },
        {
            element: '#listen',
            title: '',
            preventInteraction: true,
            placement: "bottom",
            content: localString[step4]
        }
    ];

    const homePageTour = new Tour({
        steps: tourSteps,
        framework: "bootstrap4",
        backdrop: true,
        localization: {
            buttonTexts: {
                nextButton: localString.Next,
                prevButton: localString.Back,
                endTourButton: localString.SKIP,
            },
        }
    });

    // homePageTour.start();
};

$(document).ready(function () {
    localStorage.setItem('module', 'bolo');
    clearLocalStorage();
    onActiveNavbar('bolo');
    getLocaleString().then(() => {
        initializeBlock();
        // renderCoachMarks();
    }).catch(err => {
        initializeBlock();
    });
    if (whitelisting_email==='true') {
        document.getElementById("bolo-username").maxLength = 100;
    } else {
        document.getElementById("bolo-username").maxLength = 12;
    }
});

$(window).on("orientationchange", function () {
    setSayListenBackground();
});


module.exports = {
    updateHrsForSayAndListen,
    getDefaultTargetedDiv,
    setLangNavBar,
    getStatsSummary
};
