const { updateLocaleLanguagesDropdown, getCookie } = require('./utils');
const {
  ALL_LANGUAGES,
  CONTRIBUTION_LANGUAGE,
  CURRENT_MODULE,
  MODULE,
  DEFAULT_CON_LANGUAGE,
} = require('./constants');
const { context_root } = require('./env-api');

const registerEvents = function () {
  const localisation_dropdown = $('#localisation_dropdown');
  const localisation_popup = $('#content-language a');
  localisation_popup.on('click', e => {
    const value = e.target.getAttribute('id');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, value);
    changeLocale('en');
  });
  localisation_dropdown.on('click', localisationChangeHandler);
};
const localisationChangeHandler = e => {
  const targetedLang = e.target;
  const locale = targetedLang.getAttribute('locale');
  const module = localStorage.getItem(CURRENT_MODULE);
  const splitValues = location.href.split('/');
  let currentPage = splitValues[splitValues.length - 1];
  const selectedLanguage = ALL_LANGUAGES.find(item => item.id == locale);
  if (module == 'home' && currentPage == 'home.html') {
    localStorage.setItem(
      CONTRIBUTION_LANGUAGE,
      selectedLanguage ? selectedLanguage.value : DEFAULT_CON_LANGUAGE
    );
  }
  if (locale) changeLocale(locale);
};

const changeLocale = function (locale) {
  const splitValues = location.href.split('/');
  let currentPage = splitValues[splitValues.length - 1];
  if (!currentPage) {
    currentPage = 'home.html';
  }
  const module = localStorage.getItem(CURRENT_MODULE);
  sessionStorage.setItem('i18n', locale);
  // if(module == 'bolo' && currentPage == "home.html"){
  //     location.href = `/${locale}/${MODULE[module].url}/${currentPage}`;
  // }
  // else
  if (module == 'home' || currentPage == 'badges.html' || currentPage == 'my-badges.html') {
    location.href = `${context_root}/${locale}/${currentPage}`;
  } else {
    location.href = `${context_root}/${locale}/${MODULE[module].url}/${currentPage}`;
  }
};

function checkCookie() {
  const locale = getCookie('i18n');
  return locale != '';
}
function showLanguagePopup() {
  document.getElementById('toggle-content-language').click();
}

function redirectToLocalisedPage() {
  const locale = sessionStorage.getItem('i18n');
  const allLocales = ALL_LANGUAGES.map(language => language.id);
  // const locale = localeValue == 'null'  || localeValue == undefined? 'en' : localeValue;
  const splitValues = location.href.split('/');
  const currentLocale = splitValues.filter(value => allLocales.includes(value))[0] || '';
  if (currentLocale != locale) {
    changeLocale(locale);
  } else {
    const language = ALL_LANGUAGES.find(ele => ele.id === locale);
    if (language) {
      updateLocaleLanguagesDropdown(language.value);
    }
  }
}

$(document).ready(function () {
  if (sessionStorage.getItem('i18n') == null) {
    const allLocales = ALL_LANGUAGES.map(language => language.id);
    const splitValues = location.href.split('/');
    const currentLocale = splitValues.filter(value => allLocales.includes(value))[0] || 'en';
    sessionStorage.setItem('i18n', currentLocale);
  }
  // $("#bhashadaan_logo").attr('href', base_url);
  registerEvents();
});

module.exports = {
  checkCookie,
  changeLocale,
  showLanguagePopup,
  redirectToLocalisedPage,
};
