const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('./utils');
const {CONTRIBUTION_LANGUAGE, BADGES, LOCALE_STRINGS} = require('./constants');


const rowWithBadge = function (levelId, sentenceCount, badgeName, localeString) {
  const badge = BADGES[badgeName.toLowerCase()];
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${sentenceCount} ${localeString.Sentences}</td><td><div><img src=${badge.imgLg} class="table-img" alt=${badgeName}></div><span>${localeString[badgeName]}</span></td></tr>`
}

const rowWithoutBadge = function (levelId, sentenceCount, localeString) {
  return `<tr><td>${localeString.Level} ${levelId}</td><td>${sentenceCount} ${localeString.Sentences}</td><td>${localeString['N/A']}</td></tr>`
}

const getCard = function (badgeName, localeString) {
  const badge = BADGES[badgeName.toLowerCase()];
  return `<div class="col-12 col-lg-3 col-md-4 col-sm-6">
            <div class="card row text-center m-2">
                <div class="py-3">
                    <img src=${badge.imgLg} alt="bronze_badge">
                </div>
                <h3 class="py-3">${localeString[badgeName]}</h3>
            </div>
        </div>`
}

const renderBadgeDetails = function (data) {
  const $tableRows = $('#table-rows');
  const $cardRow = $('#card-row');
  const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  data.forEach((element, index) => {
    const {contributions, badge} = element;
    const rowId = index + 1;
    let row;
    if (badge) {
      const card = getCard(badge, localeString);
      $cardRow.append(card)
      row = rowWithBadge(rowId, contributions, badge, localeString);
    } else {
      row = rowWithoutBadge(rowId, contributions, localeString);
    }
    $tableRows.append(row);
  })
}

$(document).ready(function () {
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  if (language) {
    updateLocaleLanguagesDropdown(language);
  }

  getLocaleString().then(() => {
    performAPIRequest(`/rewards-info?language=${language}`).then(renderBadgeDetails).catch((err) => {
      console.log(err)
    })
  }).catch(()=>{
    window.location.href ="/";
  })
});