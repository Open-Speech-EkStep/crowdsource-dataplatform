const { onActiveNavbar, onChangeUser, showUserProfile } = require('./header');
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
  const SPEAKER_DETAILS = "speakerDetails";
  const localSpeakerDataParsed = JSON.parse(
    localStorage.getItem(SPEAKER_DETAILS)
  );
  showUserProfile(localSpeakerDataParsed.userName);
});