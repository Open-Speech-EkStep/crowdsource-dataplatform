const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown,
  getLanguageBadge
} = require('./utils');
const {
  CONTRIBUTION_LANGUAGE,
  LOCALE_STRINGS,
  SPEAKER_DETAILS_KEY,
  MODULE,
  DEFAULT_CON_LANGUAGE,
  BADGES_NAME,
  INITIATIVES_NAME
} = require('./constants');
const {onChangeUser, showUserProfile, onOpenUserDropDown} = require('./header');
const {hasUserRegistered} = require('./common');

let badgeLevel = 'bronze_participation_badge';

const selectBadgeLevel = function (id){
  $('.badge-level-section').find('.bg-white').removeClass('bg-white');
  $(`#${id}`).addClass('bg-white');
}


const getBadgeLevels = function (language, initiative, source) {
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  return `
    <div class="col-3 pl-lg-4 pr-lg-5 pl-1 pl-md-2 pr-2 card1">
                                <div class="badge-detail-widget cursor-pointer text-center" id="bronze_participation_badge">
                                    <img src="${getLanguageBadge(language,'bronze',source, initiative)}" class="my-badge-image" id="bronze" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${localeString[BADGES_NAME.bronze]}</h6>
                                </div>
                            </div>
                            <div class="col-3 pl-lg-4 pr-lg-5 pl-1 pl-md-2 pr-2 card2">
                                <div class="badge-detail-widget cursor-pointer text-center" id="silver_participation_badge">
                                    <img src="${getLanguageBadge(language,'silver',source, initiative)}" class="my-badge-image" id="silver" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${localeString[BADGES_NAME.silver]}</h6>
                                </div>
                            </div>
                            <div class="col-3 pr-lg-5 pl-1 pl-lg-4 pl-md-2 pr-2 card3">
                                <div class="badge-detail-widget cursor-pointer text-center" id="gold_participation_badge">
                                    <img src="${getLanguageBadge(language,'gold',source, initiative)}" class="my-badge-image" id="gold" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${localeString[BADGES_NAME.gold]}</h6>
                                </div>
                            </div>
                            <div class="col-3 pr-lg-5 pl-1 pl-lg-4 pl-md-2 pr-2 card4">
                                <div class="badge-detail-widget cursor-pointer text-center" id="platinum_participation_badge">
                                    <img src="${getLanguageBadge(language,'platinum',source, initiative)}" class="my-badge-image" id="platinum" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-0 text-capitalize badge-level-heading">${localeString[BADGES_NAME.platinum]}</h6>
                                </div>
                            </div>
    `
}

const renderCard = function (data, initiative, badge_color, source, language) {
  const moduleDetail = {
    bolo: {"text-type": "recordings"},
    suno: {"text-type": "Sentences"},
    likho: {"text-type": "Translations"},
    dekho: {"text-type": "image labels"}
  }

  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeLanguageStr = localeString[language];
  const localeTextTypeStr = localeString[moduleDetail[initiative]['text-type']];
  const localeSourceStr = localeString[source.charAt(0).toUpperCase() +  source.slice(1)];
  const initiativeName = INITIATIVES_NAME[initiative.toLocaleLowerCase()];

  const localeInitiativeStr = localeString[initiativeName];
  const localeBadgeColorStr = localeString[BADGES_NAME[badge_color.toLowerCase()]];

  const $selectedBadgeCardImg = $('.selected-badge-card img');
  $selectedBadgeCardImg.attr('src',getLanguageBadge(language,badge_color,source, initiative));
  const currentBadge = data.find((element) => element.badge.toLowerCase() === badge_color.toLowerCase());
  $('#participation-type').html(localeSourceStr);
  $('#milestone').html(currentBadge.contributions);
  $('#text-type').html(localeTextTypeStr.toLowerCase());
  $('#contribution-language').html(localeLanguageStr);
  $('#initiative-name').html(localeInitiativeStr);
  $('#badge-color').html(localeBadgeColorStr.charAt(0).toUpperCase() + localeBadgeColorStr.slice(1));
}

const renderBadgeDetails = function (data, source, type, initiative, language, badge_color) {
  const badgeLevels = getBadgeLevels(language, initiative, source)
  const $badgeLevelSection = $('.badge-level-section');
  $badgeLevelSection.html(badgeLevels);
  $('#bronze_participation_badge, #silver_participation_badge ,#gold_participation_badge, #platinum_participation_badge').off('click').on('click',(e)=>{
    $('.badge-level-section').find('.bg-white').removeClass('bg-white');
    $(e.currentTarget).addClass('bg-white');
    const badgeColor = e.currentTarget.id.replace('_participation_badge','');
    badgeLevel = e.currentTarget.id;
    renderCard(data, initiative, badgeColor, source, language);

  })
  selectBadgeLevel(badgeLevel);
  renderCard(data, initiative, badge_color, source, language);
}

const getBadgeData = (type, source, language,initiative,badge_color) => {
  performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then((data) => renderBadgeDetails(data, source, type,initiative, language,badge_color)).catch(console.log)
}

const initialise = () => {
  let initiative = 'suno';
  let selectedLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  let source = 'contribute';
  let badge_color = badgeLevel.replace('_participation_badge','');
  let type = localStorage.getItem("module");
  let initiativeValue = type === 'home' ? 'asr' : MODULE[type]["api-type"];

  if (type != 'home') {
    initiative = type;
    $("#initiative").find('.active').attr("aria-selected", false);
    $("#initiative").find('.active').removeClass('active');
    $("#initiative").find('a[id="' + type + '"]').attr("aria-selected", true);
    $("#initiative").find('a[id="' + type + '"]').addClass('active');
    source = localStorage.getItem('selectedType');
    $("#languages").find('option[value="' + selectedLanguage + '"]').attr("selected", "selected");
    $("#participation-radios").find('input[value="' + source + '"]').attr("checked", "checked");
  } else {
    const selectedOption = $("#languages").find('option[value="' + DEFAULT_CON_LANGUAGE + '"]');
    $(selectedOption).prop("selected", true);
    $(selectedOption).attr("selected", "selected");
    selectedLanguage = DEFAULT_CON_LANGUAGE;
  }

  getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  selectBadgeLevel(badgeLevel);

  $('#initiative').on('click', (e) => {
    initiative = e.target.id;
    initiativeValue = MODULE[e.target.id]["api-type"];
    badge_color = badgeLevel.replace('_participation_badge','');
    $("#initiative").find('.active').removeClass('active');
    $("#initiative").find('a[id="' + type + '"]').addClass('active');
    getBadgeData(initiativeValue, source, selectedLanguage, initiative,badge_color);
  });

  $('#languages').on('change', (e) => {
    selectedLanguage = e.target.value;
    badge_color = badgeLevel.replace('_participation_badge','');
    getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  });

  $('#participation-radios').on('change', (e) => {
    source = e.target.value;
    const selectedParticipation = document.querySelector(
      'input[name = "participation"]:checked'
    );

    if (selectedParticipation) selectedParticipation.checked = false;
    e.target.checked = true;
    badge_color = badgeLevel.replace('_participation_badge','');
    getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  })
}

$(document).ready(function () {
  getLocaleString().then(() => {
    initialise();
  }).catch(err => {
    console.log(err);
  })
  let moduleType = localStorage.getItem("module");
  const type = localStorage.getItem("selectedType");
  if (type && type == "validate" && moduleType != 'home') {
    $("#profile").addClass("active show");
    $("#home").removeClass("active show");
  } else {
    $("#profile").removeClass("active show");
    $("#home").addClass("active show");
  }

  const $sunoTab = $('#suno');
  const $boloTab = $('#bolo');
  const $likhoTab = $('#likho');
  const $dekhoTab = $('#dekho');

  $sunoTab.on('click', function () {
    const $tabBar = document.getElementById('initiative');
    sideScroll($tabBar,'left',25,100,10);
  });

  $boloTab.on('click', function () {
    const prev = $('.badge-detail-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('initiative');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $sunoTab[0].id ? 'right' :'left';
    sideScroll($tabBar,direction,25,160,10);
  });

  $likhoTab.on('click', function () {
    const prev = $('.badge-detail-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('initiative');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $dekhoTab[0].id ? 'left' :'right';
    sideScroll($tabBar,direction,25,160,10);
  });

  $dekhoTab.on('click', function () {
    const $tabBar = document.getElementById('initiative');
    sideScroll($tabBar,'right',25,100,10);
  });

  function sideScroll(element,direction,speed,distance,step){
    let scrollAmount = 0;
    const slideTimer = setInterval(function(){
      if(direction == 'left'){
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if(scrollAmount >= distance){
        window.clearInterval(slideTimer);
      }
    }, speed);
  }


  $('#back-btn').on('click', () => {
    if (moduleType == 'bolo') {
      location.href = './text/home.html';
    } else if (moduleType == 'suno') {
      location.href = './asr/home.html';
    } else if (moduleType == 'likho') {
      location.href = './parallel/home.html';
    } else if (moduleType == 'dekho') {
      location.href = './ocr/home.html';
    } else {
      location.href = './home.html';
    }
  })

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

module.exports = {renderCard, getBadgeLevels}