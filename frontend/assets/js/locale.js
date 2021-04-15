const { updateLocaleLanguagesDropdown, getCookie, setCookie } = require('./utils');
const { ALL_LANGUAGES } = require("./constants");

const registerEvents = function () {
    const localisation_dropdown = $('#localisation_dropdown');
    const localisation_popup = $('#content-language a');
    localisation_popup.on("click", localisationChangeHandler);
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
    location.href = `/${locale}/${currentPage}`;
}

function checkCookie() {
    const locale = getCookie("i18n");
    return locale != "";
}
function showLanguagePopup() {
    document.getElementById("toggle-content-language").click();
}
function redirectToLocalisedPage() {
    const locale = localStorage.getItem("i18n");
    const splitValues = location.href.split('/');
    const currentLocale = splitValues[splitValues.length - 2];
    $('#home-page').attr('default-lang', locale);
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