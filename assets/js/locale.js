const { updateLocaleLanguagesDropdown, getCookie, setCookie } = require('./utils');
const { ALL_LANGUAGES } = require("./constants");

const registerEvents = function () {
    const localisation_dropdown = $('#localisation_dropdown');
    const localisation_popup = $('#content-language');
    localisation_popup.on("click", localisationChangeHandler);
    localisation_dropdown.on("click", localisationChangeHandler);
}
const localisationChangeHandler = e => {
    const targetedLang = e.target;
    const locale = targetedLang.getAttribute('locale');
    changeLocale(locale);
};
const changeLocale = function (locale) {
    let splitValues = location.href.split('/');
    let currentPage = splitValues[splitValues.length - 1];
    if (!currentPage) {
        currentPage = "home.html";
    }
    setCookie("i18n", locale, 1);
    location.href = `/${locale}/${currentPage}`;
}

function checkCookie() {
    var locale = getCookie("i18n");
    return locale != "";
}
function showLanguagePopup() {
    document.getElementById("toggle-content-language").click();
}
function redirectToLocalisedPage() {
    var locale = getCookie("i18n");
    let splitValues = location.href.split('/');
    let currentLocale = splitValues[splitValues.length - 2];
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