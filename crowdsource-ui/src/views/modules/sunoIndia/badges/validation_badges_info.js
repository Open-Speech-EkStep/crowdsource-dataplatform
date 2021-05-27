const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, LOCALE_STRINGS, MODULE, CURRENT_MODULE} = require('../common/constants');


const rowWithBadge = function (levelId, sentenceCount, badgeName, localeString) {
  const currentModule = localStorage.getItem(CURRENT_MODULE);
  const badges = MODULE[currentModule].BADGES;
  const badge = badges[badgeName.toLowerCase()];
  let badgeDescription = `<p class="text-left mb-0 ml-3">Validating: ${sentenceCount} ${localeString.Sentences}</p>`;
  if(badgeName == 'Bronze'){
    badgeDescription= `<p class="text-left mb-0 ml-3">Validating: ${sentenceCount} ${localeString.Sentences}</p>`
  }
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td><div><img src=${badge.imgValSvg} class="table-img" alt=${badgeName} id="${badgeName}-image-hover" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const getCard = function (badgeName, localeString) {
  const currentModule = localStorage.getItem(CURRENT_MODULE);
  const badges = MODULE[currentModule].BADGES;
  const badge = badges[badgeName.toLowerCase()];
  return `<div class="text-center">
                <div class="py-2">
                    <img src=${badge.imgValSvg} alt="bronze_badge" class="img-fluid">
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
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  const type='asr'
  const source='validate'
  updateLocaleLanguagesDropdown(language);
  getLocaleString().then(() => {
    performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then(renderBadgeDetails).catch((err) => {
      console.log(err);
    })
  }).catch(() => {
    window.location.href = "./home.html";
  })
});