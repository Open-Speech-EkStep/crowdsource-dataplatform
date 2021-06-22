const { onActiveNavbar } = require('./header');
const { redirectToLocalisedPage, changeLocale, showLanguagePopup} = require('./locale');

$(document).ready(function () {
  localStorage.setItem('module','home');
  if (!localStorage.getItem("i18n")) {
    showLanguagePopup();
    return;
}
else {
    redirectToLocalisedPage();
}
  onActiveNavbar('home');
});