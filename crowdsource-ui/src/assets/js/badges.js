  const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('./utils');
const {CONTRIBUTION_LANGUAGE, BOLOPAGE, LOCALE_STRINGS, ALL_LANGUAGES, DEKHOPAGE, LIKHOPAGE, SUNOPAGE,SPEAKER_DETAILS_KEY} = require('./constants');
const {onChangeUser, showUserProfile,onOpenUserDropDown} = require('./header');
const {hasUserRegistered} = require('./common');

const getRowWithBadge = function (levelId, sentenceCount, badgeName, localeString, type, source) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type =='asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  let text; 
  if (source == "contribute"){
     text = type == 'text' ? "Recording": type == 'ocr' ? "Labelling" : type == 'asr' ? "Transcribing" : "Translating";
   } else {
    text = "Validating";
   }
  let actionText = type == 'ocr' ? "Images": "Sentences";
  const badgeDescription = `<p class="text-left mb-0 ml-3">${text}: ${sentenceCount} ${actionText}</p>`;
  return `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td class="text-center"><div><img src=${source == "contribute" ? badge.imgLg :badge.imgSm} class="table-img" height="76" width="63" alt=${badgeName} id="${badgeName}_${source}" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const getCard = function (badgeName, localeString, type, source) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type =='asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  return `<div class="text-center">
                <div class="py-2">
                    <img src=${source == "contribute" ? badge.imgLg :badge.imgSm} alt="${badgeName.toLowerCase()}_badge" class="img-fluid">
                </div>
                <h3>${localeString[badgeName.toLowerCase()]}</h3>
            </div>`
}

const renderBadgeDetails = function (data, source, type) {
  const id = source == 'validate' ? 'validate-rows' : 'contribute-rows';
  document.getElementById(id).innerHTML = '';
  let $tableRows = source == 'validate' ? $('#validate-rows'):  $('#contribute-rows');
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  data.forEach((element, index) => {
    const {contributions, badge} = element;
    const rowId = index + 1;
    let row;
    if (badge) {
      row = getRowWithBadge(rowId, contributions, badge, localeString, type,source);
    }
    $tableRows.append(row);
    $(`#${badge}_${source}[rel=popover]`).popover({
      html: true,
      trigger: 'hover',
      placement: 'left',
      content: function () {
        return getCard(badge, localeString, type, source);
      }
    });
  });
}

const getBadgeData = (type, source, language) => {
  getLocaleString().then(() => {
    performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then((data) => renderBadgeDetails(data, source, type)).catch((err) => {})
  }).catch(() => {
    window.location.href = "/";
  })
}

const addToLanguage = function (id, list) {
  const selectBar = document.getElementById(id);
  let options = '';
  list.forEach(lang => {
    options = options.concat(`<option value=${lang.value}>${lang.text}</option>`);
  })
  selectBar.innerHTML = options;
}

const initialise = () => {
  let INITIATIVES = [
    {
      id: 1,
      value: "text",
      text: "Bolo India",
    },
    {
      id: 2,
      value: "ocr",
      text: "Dekho India",
    },
    {
      id: 3,
      value: "parallel",
      text: "Likho India",
    },
    {
      id: 4,
      value: "asr",
      text: "Suno India",
    }
  ];
  addToLanguage('languages', ALL_LANGUAGES);
  addToLanguage('initiative', INITIATIVES);
  let initiative;
  let selectedLanguage;

  let type = localStorage.getItem("module");
  let value = type ==  'bolo' ? 'text' : type  == 'likho' ? "parallel" : type == "dekho" ? "ocr" : type == "suno" ? 'asr' : 'home';

  if(value != 'home') {
    $("#initiative").find('option[value="' + value + '"]').attr("selected", "selected");
    $("#languages").find('option[value="' + localStorage.getItem(CONTRIBUTION_LANGUAGE) + '"]').attr("selected", "selected");
    initiative = $('#initiative').find('option[value="' + value + '"]').val();
    selectedLanguage = $('#languages').find('option[value="' + localStorage.getItem(CONTRIBUTION_LANGUAGE) + '"]').val();
  }else{
    initiative = $('#initiative option:first-child').val();
    selectedLanguage = $('#languages option:first-child').val();
    $('#initiative option:first-child').attr("selected", "selected");
    $('#languages option:first-child').attr("selected", "selected");
  }
  
  getBadgeData(initiative, 'contribute', selectedLanguage);
  getBadgeData(initiative, 'validate', selectedLanguage);
  $('#initiative').on('change', (e) => {
    initiative = e.target.value;
    getBadgeData(initiative, 'contribute', selectedLanguage);
    getBadgeData(initiative, 'validate', selectedLanguage);
  });

  $('#languages').on('change', (e) => {
    selectedLanguage = e.target.value;
    getBadgeData(initiative, 'contribute', selectedLanguage);
    getBadgeData(initiative, 'validate', selectedLanguage);
  });
}

$(document).ready(function () {
  initialise();
  let moduleType = localStorage.getItem("module");
  const type = localStorage.getItem("selectedType");
  if(type && type == "validate" && moduleType != 'home'){
    $("#contribute-tab").removeClass("active");
    $("#validate-tab").addClass("active");
    $("#profile").addClass("active show");
    $("#home").removeClass("active show");
  }else{
    $("#contribute-tab").addClass("active");
    $("#validate-tab").removeClass("active");
    $("#profile").removeClass("active show");
    $("#home").addClass("active show");
  }

  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  }
  onChangeUser('./badges.html',moduleType);
  onOpenUserDropDown();
 
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
});

module.exports = {getRowWithBadge, getCard }