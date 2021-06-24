const { onActiveNavbar, onChangeUser } = require('./header');
const { redirectToLocalisedPage, changeLocale} = require('./locale');

$(document).ready(function () {
  localStorage.setItem('module','home');
  if (!localStorage.getItem("i18n")) {
    changeLocale("en");
    return;
}
else {
    redirectToLocalisedPage();
}
  onActiveNavbar('home');
  onChangeUser('./home.html','home');
});