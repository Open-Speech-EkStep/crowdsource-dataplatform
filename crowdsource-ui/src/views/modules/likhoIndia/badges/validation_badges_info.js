const {
  performAPIRequest,
  getLocaleString,
} = require('../common/utils');
const {LIKHO_FROM_LANGUAGE,LIKHO_TO_LANGUAGE, LOCALE_STRINGS, MODULE, CURRENT_MODULE,ALL_LANGUAGES} = require('../common/constants');

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  const invalidToLang = toLanguage.toLowerCase() === "english" || toLang.hasLocaleText === false;
  const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  if (invalidToLang && invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else if (invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  } else if (invalidToLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else if (toLanguage.toLowerCase() === language.toLowerCase()){
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
        <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  }
}


const rowWithBadge = function (levelId, sentenceCount, badgeName, localeString) {
  const currentModule = localStorage.getItem(CURRENT_MODULE);
  const badges = MODULE[currentModule].BADGES;
  const badge = badges[badgeName.toLowerCase()];
  let badgeDescription = `<p class="text-left mb-0 ml-3">Validating: ${sentenceCount} ${localeString.Sentences}</p>`;
  if(badgeName == 'Bronze'){
    badgeDescription= `<p class="text-left mb-0 ml-3">Validating: ${sentenceCount} ${localeString.Sentences}</p>`
  }
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td><div><img src=${badge.imgLg} class="table-img" alt=${badgeName} id="${badgeName}-image-hover" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const getCard = function (badgeName, localeString) {
  const currentModule = localStorage.getItem(CURRENT_MODULE);
  const badges = MODULE[currentModule].BADGES;
  const badge = badges[badgeName.toLowerCase()];
  return `<div class="text-center">
                <div class="py-2">
                    <img src=${badge.imgLg} alt="bronze_badge" class="img-fluid">
                </div>
                <h3>${localeString[badgeName.toLowerCase()]}</h3>
            </div>`

}

const renderBadgeDetails = function (data) {
  const $tableRows = $('#table-rows');
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  data.forEach((element, index) => {
    const {contributions, badge} = element;
    const rowId = index + 1;
    let row;
    if (badge) {
      row = rowWithBadge(rowId, contributions, badge, localeString);
    }
    $tableRows.append(row);
    $(`#${badge}-image-hover[rel=popover]`).popover({
      html: true,
      trigger: 'hover',
      placement: 'left',
      content: function () {
        return getCard(badge, localeString);
      }
    });
  })
}

$(document).ready(function () {
  const fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE) || 'english';
  const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE) || 'hindi';
  const type='parallel'
  const source='validate'
  updateLocaleLanguagesDropdown(fromLanguage,toLanguage);
  getLocaleString().then(() => {
    performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${fromLanguage}`).then(renderBadgeDetails).catch((err) => {
      console.log(err);
    })
  }).catch(() => {
    window.location.href = "./home.html";
  })
});