  const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('./utils');
const {CONTRIBUTION_LANGUAGE, BADGES, LOCALE_STRINGS} = require('./constants');


const rowWithBadge = function (levelId, sentenceCount, badgeName, localeString) {
  const badge = BADGES[badgeName.toLowerCase()];
  let badgeDescription = `<p class="text-left mb-0 ml-3">Recording: ${sentenceCount} ${localeString.Sentences}</p>`;
  if(badgeName == 'Bronze'){
    badgeDescription= `<p class="text-left mb-0 ml-3">Recording: ${sentenceCount} ${localeString.Sentences}</p>`
  }
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td><div><img src=${badge.imgLg} class="table-img" alt=${badgeName} id="${badgeName}-image-hover" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const rowWithoutBadge = function (levelId, sentenceCount, localeString) {
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${sentenceCount} ${localeString.Sentences}</td><td>${localeString['N/A']}</td></tr>`
}

const getCard = function (badgeName, localeString) {
  const badge = BADGES[badgeName.toLowerCase()];
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
    } else {
      row = rowWithoutBadge(rowId, contributions, localeString);
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
  const type='text'
  const source='contribute'
  updateLocaleLanguagesDropdown(language);
  getLocaleString().then(() => {
    performAPIRequest(`/rewards-info?type=${type}&source=${source}&language=${language}`).then(renderBadgeDetails).catch((err) => {
      console.log(err);
    })
  }).catch(() => {
    window.location.href = "/";
  })
});