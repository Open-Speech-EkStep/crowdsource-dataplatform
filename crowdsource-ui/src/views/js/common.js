const {
  CONTRIBUTION_LANGUAGE,
  TOP_LANGUAGES_BY_HOURS,
  PARALLEL_TO_LANGUAGE,
  ALL_LANGUAGES,
  CURRENT_MODULE,
  SPEAKER_DETAILS_KEY,
  DEFAULT_CON_LANGUAGE,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  AGGREGATED_DATA_BY_LANGUAGE,
  BADGES_NAME,BADGES_STRING,INITIATIVES,BADGES_API_TEXT
} = require('./constants');
const { drawTopLanguageChart } = require('./verticalGraph');
const { changeLocale, showLanguagePopup } = require('./locale');
const fetch = require('./fetch');
const {
  performAPIRequest,
  getLanguageBadge,
  calculateTime,
  formatTime,
  getJson,
  translate,
  toPascalCase,
  getInitiativeType
} = require('./utils');
const { onChangeUser, onOpenUserDropDown, showUserProfile } = require('./header');
const {
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setGenderRadioButtonOnClick,
} = require('./speakerDetails');
const { ErrorStatusCode } = require('./enum');

const getContributedAndTopLanguage = (topLanguagesData, type) => {
  if (topLanguagesData && topLanguagesData.length) {
    topLanguagesData = topLanguagesData.sort((a, b) =>
      Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1
    );
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage =
      type == INITIATIVES.parallel.value
        ? localStorage.getItem(CONTRIBUTION_LANGUAGE) + '-' + localStorage.getItem(PARALLEL_TO_LANGUAGE)
        : localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    let topLanguages = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language == contributedLanguage);
    if (contributedLanguageHours && contributedLanguageHours.language != topLanguagesData[0].language) {
      topLanguageArray.push(contributedLanguageHours);
      let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
      remainingLanguage =
        type == INITIATIVES.ocr.value || type == INITIATIVES.parallel.value
          ? remainingLanguage.sort((a, b) =>
              Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1
            )
          : remainingLanguage.sort((a, b) =>
              Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1
            );
      topLanguages = remainingLanguage.slice(0, 3);
    } else {
      if (contributedLanguage != topLanguagesData[0].language) {
        if (type == INITIATIVES.asr.value || type == INITIATIVES.text.value) {
          topLanguageArray.push({ language: contributedLanguage, total_contributions: '0.000' });
        } else {
          topLanguageArray.push({ language: contributedLanguage, total_contribution_count: '0' });
        }
      }
      topLanguages = topLanguagesResult
        .sort((a, b) => (Number(a.total_contribution_count) > Number(b.total_contribution_count) ? -1 : 1))
        .slice(0, 3);
    }
    return topLanguageArray.concat(topLanguages).reverse();
  } else {
    return [];
  }
};

const getTopLanguage = (topLanguagesData, type, keyInSentence, keyInHrs) => {
  if (topLanguagesData && topLanguagesData.length) {
    topLanguagesData = topLanguagesData.sort((a, b) =>
      Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1
    );
    const topLanguagesResult = [...topLanguagesData];
    const contributedLanguage =
      type == INITIATIVES.parallel.value
        ? localStorage.getItem(CONTRIBUTION_LANGUAGE) + '-' + localStorage.getItem(PARALLEL_TO_LANGUAGE)
        : localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    let topLanguages = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language == contributedLanguage);
    if (contributedLanguageHours && contributedLanguageHours.language != topLanguagesData[0].language) {
      topLanguageArray.push(contributedLanguageHours);
      let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
      remainingLanguage =
        type == INITIATIVES.ocr.value || type == INITIATIVES.parallel.value
          ? remainingLanguage.sort((a, b) => (Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1))
          : remainingLanguage.sort((a, b) => (Number(a[keyInHrs]) > Number(b[keyInHrs]) ? -1 : 1));
      topLanguages = remainingLanguage.slice(0, 3);
    } else {
      if (contributedLanguage != topLanguagesData[0].language) {
        if (type == INITIATIVES.asr.value || type == INITIATIVES.text.value) {
          topLanguageArray.push({ language: contributedLanguage, [keyInHrs]: '0.000' });
        } else {
          topLanguageArray.push({ language: contributedLanguage, [keyInSentence]: '0' });
        }
      }
      topLanguages = topLanguagesResult
        .sort((a, b) => (Number(a[keyInSentence]) > Number(b[keyInSentence]) ? -1 : 1))
        .slice(0, 3);
    }
    return topLanguageArray.concat(topLanguages).reverse();
  } else {
    return [];
  }
};

function showByHoursChart(type, page, dataType) {
  const chartReg = {};
  if (chartReg['chart']) {
    chartReg['chart'].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type, dataType, page);
}

function showByHoursChartThankyouPage(type, page, dataType = '') {
  const chartReg = {};
  if (chartReg['chart']) {
    chartReg['chart'].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(AGGREGATED_DATA_BY_TOP_LANGUAGE);
  drawTopLanguageChart(JSON.parse(topLanguagesByHoursData), type, dataType, page);
}

function redirectToLocalisedPage() {
  const locale = sessionStorage.getItem('i18n');
  const module = localStorage.getItem(CURRENT_MODULE);
  const allLocales = ALL_LANGUAGES.map(language => language.id);
  // const locale = localeValue == 'null'  || localeValue == undefined? 'en' : localeValue;
  const splitValues = location.href.split('/');
  const currentLocale = splitValues.filter(value => allLocales.includes(value))[0] || '';
  if (currentLocale != locale) {
    changeLocale(locale);
  } else {
    const language = ALL_LANGUAGES.find(ele => ele.id === locale);
    if (language && module != INITIATIVES.parallel.value) {
      updateLocaleLanguagesDropdown(language.value);
    }
  }
}

const updateLocaleLanguagesDropdown = language => {
  const dropDown = $('#localisation_dropdown');
  language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
  const localeLang = ALL_LANGUAGES.find(ele => ele.value.toLowerCase() === language.toLowerCase());
  if (language.toLowerCase() === 'english' || localeLang.hasLocaleText === false) {
    dropDown.html(
      '<a id="english" class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>'
    );
  } else {
    dropDown.html(`<a id="english" class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>
      <a id=${localeLang.value} class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }
};

const getLanguageTargetInfo = (type, sourceLanguage, targetLanguage) => {
  return fetch(`/target-info/${type}/${sourceLanguage}?targetLanguage=${targetLanguage}`)
    .then(safeErrorHandling)
    .then(data => {
      if (!data.ok) {
        throw Error(data.statusText || 'HTTP error');
      } else {
        return Promise.resolve(data.json());
      }
    });
};

const safeErrorHandling = data => {
  if (data && !data.ok) {
    bindErrorText(data);
    showErrorPopup();
  }
  return data;
};

const showFunctionalCards = (type, fromLanguage, toLanguage) => {
  let contributeCard = $('#left');
  let validateCard = $('#right');
  let contributeCardRow = $('#contribute-row');
  let validateCardRow = $('#validate-row');
  getJson('/aggregated-json/languagesWithData.json')
    .then(languagesWithDataJson => {
      var hasTarget, isAllContributed;
      const hasData = languagesWithDataJson.filter(
        data => data.type == type && data.language == fromLanguage
      )[0]
        ? true
        : false;
      if (hasData) {
        getJson('/aggregated-json/enableDisableCards.json')
          .then(jsonData => {
            var language = fromLanguage;
            if (type == INITIATIVES.parallel.type && toLanguage) {
              language = `${fromLanguage}-${toLanguage}`;
            }
            const filteredData =
              jsonData.filter(data => data.type == type && data.language == language)[0] || {};
            
            hasTarget = filteredData.hastarget || false;
            isAllContributed = filteredData.isallcontributed || false;
            if (hasTarget && !isAllContributed) {
              contributeCard.removeClass('cont-validate-disabled');
              contributeCardRow.removeClass('cursor-no-drop');
              validateCard.removeClass('validate-disabled');
            } else if (hasTarget && isAllContributed) {
              validateCard.removeClass('validate-disabled');
              validateCardRow.removeClass('cursor-no-drop');
              contributeCardRow.addClass('cursor-no-drop');
              contributeCard.addClass('cont-validate-disabled');
            } else if (!hasTarget && !isAllContributed) {
              contributeCard.removeClass('cont-validate-disabled');
              contributeCardRow.removeClass('cursor-no-drop');
              validateCard.addClass('validate-disabled');
              validateCardRow.addClass('cursor-no-drop');
            } else {
              contributeCard.addClass('cont-validate-disabled');
              validateCard.addClass('validate-disabled');
              validateCardRow.addClass('cursor-no-drop');
              contributeCardRow.addClass('cursor-no-drop');
            }
          })
          .catch(e => console.log(e));
      } else {
        contributeCard.addClass('cont-validate-disabled');
        validateCard.addClass('validate-disabled');
        validateCardRow.addClass('cursor-no-drop');
        contributeCardRow.addClass('cursor-no-drop');
      }
    })
    .catch(e => console.log(e));
};

const isInTopLanguage = function (sortingLanguages = [], contributionLanguage) {
  const contributedLanguage = contributionLanguage.toLowerCase();

  const isContributedLanguageInList = sortingLanguages.some(element => {
    return element.language.toLowerCase() === contributedLanguage;
  });

  if (isContributedLanguageInList) {
    return true;
  }
  return false;
};

const getTop3Languages = function (functionalFlow = '', currentModule = '', contributionLanguage = '') {
  const topLanguages = JSON.parse(localStorage.getItem(AGGREGATED_DATA_BY_LANGUAGE)) || [];
  const sortingKey =
    functionalFlow == 'validator'
      ? 'total_validation_count'
      : currentModule == INITIATIVES.text.value
      ? 'total_contributions'
      : 'total_contribution_count';

  const sortingLanguages =
    currentModule == INITIATIVES.ocr.value || currentModule == INITIATIVES.parallel.value
      ? topLanguages.sort((a, b) => (Number(a[sortingKey]) > Number(b[sortingKey]) ? -1 : 1)).slice(0, 3)
      : topLanguages.sort((a, b) => (Number(a[sortingKey]) > Number(b[sortingKey]) ? -1 : 1)).slice(0, 3);

  const contributedLanguageIndexFromTop3List = sortingLanguages.findIndex(element => {
    return element.language.toLowerCase() === contributionLanguage.toLowerCase();
  });

  if (contributedLanguageIndexFromTop3List === -1) {
    const contributedLanguageIndex = topLanguages.findIndex(element => {
      return element.language.toLowerCase() === contributionLanguage.toLowerCase();
    });

    const bottomLanguageStats = sortingLanguages[2] && sortingLanguages[2][sortingKey];

    if (contributedLanguageIndex === -1) {
      return sortingLanguages;
    }

    const contributedLanguageStats = topLanguages[contributedLanguageIndex][sortingKey]
      ? topLanguages[contributedLanguageIndex][sortingKey]
      : 0;

    if (bottomLanguageStats === contributedLanguageStats) {
      sortingLanguages[2] = topLanguages[contributedLanguageIndex];
    }
  }

  return sortingLanguages;
};


const setBadge = function (data, localeStrings, functionalFlow) {
  localStorage.setItem('badgeId', data.badgeId);
  localStorage.setItem('badges', JSON.stringify(data.badges));
  const languageGoal = data.languageGoal || 0;
  localStorage.setItem('nextHourGoal', languageGoal);

  $('#language-hour-goal').text(languageGoal);
  $('#user-contribution-count').text(data.contributionCount);

  let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  let parallelContributionLanguage;
  const module = localStorage.getItem(CURRENT_MODULE);

  if (module === INITIATIVES.parallel.value) {
    const toLanguage = localStorage.getItem(PARALLEL_TO_LANGUAGE);
    const parallelPairLanguage = contributionLanguage + '-' + toLanguage;
    parallelContributionLanguage = parallelPairLanguage;
  }

  const top3Languages = getTop3Languages(
    functionalFlow,
    module,
    module === INITIATIVES.parallel.value ? parallelContributionLanguage : contributionLanguage
  );
  const isLanguageOnTop = isInTopLanguage(
    top3Languages,
    module === INITIATIVES.parallel.value ? parallelContributionLanguage : contributionLanguage
  );

  const initiativeType = getInitiativeType(module);
  if (isLanguageOnTop) {
    $('#languageInTopWeb').removeClass('d-none');
    $('#languageInTopMob').removeClass('d-none');
    $('#languageNotInTopMob').addClass('d-none');
    $('#languageNotInTopWeb').addClass('d-none');
  } else {
    $('#languageNotInTopMob').removeClass('d-none');
    $('#languageNotInTopWeb').removeClass('d-none');
    $('#languageInTopWeb').addClass('d-none');
    $('#languageInTopMob').addClass('d-none');
  }
  const nextBadgeName = data.nextBadgeType && localeStrings[BADGES_NAME[data.nextBadgeType.toLowerCase()]];
  if (nextBadgeName) {
    $('#sentence-away-count').text(Number(data.nextMilestone) - Number(data.contributionCount));
    $('#sentence_away_badge').text(nextBadgeName.charAt(0).toUpperCase() + nextBadgeName.slice(1));
  }

  const source = functionalFlow === 'validator' ? 'validate' : 'contribute';
  $('#badge_1_badge_link_img').attr('src', getLanguageBadge(contributionLanguage, 'badge_1', source, initiativeType));
  $('#badge_2_badge_link_img').attr('src', getLanguageBadge(contributionLanguage, 'badge_2', source, initiativeType));
  $('#badge_3_badge_link_img').attr('src', getLanguageBadge(contributionLanguage, 'badge_3', source, initiativeType));
  $('#badge_4_badge_link_img').attr('src', getLanguageBadge(contributionLanguage, 'badge_4', source, initiativeType));

  if (data.isNewBadge) {
    $('.new-badge-msg').removeClass('d-none');
    $('.thankyou-page-heading').addClass('d-none');
    $('.user-contribution-msg').addClass('d-none');
    const nextBadge = data.nextBadgeType && [data.nextBadgeType.toLowerCase()];

    const cardWithoutBadge = $('#cardWithoutBadge');
    cardWithoutBadge.remove();
    $('#chartRowWithoutCard').append(cardWithoutBadge);
    const $socialLink = $('#social-links');
    $('.download-row').append($socialLink);
    const activeBadgeId = `#${BADGES_STRING[data.currentBadgeType.toLowerCase()]}_badge_link`;
    const activeBadge = $(activeBadgeId);
    activeBadge.attr('disabled', false);
    $('.downloadable_badges').append(activeBadge);
    const nextBadgeLink = $(`#${BADGES_STRING[nextBadge]}_badge_link_img`);
    nextBadgeLink.removeClass('disable');

    $('.participation-msg-section').addClass('d-flex align-items-center');
    if(!isMobileDevice()){
      $('.downloadable_badges').css('margin-left','10px')
      if(data.currentBadgeType.toLowerCase() == 'platinum'){
        $('.badges_information').css('margin-left','0px')
      }
    }

    $('#milestone_text').removeClass('d-none');
    const currentBadgeName = localeStrings[BADGES_NAME[data.currentBadgeType.toLowerCase()]];
    $('#current_badge_name').text(currentBadgeName.charAt(0).toUpperCase() + currentBadgeName.slice(1));
    $('#current_badge_name_1').text(localeStrings[data.currentBadgeType.toLowerCase()]);
    $('#current_badge_count').text(data.contributionCount);
    $('#next_badge_count').text(data.nextMilestone);
    $('#next_badge_name_1').text(nextBadgeName);
    $('#next_badge_name').text(nextBadgeName);
    $('#download_pdf').attr('data-badge', BADGES_STRING[data.currentBadgeType.toLowerCase()]);
    if (functionalFlow === 'validator') {
      $('#reward-img').attr(
        'src',
        getLanguageBadge(contributionLanguage, BADGES_STRING[data.currentBadgeType.toLowerCase()], 'validate', initiativeType)
      );
    } else {
      $('#reward-img').attr(
        'src',
        getLanguageBadge(contributionLanguage, BADGES_STRING[data.currentBadgeType.toLowerCase()], 'contribute', initiativeType)
      );
    }
  } else if (data.contributionCount === 0) {
    $('.new-badge-msg').addClass('d-none');
    $('.thankyou-page-heading').removeClass('d-none');
    $('.user-contribution-msg').addClass('d-none');
    $('#contribution_text').removeClass('d-none');
  } else {
    if (data.badges && data.badges.length) {
      !isMobileDevice() && $('.downloadable_badges').css('margin-left','10px')
      $('#showAfterBadge').removeClass('d-none');
      $('.participation-msg-section').removeClass('pt-lg-3').removeClass('pt-md-3').addClass('pt-0');
      const participateMsgWeb = $('.web-view');
      const participateMsgMob = $('.mobile-view');
      $('#languageInTopWeb')
        .removeClass('my-3')
        .removeClass('font-weight-normal')
        .addClass('font-weight-normal-Rowdies')
        .addClass('mb-3');
      $('#languageNotInTopWeb')
        .removeClass('my-3')
        .removeClass('font-weight-normal')
        .addClass('font-weight-normal-Rowdies')
        .addClass('mb-3');
      participateMsgWeb.remove();
      participateMsgMob.remove();
      $('#showParticipateMsg').removeClass('d-none');
      $('#showParticipateMsg').append(participateMsgWeb);
      $('#showParticipateMsg').append(participateMsgMob);
      const badgeType = data.currentBadgeType;
      $('#thankyou-last-badge').attr(
        'src',
        getLanguageBadge(contributionLanguage, BADGES_STRING[data.currentBadgeType.toLowerCase()], 'contribute', initiativeType)
      );
      const badgeTypeTranslation = toPascalCase(translate(BADGES_NAME[badgeType.toLowerCase()]));
      $('#last-bagde-earned').html(badgeTypeTranslation);
    }
    $('.new-badge-msg').addClass('d-none');
    $('.thankyou-page-heading').addClass('d-none');
    $('.user-contribution-msg').removeClass('d-none');
    $('#before_badge_content').removeClass('d-none');
    $('#user-contribution-msg').removeClass('d-none');
  }

  const $badge_1_BadgeLink = $('#badge_1_badge_link_img');
  const $badge_1_Badge = $('#badge_1_badge_link');
  const $badge_2_BadgeLink = $('#badge_2_badge_link_img');
  const $badge_2_Badge = $('#badge_2_badge_link');
  const $badge_3_BadgeLink = $('#badge_3_badge_link_img');
  const $badge_3_Badge = $('#badge_3_badge_link');
  const $badge_4_BadgeLink = $('#badge_4_badge_link_img');
  const $badge_4_Badge = $('#badge_4_badge_link');
  if (data.currentBadgeType.toLowerCase() == BADGES_API_TEXT.badge_1) {
    $badge_1_Badge.attr('disabled', false);
    $badge_1_BadgeLink.attr('title', 'Download Badge_1 Badge');
    $('.downloadable_badges').append($badge_1_Badge);
    $badge_1_BadgeLink.removeClass('mr-3');

    $badge_2_BadgeLink.removeClass('disable');
    $badge_1_BadgeLink.addClass('enable');
    $badge_1_BadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === BADGES_API_TEXT.badge_2) {
    $badge_1_Badge.attr('disabled', false);
    $badge_1_BadgeLink.attr('title', 'Download Badge_1 Badge');
    $badge_2_Badge.attr('disabled', false);
    $badge_2_BadgeLink.attr('title', 'Download Badge_2 Badge');
    $('.downloadable_badges').append($badge_1_Badge);
    $('.downloadable_badges').append($badge_2_Badge);
    $badge_2_BadgeLink.removeClass('mr-3');

    $badge_1_BadgeLink.addClass('enable');
    $badge_1_BadgeLink.removeClass('disable');
    $badge_2_BadgeLink.addClass('enable');
    $badge_2_BadgeLink.removeClass('disable');
    $badge_3_BadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === BADGES_API_TEXT.badge_3) {
    $badge_1_Badge.attr('disabled', false);
    $badge_2_Badge.attr('disabled', false);
    $badge_3_Badge.attr('disabled', false);
    $badge_1_BadgeLink.attr('title', 'Download Badge_1 Badge');
    $badge_2_BadgeLink.attr('title', 'Download Badge_2 Badge');
    $badge_3_BadgeLink.attr('title', 'Download Badge_3 Badge');
    $('.downloadable_badges').append($badge_1_Badge);
    $('.downloadable_badges').append($badge_2_Badge);
    $('.downloadable_badges').append($badge_3_Badge);
    $badge_3_BadgeLink.removeClass('mr-3');

    $badge_1_BadgeLink.addClass('enable');
    $badge_1_BadgeLink.removeClass('disable');
    $badge_2_BadgeLink.addClass('enable');
    $badge_2_BadgeLink.removeClass('disable');
    $badge_3_BadgeLink.addClass('enable');
    $badge_3_BadgeLink.removeClass('disable');
    $badge_4_BadgeLink.removeClass('disable');
  } else if (data.currentBadgeType.toLowerCase() === BADGES_API_TEXT.badge_4) {
    $badge_1_Badge.attr('disabled', false);
    $badge_2_Badge.attr('disabled', false);
    $badge_3_Badge.attr('disabled', false);
    $badge_4_Badge.attr('disabled', false);
    $badge_4_BadgeLink.attr('title', 'Download Badge_4 Badge');
    $badge_3_BadgeLink.attr('title', 'Download Badge_3 Badge');
    $badge_1_BadgeLink.attr('title', 'Download Badge_1 Badge');
    $badge_2_BadgeLink.attr('title', 'Download Badge_2 Badge');
    $('.downloadable_badges').append($badge_1_Badge);
    $('.downloadable_badges').append($badge_2_Badge);
    $('.downloadable_badges').append($badge_3_Badge);
    $('.downloadable_badges').append($badge_4_Badge);
    $badge_4_BadgeLink.removeClass('mr-3');
    if(!isMobileDevice()){
      $('.downloadable_badges').css('margin-left','10px')
      $('.badges_information').css('margin-left','0px')
    }
    $('#sentence_away_msg').addClass('d-none');
    if (isLanguageOnTop) {
      $('#badge_4_reward_msg_1').removeClass('d-none');
    } else {
      $('#badge_4_reward_msg_2').removeClass('d-none');
    }

    $('#next-goal').addClass('d-none');
    $('#before_badge_content').removeClass('d-none');
    $badge_1_BadgeLink.addClass('enable');
    $badge_1_BadgeLink.removeClass('disable');
    $badge_2_BadgeLink.addClass('enable');
    $badge_2_BadgeLink.removeClass('disable');
    $badge_3_BadgeLink.addClass('enable');
    $badge_3_BadgeLink.removeClass('disable');
    $badge_4_BadgeLink.addClass('enable');
    $badge_4_BadgeLink.removeClass('disable');
  }
};

const isKeyboardExtensionPresent = function () {
  const chromeExtension = document.getElementById('GOOGLE_INPUT_CHEXT_FLAG');
  return chromeExtension ? true : false;
};

const enableCancelButton = function () {
  const $cancelEditButton = $('#cancel-edit-button');
  $cancelEditButton.removeAttr('disabled');
};

const disableCancelButton = function () {
  const $cancelEditButton = $('#cancel-edit-button');
  $cancelEditButton.attr('disabled', true);
};

const isMobileDevice = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true;
  } else {
    // false for not mobile device
    return false;
  }
};

const landToHome = function () {
  if (!localStorage.getItem(CONTRIBUTION_LANGUAGE)) {
    showLanguagePopup();
    return;
  } else {
    redirectToLocalisedPage();
  }
};

const hasUserRegistered = function () {
  const userDetail = localStorage.getItem(SPEAKER_DETAILS_KEY);
  const parsedUserDetails = userDetail ? JSON.parse(userDetail) : false;
  return parsedUserDetails ? true : false;
};

const showOrHideExtensionCloseBtn = function () {
  // console.log("here")
  // if(!isKeyboardExtensionPresent()){
  //   console.log("not present")
  //   $('#extension-bar-close-btn').addClass('d-none');
  // } else {
  //   console.log("present")
  //   $('#extension-bar-close-btn').removeClass('d-none');
  // }
};

const updateParallelLocaleLanguagesDropdown = language => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value == language);
  if (language.toLowerCase() === 'english' || localeLang.hasLocaleText === false) {
    dropDown.html(
      `<a id="english" class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>`
    );
  } else {
    dropDown.html(`<a id="english" class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>
    <a id=${localeLang.value} class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }
};

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
  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }

  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
};

function roundValue(value, precision) {
  return value.toFixed(precision);
}

function formatProgressAverage(average) {
  const precision = 1;
  const formattedAverage = roundValue(average, precision);
  return formattedAverage;
}

const getCountBasedOnSource = function (source, contributionCount, validationCount) {
  if (source == 'contribute') {
    return contributionCount;
  } else if (source == 'validate') {
    return validationCount;
  }
  return contributionCount + validationCount;
};

function getCumulativeJsonUrl(language) {
  return language
    ? '/aggregated-json/cumulativeDataByLanguage.json'
    : '/aggregated-json/cumulativeCount.json';
}

function languageFilter(data, type, language) {
  if (type == INITIATIVES.parallel.type) {
    language = language.split('-')[0];
  }
  if (language) return data.filter(d => d.language.split('-')[0] == language);
  return data;
}

function reduceList(dataList) {
  return dataList.reduce((accumulator, item) => {
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'string') return;
      accumulator[key] = (accumulator[key] || 0) + item[key];
    });
    return accumulator;
  }, {});
}

function setCurrentProgress(type, source = '', language = '') {
  const url = getCumulativeJsonUrl(language);
  return getJson(url).then(data => {
    var progressDataList = data.filter(d => d.type == type) || [];
    progressDataList = languageFilter(progressDataList, type, language);
    const progressData = reduceList(progressDataList);
    var totalProgress;
    if (type == INITIATIVES.text.type || type == INITIATIVES.asr.type) {
      totalProgress =
        getCountBasedOnSource(source, progressData.total_contributions, progressData.total_validations) || 0;

      const { hours, minutes, seconds } = calculateTime(totalProgress * 60 * 60);

      const formattedCurrentProgress = formatTime(hours, minutes, seconds);
      replaceSubStr($('.progress-metric'), '<contribution-done>', formattedCurrentProgress);
    } else {
      totalProgress =
        getCountBasedOnSource(
          source,
          progressData.total_contribution_count,
          progressData.total_validation_count
        ) || 0;
      replaceSubStr($('.progress-metric'), '<contribution-done>', totalProgress);
    }
    return totalProgress;
  });
}

function getProgressGoalJsonUrl(language) {
  if (language) return '/aggregated-json/initiativeGoalsByLanguage.json';
  return '/aggregated-json/initiativeGoals.json';
}

function setProgressGoal(type, source = '', language = '') {
  const url = getProgressGoalJsonUrl(language);
  return getJson(url).then(data => {
    var goalDataList = data.filter(d => d.type == type) || [];
    goalDataList = languageFilter(goalDataList, type, language);
    const goalData = reduceList(goalDataList);
    const totalGoal =
      getCountBasedOnSource(source, goalData.contribution_goal, goalData.validation_goal) || 1;
    replaceSubStr($('.progress-metric'), '<contribution-goal>', totalGoal);
    if (!totalGoal) {
      throw Error('Invalid progress goal');
    }
    return totalGoal;
  });
}

const updateGoalProgressBarFromJson = function (type, source = '', language = '') {
  setCurrentProgress(type, source, language)
    .then(currentProgress => {
      setProgressGoal(type, source, language)
        .then(goal => {
          const average = (currentProgress / goal) * 100;
          const formattedAverage = formatProgressAverage(average);
          const averageText = formattedAverage + '%';
          $('#totalAverage').html(averageText);
          const $progressBar = $('#progress_bar');
          $progressBar.width(averageText);
          $('.progress-bar-loader').addClass('d-none');
          $('#progress-bar-content').removeClass('d-none');
        })
        .catch(console.log);
    })
    .catch(console.log);
};

const updateGoalProgressBar = function (url) {
  const moduleType = localStorage.getItem(CURRENT_MODULE);
  return performAPIRequest(url)
    .then(data => {
      const maxValue = Number(data.goal);
      const currentValue = Number(data['current-progress']);

      if (moduleType !== INITIATIVES.parallel.value && moduleType !== INITIATIVES.ocr.value) {
        const { hours, minutes, seconds } = calculateTime(currentValue * 60 * 60);

        const formattedCurrentProgress = formatTime(hours, minutes, seconds);
        replaceSubStr($('.progress-metric'), '<contribution-done>', formattedCurrentProgress);
      } else {
        replaceSubStr($('.progress-metric'), '<contribution-done>', currentValue);
      }

      replaceSubStr($('.progress-metric'), '<contribution-goal>', maxValue);
      const average = (currentValue / maxValue) * 100;
      const formattedAverage = formatProgressAverage(average);
      const averageText = formattedAverage + '%';
      $('#totalAverage').html(averageText);
      const $progressBar = $('#progress_bar');
      $progressBar.width(averageText);
      $('.progress-bar-loader').addClass('d-none');
      $('#progress-bar-content').removeClass('d-none');
    })
    .catch(e => console.log(e));
};

const replaceSubStr = function (element, to, from) {
  const originalText = element.text();
  const newText = originalText.replace(to, from);
  element.text(newText.toString());
};

const showErrorPopup = (status = 500) => {
  const text = getErrorText(status);
  bindErrorText(text);
  const $errorDialog = $('#errorPopup');
  $errorDialog.modal('show');
};

const getErrorText = status => {
  const errorText =
    status === ErrorStatusCode.SERVICE_UNAVAILABLE
      ? translate('We are processing multiple requests at the moment. Please try again after sometime.')
      : translate('An unexpected error has occurred.');
  return errorText;
};

const bindErrorText = text => {
  const $errorText = $('#error-text');
  $errorText.text(text);
};

const safeJqueryErrorHandling = e => {
  if (e && e.statusText !== 'error') {
    showErrorPopup();
  }
};

const redirectToHomeForDirectLanding = function () {
  if (!document.referrer) {
    location.href = './home.html';
    return;
  }
};

module.exports = {
  safeJqueryErrorHandling,
  isMobileDevice,
  safeErrorHandling,
  showErrorPopup,
  setLocalisationAndProfile,
  getContributedAndTopLanguage,
  updateParallelLocaleLanguagesDropdown,
  updateLocaleLanguagesDropdown,
  getLanguageTargetInfo,
  showByHoursChartThankyouPage,
  showByHoursChart,
  redirectToLocalisedPage,
  setBadge,
  showFunctionalCards,
  isKeyboardExtensionPresent,
  enableCancelButton,
  disableCancelButton,
  landToHome,
  showOrHideExtensionCloseBtn,
  hasUserRegistered,
  updateGoalProgressBar,
  replaceSubStr,
  getTopLanguage,
  isInTopLanguage,
  getTop3Languages,
  setCurrentProgress,
  getCountBasedOnSource,
  updateGoalProgressBarFromJson,
  languageFilter,
  reduceList,
  redirectToHomeForDirectLanding,
};
