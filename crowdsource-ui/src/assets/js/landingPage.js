const { onActiveNavbar, onChangeUser, showUserProfile } = require('./header');
const { redirectToLocalisedPage, changeLocale} = require('./locale');
const { hasUserRegistered} = require('./common');
const { SPEAKER_DETAILS_KEY} = require('./constants');

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
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./home.html','home');
});