const { updateLocaleLanguagesDropdown, getCookie } = require('./utils');
const { ALL_LANGUAGES,CONTRIBUTION_LANGUAGE, CURRENT_MODULE, MODULE } = require("./constants");

const registerEvents = function () {
    const localisation_dropdown = $('#localisation_dropdown');
    const localisation_popup = $('#content-language a');
    localisation_popup.on("click", (e)=>{
        const value = e.target.getAttribute('id');
        localStorage.setItem(CONTRIBUTION_LANGUAGE,value);
        changeLocale('en');
    });
    localisation_dropdown.on("click", localisationChangeHandler);
}
const localisationChangeHandler = e => {
    const targetedLang = e.target;
    const locale = targetedLang.getAttribute('locale');
    if (locale)
        changeLocale(locale);
};
const changeLocale = function (locale) {
    const splitValues = location.href.split('/');
    let currentPage = splitValues[splitValues.length - 1];
    if (!currentPage) {
        currentPage = "home.html";
    }
    localStorage.setItem("i18n", locale);
    const module = localStorage.getItem(CURRENT_MODULE);
    if(module == 'home'){
        location.href = `/${locale}/${currentPage}`;
    }else if(module === 'bolo' && currentPage != 'home.html'){
        location.href = `/${locale}/${currentPage}`;
    } else {
        location.href = `/${locale}/${MODULE[module].url}/${currentPage}`;
    }
    // location.href = `/${locale}/${currentPage}`;
}

function checkCookie() {
    const locale = getCookie("i18n");
    return locale != "";
}
function showLanguagePopup() {
    document.getElementById("toggle-content-language").click();
}
function redirectToLocalisedPage() {
    const localeValue = localStorage.getItem("i18n") ;
    const locale = localeValue == 'null' || localeValue == undefined ? 'en' : localeValue;
    const splitValues = location.href.split('/');
    const currentModule = localStorage.getItem('module');
    console.log(currentModule)
    const currentLocale = currentModule == 'bolo' ?splitValues[3] : splitValues[splitValues.length - 2];
    const contribution_langugae = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    $('#home-page').attr('default-lang', contribution_langugae);
    if (currentLocale != locale) {
        changeLocale(locale);
    }
    else {
        const language = ALL_LANGUAGES.find(ele => ele.id === locale);
        if (language) {
            updateLocaleLanguagesDropdown(language.value);
        }
    }
}
$(document).ready(function () {
    registerEvents();
})

module.exports = {
    checkCookie,
    changeLocale,
    showLanguagePopup,
    redirectToLocalisedPage
};