  const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('./utils');
const {CONTRIBUTION_LANGUAGE, BOLOPAGE, LOCALE_STRINGS, DEKHOPAGE, LIKHOPAGE, SUNOPAGE,SPEAKER_DETAILS_KEY,MODULE, DEFAULT_CON_LANGUAGE} = require('./constants');
const {onChangeUser, showUserProfile,onOpenUserDropDown} = require('./header');
const {hasUserRegistered} = require('./common');

  const getWidgetWithBadge = (imgPath, badgeType, initiativeType, type, localeString, language) => {
    return `
  <div class="badge-widget cursor-pointer text-center" id="${badgeType}_${type}_${initiativeType}_${language}_badge">
  <img src=${imgPath} class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover" >
  <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString[badgeType]}</h6>
</div>`
  }

const getRowWithBadge = function (levelId, sentenceCount, badgeName, localeString, type, source) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type =='asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  let text; 
  if (source == "contribute"){
     text = type == 'text' ? "Recording": type == 'ocr' ? "Labelling" : type == 'asr' ? "Transcribing" : "Translating";
   } else {
    text = "Validating";
   }
  let actionText = type == 'ocr' ? "Images": "Sentences";
  const badgeDescription = `<p class="text-left mb-0 ml-3">${localeString[text]}: ${sentenceCount} ${localeString[actionText]}</p>`;
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
  let $tableRows = $('#myTab');
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  data.forEach((element) => {
    const { badge} = element;
    let row;
    if (badge) {
      row = getWidgetWithBadge("/img/bolo_bronze_medal.svg", "Bronze", "bolo", "validate", localeString, "english");
    }

    console.log(row)
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
  performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then((data) => renderBadgeDetails(data, source, type)).catch(() => {})
}

const initialise = () => {
  let initiative = 'home';
  let selectedLanguage = DEFAULT_CON_LANGUAGE;
  let source = 'contribute'
  let type = localStorage.getItem("module");
  let value = type === 'home' ? 'home' : MODULE[type]["api-type"];
  console.log(type, value, "_______");

  if(value != 'home') {
    // $("#initiative").find('option[value="' + value + '"]').attr("selected", "selected");
    $("#languages").find('option[value="' + localStorage.getItem(CONTRIBUTION_LANGUAGE) + '"]').attr("selected", "selected");
    console.log(MODULE, type)
    initiative= type;
    source = localStorage.getItem('selectedType');
    selectedLanguage = $('#languages').find('option[value="' + localStorage.getItem(CONTRIBUTION_LANGUAGE) + '"]').val();
  } else {
    $("#languages").find('option[value="' + DEFAULT_CON_LANGUAGE + '"]').attr("selected", "selected");
    selectedLanguage = $('#languages').find('option[value="' + DEFAULT_CON_LANGUAGE + '"]').val();
  }
  
  // getBadgeData(initiative, source, selectedLanguage);
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

  $('#participation-radios').on('change',(e)=>{
    source = e.target.value;
    console.log(source);
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

  $('#back-btn').on('click',()=>{
      if(moduleType == 'bolo'){
        location.href = './boloIndia/home.html';
      } else if(moduleType == 'suno'){
        location.href = './sunoIndia/home.html';
      }else if(moduleType == 'likho'){
        location.href = './likhoIndia/home.html';
      }else if(moduleType == 'dekho'){
        location.href = './dekhoIndia/home.html';
      }else {
        location.href = './home.html';
      }
  })

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