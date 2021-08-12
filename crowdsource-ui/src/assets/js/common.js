const {
    CONTRIBUTION_LANGUAGE, CURRENT_MODULE,SPEAKER_DETAILS_KEY, ErrorStatusCode
  } = require('./constants');
const { translate } = require('./utils');

const getContributedAndTopLanguage = (topLanguagesData, type) => {
  if(topLanguagesData  && topLanguagesData.length) {
    topLanguagesData = type == "speakers" ?  topLanguagesData.sort((a, b) => Number(a.total_speakers) > Number(b.total_speakers) ? -1 : 1) : topLanguagesData.sort((a, b) => Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1);
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    let topLanguages = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language == contributedLanguage);
    if (contributedLanguageHours && contributedLanguageHours.language != topLanguagesData[0].language) {
      contributedLanguageHours ? topLanguageArray.push(contributedLanguageHours) : type == "speakers" ? topLanguageArray.push({ language: contributedLanguage, total_speakers: "0" }): topLanguageArray.push({ language: contributedLanguage, total_contributions: "0.000" });
      let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
      remainingLanguage = type == "speakers" ?  remainingLanguage.sort((a, b) => Number(a.total_speakers) > Number(b.total_speakers) ? -1 : 1) : remainingLanguage.sort((a, b) => Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1);
      topLanguages = remainingLanguage.slice(0, 3);
    } else {
      if( contributedLanguage != topLanguagesData[0].language) {
        type == "speakers" ? topLanguageArray.push({ language: contributedLanguage,  total_speakers: "0" }) :  topLanguageArray.push({ language: contributedLanguage,  total_contributions: "0.000" });
      }
      topLanguages =type == "speakers" ?  topLanguagesResult.sort((a, b) => Number(a.total_speakers) > Number(b.total_speakers) ? -1 : 1).slice(0, 3) : topLanguagesResult.sort((a, b) => Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1).slice(0, 3);
    }
    return topLanguageArray.concat(topLanguages);
  }
  else {
    return [];
  }
}

function onActiveNavbar(value) {
  const $header = $('#module_name');
  localStorage.setItem(CURRENT_MODULE, value);
  const allDivs = $header.children();
  let targetedDivIndex = -1;
  allDivs.each(function (index, element) {
    if (element.getAttribute('value') === value) {
      targetedDivIndex = index;
    }
  });
  const previousActiveDiv = $header.find('.active');
  previousActiveDiv && previousActiveDiv.removeClass('active');
  allDivs[targetedDivIndex].classList.add('active');
}

const isMobileDevice = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true
  } else {
    // false for not mobile device
    return false;
  }
}

const showErrorPopup = () => {
  const $errorDialog = $('#errorPopup');
  $errorDialog.modal('show');
}

const hasUserRegistered = function (){
  const userDetail = localStorage.getItem(SPEAKER_DETAILS_KEY);
  const parsedUserDetails = JSON.parse(userDetail);
  return parsedUserDetails ? true : false;
}

const safeErrorHandling = (data) => {
  if (data && !data.ok)  {
    bindErrorText(data);
    showErrorPopup();
  }
  return data;
}

const bindErrorText = (data) => {
  const $errorText = $("#error-text");
  $errorText.text("");
  $errorText.text(data.status === ErrorStatusCode.SERVICE_UNAVAILABLE? translate("We are processing multiple requests at the moment. Please try again after sometime.") 
  : translate("An unexpected error has occurred."));
}

const safeJqueryErrorHandling = (e) => {
  if (e && e.statusText !== "error") {
    const $errorText = $("#error-text");
    $errorText.text("");
    $errorText.text(translate("An unexpected error has occurred."));
    showErrorPopup();
  }
}


module.exports =  {safeJqueryErrorHandling, showErrorPopup, safeErrorHandling, getContributedAndTopLanguage, onActiveNavbar, isMobileDevice,hasUserRegistered};