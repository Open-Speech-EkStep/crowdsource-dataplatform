const {drawMap, getStatistics, showByHoursChart, showBySpeakersChart} = require('./home-page-charts');
const {toggleFooterPosition, updateLocaleLanguagesDropdown} = require('./utils')
const {
    validateUserName,
    testUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent
} = require('./speakerDetails');

const {DEFAULT_CON_LANGUAGE} = require('./constants');

const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_LANGUAGE =  "aggregateDataCountByLanguage";
const LOCALE_STRINGS = 'localeString';
const ALL_LANGUAGES = [
    {value: "Assamese",id: "as", text: "অসমীয়া", hasLocaleText: true},
    {value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: true},
    {value: "English", id: "en", text: "English", hasLocaleText: true},
    {value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: true},
    {value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true},
    {value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: true},
    {value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: true},
    {value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: true},
    {value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: true},
    {value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: true},
    {value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: false},
    {value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: true}];

const performAPIRequest = (url) => {
    return fetch(url).then((data) => {
        if(!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
}

const updateLocaleText = function (total_contributions, total_validations, language) {
    const $say_p_3 = $("#say-p-3");
    const $listen_p_3 = $("#listen-p-3");
    const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    let hrsRecordedIn = localeStrings['hrs recorded in'];
    hrsRecordedIn = hrsRecordedIn.replace("%hours", total_contributions);
    hrsRecordedIn = hrsRecordedIn.replace("%language", language);
    $say_p_3.text(hrsRecordedIn);
    
    let hrsValidatedIn = localeStrings['hrs validated in'];
    hrsValidatedIn = hrsValidatedIn.replace("%hours", total_validations);
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

const getDefaultTargettedDiv = function (key, value, $sayListenLanguage) {
    let targetIndex = 0;
    const  $sayListenLanguageItems = $sayListenLanguage.children();
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

const setLangNavBar = (targetedDiv,top_lang, $languageNavBar) => {
    const allDivs = $languageNavBar.children();
    let targetttedDivIndex = -1
    allDivs.each(function (index, element) {
        if (element.getAttribute('value') === top_lang) {
            targetttedDivIndex = index;
        }
    });

    const previousActiveDiv = $languageNavBar.find('.active');
    previousActiveDiv.removeClass('active');
    const $6th_place = document.getElementById('6th_option');
    const lang = ALL_LANGUAGES.find(ele => ele.value === top_lang);
    $6th_place.innerText = lang.text;
    if (targetttedDivIndex < 0) {
        $6th_place.classList.remove('d-none');
        $6th_place.classList.add('active');
        $6th_place.setAttribute('value', top_lang);
    } else {
        allDivs[targetttedDivIndex].classList.add('active');
        $6th_place.classList.remove('active');
        $6th_place.classList.add('d-none');
    }
}

const setLanguagesInHeader = function() {
    const $languageNavBar= $('#language-nav-bar');
    const $navBarLoader = $('#nav-bar-loader');
    const languages = [
        {value: "Hindi", id: "hi", text: "हिंदी"},
        {value: "Marathi", id: "mr", text: "मराठी"},
        {value: "Bengali", id: "bn", text: "বাংলা"},
        {value: "Tamil", id: "ta", text: "தமிழ்"},
        {value: "Telugu", id: "te", text: "తెలుగు"}
    ]
    languages.forEach((element,index)=>{
        $languageNavBar.append(`<li class="nav-item px-lg-4 px-md-4 px-2 options" value=${element.value}>${element.text}</li>`);
    });

    $navBarLoader.addClass('d-none');
    $languageNavBar.removeClass('d-none');
    setDefaultLang();
}

const setDefaultLang = function (){
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    const $sayListenLanguage = $('#say-listen-language');
    const  $languageNavBar = $('#language-nav-bar')
    if(!contributionLanguage){
        const $homePage = document.getElementById('home-page');
        const defaultLangId = $homePage.getAttribute('default-lang');
        const targettedDiv = getDefaultTargettedDiv('id',defaultLangId, $sayListenLanguage);
        const language = targettedDiv.getAttribute("value");
        localStorage.setItem('contributionLanguage', language);
        updateHrsForSayAndListen(language);
        setLangNavBar(targettedDiv, language, $languageNavBar);
        return;
    }
    const targettedDiv = getDefaultTargettedDiv('value',contributionLanguage, $sayListenLanguage);
    updateHrsForSayAndListen(contributionLanguage);
    setLangNavBar(targettedDiv, contributionLanguage, $languageNavBar);
}

const clearLocalStroage = function() {
    localStorage.removeItem(TOP_LANGUAGES_BY_HOURS);
    localStorage.removeItem(TOP_LANGUAGES_BY_SPEAKERS);
    localStorage.removeItem(AGGREGATED_DATA_BY_LANGUAGE);
    localStorage.removeItem(LOCALE_STRINGS);
}

const getStatsSummary = function () {
    performAPIRequest('/stats/summary')
    .then(response => {
        drawMap({data: response.aggregate_data_by_state});
        localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(response.top_languages_by_hours));
        showByHoursChart();
        localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response.top_languages_by_speakers));
        localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(response.aggregate_data_by_language));
        setLanguagesInHeader();
        getStatistics(response.aggregate_data_count[0]);
    });
}

const getLocaleString = function() {
    performAPIRequest('/get-locale-strings')
        .then((response) => {
            localStorage.setItem(LOCALE_STRINGS, JSON.stringify(response));
        });
}

$(document).ready(function () {
    clearLocalStroage();
    getLocaleString();
    const speakerDetailsKey = 'speakerDetails';
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    const $userNameError = $userName.next();
    const $tncCheckbox = $('#tnc');
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;

    $tncCheckbox.prop('checked', false);

    toggleFooterPosition();

    $startRecordBtnTooltip.tooltip({
        container: 'body',
        placement: screen.availWidth > 500 ? 'right' : 'auto',
    });
    let top_lang = localStorage.getItem('contributionLanguage');
    const $languageNavBar = $('#language-nav-bar');
    const $sayListenLanguage = $('#say-listen-language');

    $sayListenLanguage.on('click',(e)=>{
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute("value");
        if(top_lang !== language) {
            top_lang = language;
            localStorage.setItem('contributionLanguage',language);
            document.cookie = `i18n=en`;
            window.location.href = "/";
            setLangNavBar(targetedDiv, language, $languageNavBar);
            updateHrsForSayAndListen(language);
        }
    })

    $languageNavBar.on('click', (e) => {
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute('value');
        if(top_lang !== language) {
            localStorage.setItem('contributionLanguage',language);
            top_lang = language;
            const $6th_place = $('#6th_option')
            const previousActiveDiv = $languageNavBar.find('.active') || $6th_place;
            previousActiveDiv.removeClass('active');
            $6th_place.addClass('d-none');
            targetedDiv.classList.add('active');
            updateHrsForSayAndListen(language);
            document.cookie = `i18n=en`;
            window.location.href = "/";
        }
    });

    $('#start_recording').on('click', () => {
        sentenceLanguage = top_lang;
    });

    $('[name="topLanguageChart"]').on('change', (event) => {
        if(event.target.value === 'hours') {
            showByHoursChart();
        } else {
            showBySpeakersChart();
        }
    });

    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);

    genderRadios.forEach((element) => {
        element.addEventListener('click', (e) => {
            if (e.target.previous) {
                e.target.checked = false;
            }
            e.target.previous = e.target.checked;
        });
    });

    setStartRecordBtnToolTipContent($userName.val().trim(), $startRecordBtnTooltip);
    $tncCheckbox.change(function () {
        const userNameValue = $userName.val().trim();
        if (this.checked && !testUserName(userNameValue)) {
            $startRecordBtn.removeAttr('disabled').removeClass('point-none');
            $startRecordBtnTooltip.tooltip('disable');
        } else {
            setStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
            $startRecordBtn.prop('disabled', 'true').addClass('point-none');
            $startRecordBtnTooltip.tooltip('enable');
        }
    });

    $userName.on('input focus', () => {
        validateUserName($userName, $userNameError, $tncCheckbox);
        setUserNameTooltip($userName);
    });

    $startRecordBtn.on('click', () => {
        if ($tncCheckbox.prop('checked')) {
            const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
            const genderValue = checkedGender.length ? checkedGender[0].value : '';
            const userNameValue = $userName.val().trim().substring(0, 12);
            if (sentenceLanguage === 'English') sentenceLanguage = DEFAULT_CON_LANGUAGE;
            if (testUserName(userNameValue)) {
                return;
            }
            const speakerDetails = {
                gender: genderValue,
                age: age.value,
                motherTongue: motherTongue.value,
                userName: userNameValue,
                language: sentenceLanguage,
            };
            localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
            location.href = '/record';
        }
    });

    $('#userModal').on('shown.bs.modal', function () {
        $('#resetBtn').on('click', resetSpeakerDetails);
        $userName.tooltip({
            container: 'body',
            placement: screen.availWidth > 500 ? 'right' : 'auto',
            trigger: 'focus',
        });
        setUserNameTooltip($userName);
    });
    const $say = $('#say');
    const $listen = $('#listen');
    const $listen_p_2 = $('#listen-p-2');
    const $say_p_2 = $('#say-p-2');
    const $say_container = $('#say_container');
    const $listen_container = $('#listen_container');
    $say.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $say.addClass('col-lg-6');
        $listen.addClass('col-lg-4');
        $say.removeClass('col-md-5');
        $listen.removeClass('col-md-5');
        $say.addClass('col-md-6');
        $listen.addClass('col-md-4');
        $say_p_2.removeClass('d-none');
        $say_container.addClass('say-active');
    }, () => {
        $say.removeClass('col-lg-6');
        $listen.removeClass('col-lg-4');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $say.removeClass('col-md-6');
        $listen.removeClass('col-md-4');
        $say.addClass('col-md-5');
        $listen.addClass('col-md-5');
        $say_p_2.addClass('d-none');
        $say_container.removeClass('say-active');
    });

    $listen.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $listen.addClass('col-lg-6');
        $say.addClass('col-lg-4');
        $listen_p_2.removeClass('d-none');
        $listen_container.addClass('listen-active');
    }, () => {
        $say.removeClass('col-lg-4');
        $listen.removeClass('col-lg-6');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $listen_p_2.addClass('d-none');
        $listen_container.removeClass('listen-active');
    });

    getStatsSummary();
});

module.exports = {
    performAPIRequest,
    updateHrsForSayAndListen,
    getDefaultTargettedDiv,
};
