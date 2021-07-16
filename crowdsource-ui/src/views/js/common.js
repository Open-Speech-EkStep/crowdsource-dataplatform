const {
  CONTRIBUTION_LANGUAGE, TOP_LANGUAGES_BY_HOURS, LIKHO_TO_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE,SPEAKER_DETAILS_KEY,DEFAULT_CON_LANGUAGE
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

function showByHoursChart(type, page) {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type,"", page)
}

function showByHoursChartThankyouPage(type) {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  constructChart(
    JSON.parse(topLanguagesByHoursData),
    type == "suno" || type == "bolo" ? "total_contributions" : "total_contribution_count",
    "language",
    type
  );
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
  $("#user-contribution").text(data.contributionCount);
  $("#language-hour-goal").text(languageGoal);
  const topLanguages = JSON.parse(localStorage.getItem(TOP_LANGUAGES_BY_HOURS));
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const isInTopLanguage = topLanguages.some((ele) => ele.language.toLowerCase() === contributionLanguage.toLowerCase())

  const module = localStorage.getItem(CURRENT_MODULE);

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

  $("#sentense_away_count").text(Number(data.nextMilestone) - Number(data.contributionCount));
  $("#next_badge_name").text(localeStrings[data.nextBadgeType.toLowerCase()]);

  if (data.isNewBadge) {
    $(".new-badge-msg").removeClass("d-none");
    $(".thankyou-page-heading").addClass("d-none");
    $(".user-contribution-msg").addClass("d-none");

    // const cardWithoutBadge = $('#cardWithoutBadge');
    // $(cardWithoutBadge.parent()).remove(cardWithoutBadge);
    // $("#chartRowWithoutCard").html(cardWithoutBadge);
    const activeBadgeId = `#${data.currentBadgeType.toLowerCase()}_badge_link`;
    const activeBadge = $(activeBadgeId);
    activeBadge.attr("disabled", false);
    $(".downloadable_badges").append(activeBadge);
    const nextBadgeLink = $(`#${data.nextBadgeType.toLowerCase()}_badge_link_img`);
    nextBadgeLink.addClass('enable');
    nextBadgeLink.removeClass('disable');

    // $("#milestone_text").removeClass("d-none");
    $("#current_badge_name").text(localeStrings[data.currentBadgeType.toLowerCase()]);
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
    // $("#user-contribution-msg").removeClass("d-none");
  } else {
    $(".new-badge-msg").addClass("d-none");
    $(".thankyou-page-heading").addClass('d-none');
    $(".user-contribution-msg").removeClass("d-none");
    $("#spree_text").removeClass("d-none");
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
    $bronzeBadge.attr("disabled", false);
    $(".downloadable_badges").append($bronzeBadge);

    $silverBadgeLink.addClass('enable');
    $silverBadgeLink.removeClass('disable');
    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "silver") {
    $bronzeBadge.attr("disabled", false);
    $silverBadge.attr("disabled", false);
    $(".downloadable_badges").append($bronzeBadge);
    $(".downloadable_badges").append($silverBadge);

    $bronzeBadgeLink.addClass('enable');
    $bronzeBadgeLink.removeClass('disable');
    $silverBadgeLink.addClass('enable');
    $silverBadgeLink.removeClass('disable');
    $goldBadgeLink.removeClass('disable');
    $goldBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "gold") {
    $bronzeBadge.attr("disabled", false);
    $silverBadge.attr("disabled", false);
    $goldBadge.attr("disabled", false);
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
    $platinumBadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "platinum") {
    $bronzeBadge.attr("disabled", false);
    $silverBadge.attr("disabled", false);
    $goldBadge.attr("disabled", false);
    $platinumBadge.attr("disabled", false);
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
    const maxValue = data.goal;
    const currentValue = data['current-progress']
    $("#totalSentencesLbl").html(maxValue);
    $("#currentSentenceLbl").html(currentValue);
    const average = Math.round((currentValue/maxValue) * 100);
    $("#currentAverage").html(average+"%");
    const $progressBar = $("#progress_bar");
    $progressBar.width(average + '%');
  })
}

const replaceSubStr = function (element , to ,from){
  const originalText = element.text();
  const newText = originalText.replace(to, from);
  element.html(newText);
}

module.exports = { isMobileDevice, setLocalisationAndProfile, getContributedAndTopLanguage, updateLikhoLocaleLanguagesDropdown, updateLocaleLanguagesDropdown, getLanguageTargetInfo, showByHoursChartThankyouPage, showByHoursChart, redirectToLocalisedPage, setBadge, showFucntionalCards, getAvailableLanguages, isKeyboardExtensionPresent, enableCancelButton, disableCancelButton,landToHome,showOrHideExtensionCloseBtn,hasUserRegistered,updateProgressBar: updateGoalProgressBar,replaceSubStr };
