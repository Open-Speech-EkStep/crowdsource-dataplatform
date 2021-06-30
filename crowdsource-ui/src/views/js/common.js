const {
  CONTRIBUTION_LANGUAGE, TOP_LANGUAGES_BY_HOURS,LIKHO_FROM_LANGUAGE, LIKHO_TO_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE,SPEAKER_DETAILS_KEY,DEFAULT_CON_LANGUAGE
} = require('./constants');
const { drawTopLanguageChart } = require('./verticalGraph');
const { constructChart } = require('./horizontalBarGraph');
const { changeLocale,showLanguagePopup } = require('./locale');
const fetch = require('./fetch');

const getContributedAndTopLanguage = (topLanguagesData, type) => {
  if(topLanguagesData  && topLanguagesData.length) {
    topLanguagesData = topLanguagesData.sort((a, b) => Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1)
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage = type == "likho" ? localStorage.getItem(LIKHO_FROM_LANGUAGE) + '-' + localStorage.getItem(LIKHO_TO_LANGUAGE) : localStorage.getItem(CONTRIBUTION_LANGUAGE);
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

function showByHoursChart(type) {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type)
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
  const allLocales = ALL_LANGUAGES.map(language => language.id);
  // const locale = localeValue == 'null'  || localeValue == undefined? 'en' : localeValue;
  const splitValues = location.href.split('/');
  const currentLocale = splitValues.filter(value => allLocales.includes(value))[0] || '';
  if (currentLocale != locale) {
    changeLocale(locale);
  }
  else {
    const language = ALL_LANGUAGES.find(ele => ele.id === locale);
    if (language) {
      updateLocaleLanguagesDropdown(language.value);
    }
  }
}

const updateLocaleLanguagesDropdown = (language) => {
  // const dropDown = $('#localisation_dropdown');
  // language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
  // const localeLang = ALL_LANGUAGES.find(ele => ele.value.toLowerCase() === language.toLowerCase());
  // if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
  //   dropDown.html('<a id="english" class="dropdown-item" href="#" locale="en">English</a>');
  // } else {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
  //     <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  // }
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

  const module = localStorage.getItem(CURRENT_MODULE);
  if (data.isNewBadge) {
    $("#spree_text").removeClass("d-none");
    $("#milestone_text").removeClass("d-none");
    $("#current_badge_name").text(localeStrings[data.currentBadgeType.toLowerCase()]);
    $("#current_badge_name_1").text(localeStrings[data.currentBadgeType.toLowerCase()]);
    $("#current_badge_count").text(data.currentMilestone);
    $("#next_badge_count").text(data.nextMilestone);
    $("#next_badge_name_1").text(localeStrings[data.nextBadgeType.toLowerCase()]);
    $("#sentence_away_msg").addClass("d-none");
    $("#user-contribution-msg").addClass("d-none");
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
  } else if (data.contributionCount < 5) {
    $("#champion_text").removeClass("d-none");
    $("#contribution_text").removeClass("d-none");
    $("#sentence_away_msg").removeClass("d-none");
    $("#user-contribution-msg").removeClass("d-none");
    $("#sentense_away_count").text(Number(data.nextMilestone) - Number(data.contributionCount));
    $("#next_badge_name").text(localeStrings[data.nextBadgeType.toLowerCase()]);
  } else if ((Number(data.contributionCount) >= Number(data.currentMilestone)) && (Number(data.contributionCount) <= Number(data.nextMilestone))) {
    $("#spree_text").removeClass("d-none");
    $("#before_badge_content").removeClass("d-none");
    $("#sentence_away_msg").removeClass("d-none");
    $("#user-contribution-msg").removeClass("d-none");
    $("#sentense_away_count").text(Number(data.nextMilestone) - Number(data.contributionCount));
    $("#next_badge_name").text(localeStrings[data.nextBadgeType.toLowerCase()]);
  }
  const $bronzeBadgeLink = $("#bronze_badge_link img");
  const $silverBadgeLink = $("#silver_badge_link img");
  const $goldBadgeLink = $("#gold_badge_link img");
  const $platinumBadgeLink = $("#platinum_badge_link img");
  if (data.currentBadgeType.toLowerCase() == "bronze") {
    $bronzeBadgeLink.parent().attr("disabled", false);
    $('#bronze_badge_link_img').addClass('enable');
    $('#bronze_badge_link_img').removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "silver") {
    $bronzeBadgeLink.parent().attr("disabled", false);
    $silverBadgeLink.parent().attr("disabled", false);
    $('#bronze_badge_link_img').addClass('enable');
    $('#bronze_badge_link_img').removeClass('disable');
    $('#silver_badge_link_img').addClass('enable');
    $('#silver_badge_link_img').removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "gold") {
    $bronzeBadgeLink.parent().attr("disabled", false);
    $silverBadgeLink.parent().attr("disabled", false);
    $goldBadgeLink.parent().attr("disabled", false);
    $('#bronze_badge_link_img').addClass('enable');
    $('#bronze_badge_link_img').removeClass('disable');
    $('#silver_badge_link_img').addClass('enable');
    $('#silver_badge_link_img').removeClass('disable');
    $('#gold_badge_link_img').addClass('enable');
    $('#gold_badge_link_img').removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === "platinum") {
    $bronzeBadgeLink.parent().attr("disabled", false);
    $silverBadgeLink.parent().attr("disabled", false);
    $goldBadgeLink.parent().attr("disabled", false);
    $platinumBadgeLink.parent().attr("disabled", false);
    $('#next-goal').addClass('d-none');
    $("#champion_text").removeClass("d-none");
    $('#before_badge_content').removeClass('d-none');
    $('#sentence_away_msg').addClass('d-none');
    $('#bronze_badge_link_img').addClass('enable');
    $('#bronze_badge_link_img').removeClass('disable');
    $('#silver_badge_link_img').addClass('enable');
    $('#silver_badge_link_img').removeClass('disable');
    $('#gold_badge_link_img').addClass('enable');
    $('#gold_badge_link_img').removeClass('disable');
    $('#platinum_badge_link_img').addClass('enable');
    $('#platinum_badge_link_img').removeClass('disable');
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



module.exports = { isMobileDevice, getContributedAndTopLanguage, getLanguageTargetInfo, showByHoursChartThankyouPage, showByHoursChart, redirectToLocalisedPage, setBadge, showFucntionalCards, getAvailableLanguages, isKeyboardExtensionPresent, enableCancelButton, disableCancelButton,landToHome,showOrHideExtensionCloseBtn,hasUserRegistered };
