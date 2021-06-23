const { onActiveNavbar } = require('./header');
const { redirectToLocalisedPage, changeLocale} = require('./locale');
const { CONTRIBUTION_LANGUAGE } = require('./constants');

$(document).ready(function () {
  localStorage.setItem('module','home');
  if (!localStorage.getItem("i18n")) {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, "English");
    changeLocale("en");
    return;
}
else {
    redirectToLocalisedPage();
}
  onActiveNavbar('home');
});