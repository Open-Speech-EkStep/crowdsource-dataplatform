const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown,
  getLanguageBadge
} = require('./utils');
const {
  CONTRIBUTION_LANGUAGE,
  BOLOPAGE,
  LOCALE_STRINGS,
  DEKHOPAGE,
  LIKHOPAGE,
  SUNOPAGE,
  SPEAKER_DETAILS_KEY,
  MODULE,
  DEFAULT_CON_LANGUAGE
} = require('./constants');
const {onChangeUser, showUserProfile, onOpenUserDropDown} = require('./header');
const {hasUserRegistered} = require('./common');

const getRowWithBadge = function (levelId, sentenceCount, badgeName, localeString, type, source) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type == 'asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  let text;
  if (source == "contribute") {
    text = type == 'text' ? "Recording" : type == 'ocr' ? "Labelling" : type == 'asr' ? "Transcribing" : "Translating";
  } else {
    text = "Validating";
  }
  let actionText = type == 'ocr' ? "Images" : "Sentences";
  const badgeDescription = `<p class="text-left mb-0 ml-3">${localeString[text]}: ${sentenceCount} ${localeString[actionText]}</p>`;
  return `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td class="text-center"><div><img src=${source == "contribute" ? badge.imgLg : badge.imgSm} class="table-img" height="76" width="63" alt=${badgeName} id="${badgeName}_${source}" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const getCard = function (badgeName, localeString, type, source) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type == 'asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  return `<div class="text-center">
                <div class="py-2">
                    <img src=${source == "contribute" ? badge.imgLg : badge.imgSm} alt="${badgeName.toLowerCase()}_badge" class="img-fluid">
                </div>
                <h3>${localeString[badgeName.toLowerCase()]}</h3>
            </div>`
}

const getBadgeLevels = function (language, initiative, source) {
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  return `
    <div class="col-3 pl-lg-2 pr-lg-5 pl-0">
                                <div class="badge-widget cursor-pointer text-center bg-white" id="bronze_participation_badge">
                                    <img src="${getLanguageBadge(language,'bronze',source, initiative)}" class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString.bronze}</h6>
                                </div>
                            </div>
                            <div class="col-3 pl-lg-2 pr-lg-5 pl-0">
                                <div class="badge-widget cursor-pointer text-center bg-white" id="silver_participation_badge">
                                    <img src="${getLanguageBadge(language,'silver',source, initiative)}" class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString.silver}</h6>
                                </div>
                            </div>
                            <div class="col-3 pl-lg-2 pr-lg-5 pl-0">
                                <div class="badge-widget cursor-pointer text-center bg-white" id="gold_participation_badge">
                                    <img src="${getLanguageBadge(language,'gold',source, initiative)}" class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString.gold}</h6>
                                </div>
                            </div>
                            <div class="col-3 pl-lg-2 pr-lg-5 pl-0">
                                <div class="badge-widget cursor-pointer text-center bg-white" id="platinum_participation_badge">
                                    <img src="${getLanguageBadge(language,'platinum',source, initiative)}" class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover">
                                    <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString.platinum}</h6>
                                </div>
                            </div>
    `
}

const renderCard = function (data, initiative, badge_color, source, language) {
  const moduleDetail = {
    bolo: {"text-type": "recording(s)"},
    suno: {"text-type": "sentence(s)"},
    likho: {"text-type": "translation(s)"},
    dekho: {"text-type": "image label(s)"}
  }


  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeLanguageStr = localeString[language];
  const localeInitiativeStr = initiative[`${initiative.charAt(0).toUpperCase() +  initiative.slice(1)} India}`];

  const $selectedBadgeCardImg = $('.selected-badge-card img');
  $selectedBadgeCardImg.attr('src',getLanguageBadge(language,badge_color,source, initiative));
  const currentBadge = data.find((element) => element.badge.toLowerCase() === badge_color.toLowerCase());
  $('#participation-type').html(source.charAt(0).toUpperCase() + source.slice(1));
  $('#milestone').html(currentBadge.contributions);
  $('#text-type').html(moduleDetail[initiative]['text-type']);
  $('#contribution-language').html(localeLanguageStr);
  $('#initiative-name').html(localeInitiativeStr);
}

const renderBadgeDetails = function (data, source, type, initiative, language, badge_color) {
  const badgeLevels = getBadgeLevels(language, initiative, source)
  const $badgeLevelSection = $('.badge-level-section');
  $badgeLevelSection.html(badgeLevels);
  renderCard(data, initiative, badge_color, source, language);
}

const getBadgeData = (type, source, language,initiative,badge_color) => {
  performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then((data) => renderBadgeDetails(data, source, type,initiative, language,badge_color)).catch(console.log)
}

const initialise = () => {
  let initiative = 'suno';
  let selectedLanguage = DEFAULT_CON_LANGUAGE;
  let source = 'contribute';
  let badge_color = 'bronze';
  let type = localStorage.getItem("module");
  let initiativeValue = type === 'home' ? 'asr' : MODULE[type]["api-type"];

  if (initiativeValue != 'home') {
    $("#initiative").find('a[value="' + type + '"]').attr("aria-selected", true);
    // initiativeValue = type;
    source = localStorage.getItem('selectedType');
    selectedLanguage = $('#languages').find('option[value="' + localStorage.getItem(CONTRIBUTION_LANGUAGE) + '"]').val();
  } else {
    $("#languages").find('option[value="' + DEFAULT_CON_LANGUAGE + '"]').attr("selected", "selected");
    selectedLanguage = $('#languages').find('option[value="' + DEFAULT_CON_LANGUAGE + '"]').val();
  }

  getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  $('#initiative').on('click', (e) => {
    initiative = e.target.id;
    initiativeValue = MODULE[e.target.id]["api-type"];
    getBadgeData(initiativeValue, source, selectedLanguage, initiative,badge_color);
  });

  $('#languages').on('change', (e) => {
    selectedLanguage = e.target.value;
    getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  });

  $('.badge-widget').off('click').on('click',()=>{
    getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  })

  $('#participation-radios').on('change', (e) => {

    source = e.target.value;
    const selectedParticipation = document.querySelector(
      'input[name = "participation"]:checked'
    );

    if (selectedParticipation) selectedParticipation.checked = false;
    e.target.checked = true;
    getBadgeData(initiativeValue, source, selectedLanguage,initiative,badge_color);
  })
}

$(document).ready(function () {
  getLocaleString().then(() => {
    initialise();
  }).catch((e) => {
    alert(e)
    window.location.href = "/";
  })
  let moduleType = localStorage.getItem("module");
  const type = localStorage.getItem("selectedType");
  if (type && type == "validate" && moduleType != 'home') {
    $("#contribute-tab").removeClass("active");
    $("#validate-tab").addClass("active");
    $("#profile").addClass("active show");
    $("#home").removeClass("active show");
  } else {
    $("#contribute-tab").addClass("active");
    $("#validate-tab").removeClass("active");
    $("#profile").removeClass("active show");
    $("#home").addClass("active show");
  }

  $('#back-btn').on('click', () => {
    if (moduleType == 'bolo') {
      location.href = './boloIndia/home.html';
    } else if (moduleType == 'suno') {
      location.href = './sunoIndia/home.html';
    } else if (moduleType == 'likho') {
      location.href = './likhoIndia/home.html';
    } else if (moduleType == 'dekho') {
      location.href = './dekhoIndia/home.html';
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

module.exports = {getRowWithBadge, getCard}