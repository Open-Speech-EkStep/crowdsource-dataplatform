const {
  CONTRIBUTION_LANGUAGE, TOP_LANGUAGES_BY_HOURS, LIKHO_TO_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE,SPEAKER_DETAILS_KEY,DEFAULT_CON_LANGUAGE,AGGREGATED_DATA_BY_TOP_LANGUAGE
} = require('./constants');
const { drawTopLanguageChart } = require('./verticalGraph');
const { constructChart } = require('./horizontalBarGraph');
const { changeLocale,showLanguagePopup } = require('./locale');
const fetch = require('./fetch');
const {performAPIRequest} = require('./utils');
const {onChangeUser, onOpenUserDropDown, showUserProfile} = require('./header');
const { setUserModalOnShown,
  setUserNameOnInputFocus,
  setGenderRadioButtonOnClick}  = require("./speakerDetails");

const getContributedAndTopLanguage = (topLanguagesData, type) => {
  if(topLanguagesData  && topLanguagesData.length) {
    topLanguagesData = topLanguagesData.sort((a, b) => Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1)
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage = type == "likho" ? localStorage.getItem(CONTRIBUTION_LANGUAGE) + '-' + localStorage.getItem(LIKHO_TO_LANGUAGE) : localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    let topLanguages = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language == contributedLanguage);
    if (contributedLanguageHours && contributedLanguageHours.language != topLanguagesData[0].language) {
      topLanguageArray.push(contributedLanguageHours)
      let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
      remainingLanguage = type == "dekho" || type == "likho" ? remainingLanguage.sort((a, b) => Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1) : remainingLanguage.sort((a, b) => Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1);
      topLanguages = remainingLanguage.slice(0, 3);
    } else {
      if( contributedLanguage != topLanguagesData[0].language) {
        if(type == "suno" || type == "bolo") {
          topLanguageArray.push({ language: contributedLanguage,  total_contributions: "0.000" });
        } else {
          topLanguageArray.push({ language: contributedLanguage,  total_contribution_count: "0" });
        }
      }
      topLanguages = topLanguagesResult.sort((a, b) => Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1).slice(0, 3);
    }
    return topLanguageArray.concat(topLanguages).reverse();
  } else {
    return [];
  }
}

const getTopLanguage = (topLanguagesData, type, keyInSentence,keyInHrs) => {
  if(topLanguagesData  && topLanguagesData.length) {
    topLanguagesData = topLanguagesData.sort((a, b) => Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1)
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage = type == "likho" ? localStorage.getItem(CONTRIBUTION_LANGUAGE) + '-' + localStorage.getItem(LIKHO_TO_LANGUAGE) : localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    let topLanguages = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language == contributedLanguage);
    if (contributedLanguageHours && contributedLanguageHours.language != topLanguagesData[0].language) {
      topLanguageArray.push(contributedLanguageHours)
      let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
      remainingLanguage = type == "dekho" || type == "likho" ? remainingLanguage.sort((a, b) => Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1) : remainingLanguage.sort((a, b) => Number(a[keyInHrs]) > Number(b[keyInHrs]) ? -1 : 1);
      topLanguages = remainingLanguage.slice(0, 3);
    } else {
      if( contributedLanguage != topLanguagesData[0].language) {
        if(type == "suno" || type == "bolo") {
          topLanguageArray.push({ language: contributedLanguage,  [keyInHrs]: "0.000" });
        } else {
          topLanguageArray.push({ language: contributedLanguage,  [keyInSentence]: "0" });
        }
      }
      topLanguages = topLanguagesResult.sort((a, b) => Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1).slice(0, 3);
    }
    return topLanguageArray.concat(topLanguages).reverse();
  } else {
    return [];
  }
}

function showByHoursChart(type, page, dataType) {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type, dataType, page)
}

function showByHoursChartThankyouPage(type, page, dataType='') {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(AGGREGATED_DATA_BY_TOP_LANGUAGE);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type,dataType, page)

}

function redirectToLocalisedPage() {
  const locale = localStorage.getItem("i18n") ;
  const module = localStorage.getItem(CURRENT_MODULE);
  const allLocales = ALL_LANGUAGES.map(language => language.id);
  // const locale = localeValue == 'null'  || localeValue == undefined? 'en' : localeValue;
  const splitValues = location.href.split('/');
  const currentLocale = splitValues.filter(value => allLocales.includes(value))[0] || '';
  if (currentLocale != locale) {
    changeLocale(locale);
  }
  else {
    const language = ALL_LANGUAGES.find(ele => ele.id === locale);
    if (language && module != 'likho') {
      updateLocaleLanguagesDropdown(language.value);
    }
  }
}

const updateLocaleLanguagesDropdown = (language) => {
  const dropDown = $('#localisation_dropdown');
  language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
  const localeLang = ALL_LANGUAGES.find(ele => ele.value.toLowerCase() === language.toLowerCase());
  if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
    dropDown.html('<a id="english" class="dropdown-item" href="#" locale="en">English</a>');
  } else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }
}

const getAvailableLanguages = (type) => {
  return fetch(`/available-languages/${type}`).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
};

const getLanguageTargetInfo = (type, sourceLanguage, targetLanguage) => {
  return fetch(`/target-info/${type}/${sourceLanguage}?targetLanguage=${targetLanguage}`).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
};

const showFucntionalCards = (type, from, to) => {
  try {
    getLanguageTargetInfo(type, from, to).then(languagePairs => {
      const { hasTarget, isAllContributed } = languagePairs;
      let contributeCard = $("#left");
      let validateCard = $("#right");
      if (hasTarget && !isAllContributed) {
        contributeCard.removeClass("cont-validate-disabled");
        validateCard.removeClass("validate-disabled");
      } else if (hasTarget && isAllContributed) {
        validateCard.removeClass("validate-disabled");
        contributeCard.addClass("cont-validate-disabled");
      } else if (!hasTarget && !isAllContributed) {
        contributeCard.removeClass("cont-validate-disabled");
        validateCard.addClass("validate-disabled");
      } else {
        contributeCard.addClass("cont-validate-disabled");
        validateCard.addClass("validate-disabled");
      }
    });

  } catch (error) {
    console.log(error);
  }
}

const setBadge = function (data, localeStrings, functionalFlow) {
  localStorage.setItem('badgeId', data.badgeId);
  localStorage.setItem('badges', JSON.stringify(data.badges));
  const languageGoal = data.languageGoal || 0;
  localStorage.setItem('nextHourGoal', languageGoal);

  // replaceSubStr($(".user-contribution-msg"), '<contribution-count>', data.contributionCount );
  $("#language-hour-goal").text(languageGoal);
  $("#user-contribution-count").text(data.contributionCount);
  const topLanguages = JSON.parse(localStorage.getItem(AGGREGATED_DATA_BY_TOP_LANGUAGE)) || [];
  let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const module = localStorage.getItem(CURRENT_MODULE);

  if(module === 'likho'){
    const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
    const likhoPairLanguage = contributionLanguage + '-' + toLanguage;
    contributionLanguage = likhoPairLanguage
  }
  const isInTopLanguage = topLanguages.some((ele) => ele.language.toLowerCase() === contributionLanguage.toLowerCase());
  if(isInTopLanguage){
    $("#languageInTopWeb").removeClass("d-none");
    $("#languageInTopMob").removeClass("d-none");
    $("#languageNotInTopMob").addClass("d-none");
    $("#languageNotInTopWeb").addClass("d-none");
  }  else {
    $("#languageNotInTopMob").removeClass("d-none");
    $("#languageNotInTopWeb").removeClass("d-none");
    $("#languageInTopWeb").addClass("d-none");
    $("#languageInTopMob").addClass("d-none");
  }
  const nextBadgeName = localeStrings[data.nextBadgeType.toLowerCase()];
  $("#sentence-away-count").text(Number(data.nextMilestone) - Number(data.contributionCount))
  $("#sentence_away_badge").text(nextBadgeName.charAt(0).toUpperCase() + nextBadgeName.slice(1))

  // replaceSubStr($("#sentence_away_msg"), '<contribution-count>', Number(data.nextMilestone) - Number(data.contributionCount) );
  // replaceSubStr($("#sentence_away_msg"), '<badge-color>', nextBadgeName.charAt(0).toUpperCase() + nextBadgeName.slice(1) );
  if (data.isNewBadge) {
    $(".new-badge-msg").removeClass("d-none");
    $(".thankyou-page-heading").addClass("d-none");
    $(".user-contribution-msg").addClass("d-none");
    $(".downloadable_badges").addClass('mr-0 mr-lg-3 mr-md-2');
    // $("#language-goal").addClass('position-relative')

    const cardWithoutBadge = $('#cardWithoutBadge');
    cardWithoutBadge.remove();
    $("#chartRowWithoutCard").append(cardWithoutBadge);
    const $socialLink = $("#social-links");
    $(".download-row").append($socialLink);
    const activeBadgeId = `#${data.currentBadgeType.toLowerCase()}_badge_link`;
    const activeBadge = $(activeBadgeId);
    activeBadge.attr("disabled", false);
    $(".downloadable_badges").append(activeBadge);
    const nextBadgeLink = $(`#${data.nextBadgeType.toLowerCase()}_badge_link_img`);
    nextBadgeLink.removeClass('disable');


    $(".participation-msg-section").addClass('d-flex align-items-center');

    $("#milestone_text").removeClass("d-none");
    const currentBadgeName = localeStrings[data.currentBadgeType.toLowerCase()];
    $("#current_badge_name").text(currentBadgeName.charAt(0).toUpperCase() + currentBadgeName.slice(1));
    $("#current_badge_name_1").text(localeStrings[data.currentBadgeType.toLowerCase()]);
    $("#current_badge_count").text(data.currentMilestone);
    $("#next_badge_count").text(data.nextMilestone);
    $("#next_badge_name_1").text(localeStrings[data.nextBadgeType.toLowerCase()]);
    $("#next_badge_name").text(localeStrings[data.nextBadgeType.toLowerCase()]);
    $("#download_pdf").attr("data-badge", data.currentBadgeType.toLowerCase());
    if(module == 'bolo'){
      if(functionalFlow === 'validator'){
        $("#reward-img").attr('src', `/img/${data.currentBadgeType.toLowerCase()}_medal_val.svg`);
      } else {
        $("#reward-img").attr('src', `/img/${data.currentBadgeType.toLowerCase()}_medal.svg`);
      }
    } else {
      if(functionalFlow == 'validator'){
        $("#reward-img").attr('src', `/img/${module}_${data.currentBadgeType.toLowerCase()}_medal_val.svg`);
      } else {
        $("#reward-img").attr('src', `/img/${module}_${data.currentBadgeType.toLowerCase()}_medal.svg`);
      }
    }
  } else if (data.contributionCount === 0) {
    $(".new-badge-msg").addClass("d-none");
    $(".thankyou-page-heading").removeClass("d-none");
    $(".user-contribution-msg").addClass("d-none");
    $("#contribution_text").removeClass("d-none");
  } else {
    $(".new-badge-msg").addClass("d-none");
    $(".thankyou-page-heading").addClass('d-none');
    $(".user-contribution-msg").removeClass("d-none");
    $("#before_badge_content").removeClass("d-none");
    $("#user-contribution-msg").removeClass("d-none");
  }
  const $bronzeBadgeLink = $("#bronze_badge_link_img");
  const $bronzeBadge = $("#bronze_badge_link");
  const $silverBadgeLink = $("#silver_badge_link_img");
  const $silverBadge = $("#silver_badge_link");
  const $goldBadgeLink = $("#gold_badge_link_img");
  const $goldBadge = $("#gold_badge_link");
  const $platinumBadgeLink = $("#platinum_badge_link_img");
  const $platinumBadge = $("#platinum_badge_link");
  if (data.currentBadgeType.toLowerCase() == "bronze") {
    $(".downloadable_badges").addClass('mr-0 mr-lg-3 mr-md-2');
    $bronzeBadge.attr("disabled", false);
    $bronzeBadgeLink.attr("title", 'Download Bronze Badge');
    $(".downloadable_badges").append($bronzeBadge);

    $silverBadgeLink.removeClass('disable');
    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "silver") {
    $(".downloadable_badges").addClass('mr-0 mr-lg-3 mr-md-2');
    $bronzeBadge.attr("disabled", false);
    $bronzeBadgeLink.attr("title", 'Download Bronze Badge');
    $silverBadge.attr("disabled", false);
    $silverBadgeLink.attr("title", 'Download Silver Badge');
    $(".downloadable_badges").append($bronzeBadge);
    $(".downloadable_badges").append($silverBadge);

    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
    $silverBadgeLink.addClass('enable');
    $silverBadgeLink.removeClass('disable');
    $goldBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "gold") {
    $(".downloadable_badges").addClass('mr-0 mr-lg-3 mr-md-2');
    $bronzeBadge.attr("disabled", false);
    $silverBadge.attr("disabled", false);
    $goldBadge.attr("disabled", false);
    $bronzeBadgeLink.attr("title", 'Download Bronze Badge');
    $silverBadgeLink.attr("title", 'Download Silver Badge');
    $goldBadgeLink.attr("title", 'Download Gold Badge');
    $(".downloadable_badges").append($bronzeBadge);
    $(".downloadable_badges").append($silverBadge);
    $(".downloadable_badges").append($goldBadge);

    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
    $silverBadgeLink.addClass('enable');
    $silverBadgeLink.removeClass('disable');
    $goldBadgeLink.addClass('enable');
    $goldBadgeLink.removeClass('disable');
    $platinumBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "platinum") {
    $(".downloadable_badges").addClass('mr-0 mr-lg-3 mr-md-2');
    $bronzeBadge.attr("disabled", false);
    $silverBadge.attr("disabled", false);
    $goldBadge.attr("disabled", false);
    $platinumBadge.attr("disabled", false);
    $platinumBadgeLink.attr("title", 'Download Platinum Badge');
    $goldBadgeLink.attr("title", 'Download Gold Badge');
    $bronzeBadgeLink.attr("title", 'Download Bronze Badge');
    $silverBadgeLink.attr("title", 'Download Silver Badge');
    $(".downloadable_badges").append($bronzeBadge);
    $(".downloadable_badges").append($silverBadge);
    $(".downloadable_badges").append($goldBadge);
    $(".downloadable_badges").append($platinumBadge);

    $('#next-goal').addClass('d-none');
    $('#before_badge_content').removeClass('d-none');
    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
    $silverBadgeLink.addClass('enable');
    $silverBadgeLink.removeClass('disable');
    $goldBadgeLink.addClass('enable');
    $goldBadgeLink.removeClass('disable');
    $platinumBadgeLink.addClass('enable');
    $platinumBadgeLink.removeClass('disable');
  }
}

const isKeyboardExtensionPresent = function () {
  const chromeExtension = document.getElementById('GOOGLE_INPUT_CHEXT_FLAG');
  return chromeExtension ? true : false
}

const enableCancelButton = function () {
  const $cancelEditButton = $("#cancel-edit-button");
  $cancelEditButton.removeAttr('disabled');
}

const disableCancelButton = function () {
  const $cancelEditButton = $("#cancel-edit-button");
  $cancelEditButton.attr('disabled', true);
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

const landToHome = function (){
  if (!localStorage.getItem(CONTRIBUTION_LANGUAGE)){
    showLanguagePopup();
    return;
  }
  else {
    redirectToLocalisedPage();
  }
}

const hasUserRegistered = function (){
  const userDetail = localStorage.getItem(SPEAKER_DETAILS_KEY);
  const parsedUserDetails = userDetail ? JSON.parse(userDetail) : false;
  return parsedUserDetails ? true : false;
}

const showOrHideExtensionCloseBtn = function (){
  // console.log("here")

  // if(!isKeyboardExtensionPresent()){
  //   console.log("not present")
  //   $('#extension-bar-close-btn').addClass('d-none');
  // } else {
  //   console.log("present")
  //   $('#extension-bar-close-btn').removeClass('d-none');
  // }
}

const updateLikhoLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value == language);
  if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
    <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }
}

const setLocalisationAndProfile = (path, module) => {
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  const $userName = $('#username');
  onChangeUser(path, module);
  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();
  onOpenUserDropDown();
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }

  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
}

const updateGoalProgressBar = function (url){
  return performAPIRequest(url).then(data=>{
    const maxValue = Number(data.goal);
    const currentValue =  Number(data['current-progress']);
    replaceSubStr($(".progress-metric"), "<contribution-done>", currentValue);
    replaceSubStr($(".progress-metric"), "<contribution-goal>", maxValue);
    const average = (currentValue/maxValue) * 100;
    const actualValue = average > 1 ? average.toFixed(2) : average.toFixed(3);
    $("#totalAverage").text(actualValue + '%');
    const $progressBar = $("#progress_bar");
    $progressBar.width(actualValue + '%');
  }).catch(e=>console.log)
}

const replaceSubStr = function (element , to ,from){
  const originalText = element.text();
  const newText = originalText.replace(to, from);
  element.text(newText.toString());
}

module.exports = { isMobileDevice, setLocalisationAndProfile, getContributedAndTopLanguage, updateLikhoLocaleLanguagesDropdown, updateLocaleLanguagesDropdown, getLanguageTargetInfo, showByHoursChartThankyouPage, showByHoursChart, redirectToLocalisedPage, setBadge, showFucntionalCards, getAvailableLanguages, isKeyboardExtensionPresent, enableCancelButton, disableCancelButton,landToHome,showOrHideExtensionCloseBtn,hasUserRegistered,updateGoalProgressBar,replaceSubStr,getTopLanguage };
