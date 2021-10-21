const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown,
  getLanguageBadge,
  getInitiativeType,
} = require('./utils');
const {
  CONTRIBUTION_LANGUAGE,
  LOCALE_STRINGS,
  SPEAKER_DETAILS_KEY,
  DEFAULT_CON_LANGUAGE,
  INITIATIVES_NAME,
  config,
  BADGES_API_TEXT,
  INITIATIVES,
  CURRENT_MODULE,
} = require('./constants');
const { onChangeUser, showUserProfile, onOpenUserDropDown } = require('./header');
const { hasUserRegistered } = require('./common');

let badgeLevel = 'badge_1_participation_badge';

const selectBadgeLevel = function (id) {
  $('.badge-level-section').find('.bg-white').removeClass('bg-white');
  $(`#${id}`).addClass('bg-white');
};

const getBadgeLevels = function (language, initiative, source) {
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  return `
    <div class="col-3 pl-lg-4 pr-lg-5 pl-1 pl-md-2 pr-2 card1">
                                <div class="badge-detail-widget cursor-pointer text-center" id="badge_1_participation_badge">
                                    <img src="${getLanguageBadge(
                                      language,
                                      'badge_1',
                                      source,
                                      initiative
                                    )}" class="my-badge-image" id="badge_1" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${
                                      localeString[config.badge_1]
                                    }</h6>
                                </div>
                            </div>
                            <div class="col-3 pl-lg-4 pr-lg-5 pl-1 pl-md-2 pr-2 card2">
                                <div class="badge-detail-widget cursor-pointer text-center" id="badge_2_participation_badge">
                                    <img src="${getLanguageBadge(
                                      language,
                                      'badge_2',
                                      source,
                                      initiative
                                    )}" class="my-badge-image" id="badge_2" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${
                                      localeString[config.badge_2]
                                    }</h6>
                                </div>
                            </div>
                            <div class="col-3 pr-lg-5 pl-1 pl-lg-4 pl-md-2 pr-2 card3">
                                <div class="badge-detail-widget cursor-pointer text-center" id="badge_3_participation_badge">
                                    <img src="${getLanguageBadge(
                                      language,
                                      'badge_3',
                                      source,
                                      initiative
                                    )}" class="my-badge-image" id="badge_3" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${
                                      localeString[config.badge_3]
                                    }</h6>
                                </div>
                            </div>
                            <div class="col-3 pr-lg-5 pl-1 pl-lg-4 pl-md-2 pr-2 card4">
                                <div class="badge-detail-widget cursor-pointer text-center" id="badge_4_participation_badge">
                                    <img src="${getLanguageBadge(
                                      language,
                                      'badge_4',
                                      source,
                                      initiative
                                    )}" class="my-badge-image" id="badge_4" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${
                                      localeString[config.badge_4]
                                    }</h6>
                                </div>
                            </div>
    `;
};

const renderCard = function (data, initiative, badge_color, source, language) {
  const moduleDetail = {
    text: { 'text-type': 'recordings' },
    asr: { 'text-type': 'Sentences' },
    parallel: { 'text-type': 'Translations' },
    ocr: { 'text-type': 'image labels' },
  };

  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeLanguageStr = localeString[language];
  const localeTextTypeStr = localeString[moduleDetail[initiative]['text-type']];
  const localeSourceStr = localeString[source.charAt(0).toUpperCase() + source.slice(1)];
  const initiativeName = INITIATIVES_NAME[initiative];

  const localeInitiativeStr = localeString[initiativeName];
  const localeBadgeColorStr = localeString[config[badge_color]];

  const $selectedBadgeCardImg = $('.selected-badge-card img');
  $selectedBadgeCardImg.attr('src', getLanguageBadge(language, badge_color, source, initiative));
  const currentBadge = data.find(
    element => element.badge.toLowerCase() === BADGES_API_TEXT[badge_color].toLowerCase()
  );
  $('#participation-type').html(localeSourceStr);
  $('#milestone').html(currentBadge.contributions);
  $('#text-type').html(localeTextTypeStr.toLowerCase());
  $('#contribution-language').html(localeLanguageStr);
  $('#initiative-name').html(localeInitiativeStr);
  $('#badge-color').html(localeBadgeColorStr.charAt(0).toUpperCase() + localeBadgeColorStr.slice(1));
};

const renderBadgeDetails = function (data, source, initiative, language, badge_color) {
  const badgeLevels = getBadgeLevels(language, initiative, source);
  const $badgeLevelSection = $('.badge-level-section');
  $badgeLevelSection.html(badgeLevels);
  $(
    '#badge_1_participation_badge, #badge_2_participation_badge ,#badge_3_participation_badge, #badge_4_participation_badge'
  )
    .off('click')
    .on('click', e => {
      $('.badge-level-section').find('.bg-white').removeClass('bg-white');
      $(e.currentTarget).addClass('bg-white');
      const badgeColor = e.currentTarget.id.replace('_participation_badge', '');
      badgeLevel = e.currentTarget.id;
      renderCard(data, initiative, badgeColor, source, language);
    });
  selectBadgeLevel(badgeLevel);
  renderCard(data, initiative, badge_color, source, language);
};

const getBadgeData = (source, language, initiative, badge_color) => {
  performAPIRequest(`/rewards-info?type=${initiative}&source=${source}&language=${language}`)
    .then(data => renderBadgeDetails(data, source, initiative, language, badge_color))
    .catch(console.log);
};

const initialise = () => {
  // let initiative = 'asr';
  let selectedLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  let source = 'contribute';
  let badge_color = badgeLevel.replace('_participation_badge', '');
  let type = localStorage.getItem(CURRENT_MODULE);
  let initiative = type === 'home' ? 'asr' : getInitiativeType(type);

  if (type != 'home') {
    // initiative = initiativeValue;
    $('#initiative').find('.active').attr('aria-selected', false);
    $('#initiative').find('.active').removeClass('active');
    $('#initiative')
      .find('a[id="' + initiative + '"]')
      .attr('aria-selected', true);
    $('#initiative')
      .find('a[id="' + initiative + '"]')
      .addClass('active');
    source = localStorage.getItem('selectedType');
    $('#languages')
      .find('option[value="' + selectedLanguage + '"]')
      .attr('selected', 'selected');
    $('#participation-radios')
      .find('input[value="' + source + '"]')
      .attr('checked', 'checked');
  } else {
    const selectedOption = $('#languages').find('option[value="' + DEFAULT_CON_LANGUAGE + '"]');
    $(selectedOption).prop('selected', true);
    $(selectedOption).attr('selected', 'selected');
    selectedLanguage = DEFAULT_CON_LANGUAGE;
  }

  getBadgeData(source, selectedLanguage, initiative, badge_color);
  selectBadgeLevel(badgeLevel);

  $('#initiative').on('click', e => {
    $('#initiative').find('.active').removeClass('active');
    $('#initiative')
      .find('a[id="' + initiative + '"]')
      .addClass('active');
    initiative = e.target.id;
    // initiativeValue = e.target.id;
    badge_color = badgeLevel.replace('_participation_badge', '');
    // $("#initiative").find('.active').removeClass('active');
    // $("#initiative").find('a[id="' + type + '"]').addClass('active');
    getBadgeData(source, selectedLanguage, initiative, badge_color);
  });

  $('#languages').on('change', e => {
    selectedLanguage = e.target.value;
    badge_color = badgeLevel.replace('_participation_badge', '');
    getBadgeData(source, selectedLanguage, initiative, badge_color);
  });

  $('#participation-radios').on('change', e => {
    source = e.target.value;
    const selectedParticipation = document.querySelector('input[name = "participation"]:checked');

    if (selectedParticipation) selectedParticipation.checked = false;
    e.target.checked = true;
    badge_color = badgeLevel.replace('_participation_badge', '');
    getBadgeData(source, selectedLanguage, initiative, badge_color);
  });
};

$(document).ready(function () {
  getLocaleString()
    .then(() => {
      initialise();
    })
    .catch(err => {
      console.log(err);
    });
  let moduleType = localStorage.getItem('module');
  const type = localStorage.getItem('selectedType');
  if (type && type == 'validate' && moduleType != 'home') {
    $('#profile').addClass('active show');
    $('#home').removeClass('active show');
  } else {
    $('#profile').removeClass('active show');
    $('#home').addClass('active show');
  }

  const $asrTab = $('#asr');
  const $textTab = $('#text');
  const $parallelTab = $('#parallel');
  const $ocrTab = $('#ocr');

  $asrTab.on('click', function () {
    const $tabBar = document.getElementById('initiative');
    sideScroll($tabBar, 'left', 25, 100, 10);
  });

  $textTab.on('click', function () {
    const prev = $('.badge-detail-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('initiative');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $asrTab[0].id ? 'right' : 'left';
    sideScroll($tabBar, direction, 25, 160, 10);
  });

  $parallelTab.on('click', function () {
    const prev = $('.badge-detail-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('initiative');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $ocrTab[0].id ? 'left' : 'right';
    sideScroll($tabBar, direction, 25, 160, 10);
  });

  $ocrTab.on('click', function () {
    const $tabBar = document.getElementById('initiative');
    sideScroll($tabBar, 'right', 25, 100, 10);
  });

  function sideScroll(element, direction, speed, distance, step) {
    let scrollAmount = 0;
    const slideTimer = setInterval(function () {
      if (direction == 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  }

  $('#back-btn').on('click', () => {
    if (moduleType == INITIATIVES.text.value) {
      location.href = './text/home.html';
    } else if (moduleType == INITIATIVES.asr.value) {
      location.href = './asr/home.html';
    } else if (moduleType == INITIATIVES.parallel.value) {
      location.href = './parallel/home.html';
    } else if (moduleType == INITIATIVES.ocr.value) {
      location.href = './ocr/home.html';
    } else {
      location.href = './home.html';
    }
  });

  if (hasUserRegistered()) {
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./badges.html', moduleType);
  onOpenUserDropDown();

  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
});

module.exports = { renderCard, getBadgeLevels };
