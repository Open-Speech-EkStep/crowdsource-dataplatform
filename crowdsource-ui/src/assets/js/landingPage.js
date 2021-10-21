const { onActiveNavbar, onChangeUser, showUserProfile, onOpenUserDropDown } = require('./header');
const { redirectToLocalisedPage, changeLocale } = require('./locale');
const { setDropdownValues } = require('../../../build/js/common/header');
const { setParticipationDataFromJson } = require('../../../build/js/common/contributionStats.js');
const { CONTRIBUTION_LANGUAGE, SPEAKER_DETAILS_KEY, DEFAULT_CON_LANGUAGE,CURRENT_MODULE } = require('./constants');
const { hasUserRegistered, safeJqueryErrorHandling } = require('./common');
const { json_url } = require('./env-api');

$(document).ready(function () {
  $.getJSON(`${json_url}/aggregated-json/participationStats.json`, (jsonData) => {
    setParticipationDataFromJson(jsonData);
  }).fail((e) => {
    safeJqueryErrorHandling(e);
  });

  localStorage.setItem(CURRENT_MODULE, 'home');

  if (!sessionStorage.getItem("i18n")) {
    localStorage.setItem(CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE);
    changeLocale("en");
    return;
  } else {
    redirectToLocalisedPage();
    setDropdownValues();
  }
  onActiveNavbar('home');
  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./home.html', 'home');
  onOpenUserDropDown();
});