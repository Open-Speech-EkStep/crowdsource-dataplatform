  const {
  performAPIRequest,
  getLocaleString,
  updateLocaleLanguagesDropdown
} = require('./utils');
const {CONTRIBUTION_LANGUAGE, BOLOPAGE, LOCALE_STRINGS, ALL_LANGUAGES, DEKHOPAGE, LIKHOPAGE, SUNOPAGE} = require('./constants');


const rowWithBadge = function (levelId, sentenceCount, badgeName, localeString, type) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type =='asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  let badgeDescription = `<p class="text-left mb-0 ml-3">Recording: ${sentenceCount} ${localeString.Sentences}</p>`;
  if(badgeName == 'Bronze'){
    badgeDescription= `<p class="text-left mb-0 ml-3">Recording: ${sentenceCount} ${localeString.Sentences}</p>`
  }
  return `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-4">${localeString.Level} ${levelId}</td><td>${badgeDescription}</td><td class="text-center"><div><img src=${badge.imgLg} class="table-img" height="76" width="63" alt=${badgeName} id="${badgeName}-image-hover" rel="popover"></div><span>${localeString[badgeName.toLowerCase()]}</span></td></tr>`
}

const rowWithoutBadge = function (levelId, sentenceCount, localeString) {
  return `<tr id="level"><td>${localeString.Level} ${levelId}</td><td>${sentenceCount} ${localeString.Sentences}</td><td>${localeString['N/A']}</td></tr>`
}

const getCard = function (badgeName, localeString, type) {
  const badge = type == 'text' ? BOLOPAGE[badgeName.toLowerCase()] : type == 'ocr' ? DEKHOPAGE[badgeName.toLowerCase()] : type =='asr' ? SUNOPAGE[badgeName.toLowerCase()] : LIKHOPAGE[badgeName.toLowerCase()];
  return `<div class="text-center">
                <div class="py-2">
                    <img src=${badge.imgLg} alt="bronze_badge" class="img-fluid">
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
      row = rowWithBadge(rowId, contributions, badge, localeString, type);
    } else {
      row = rowWithoutBadge(rowId, contributions, localeString, type);
    }
    $tableRows.append(row);
    $(`#${badge}-image-hover[rel=popover]`).popover({
      html: true,
      trigger: 'hover',
      placement: 'left',
      content: function () {
        return getCard(badge, localeString, type);
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
      text: "Bolo India"
    },
    {
      id: 2,
      value: "ocr",
      text: "Dekho India"
    },
    {
      id: 3,
      value: "parallel",
      text: "Likho India"
    },
    {
      id: 4,
      value: "asr",
      text: "Suno India"
    }
  ];
  addToLanguage('languages', ALL_LANGUAGES);
  addToLanguage('initiative', INITIATIVES);
  let initiative = $('#initiative option:first-child').val();
  console.log(initiative);
  let selectedLanguage = $('#languages option:first-child').val();
  getBadgeData(initiative, 'contribute', selectedLanguage);
  getBadgeData(initiative, 'validate', selectedLanguage);
  $('#initiative option:first-child').attr("selected", "selected");
  $('#languages option:first-child').attr("selected", "selected");
  $('#initiative').on('change', (e) => {
    initiative = e.target.value;
    getBadgeData(initiative, 'contribute', selectedLanguage);
    getBadgeData(initiative, 'validate', selectedLanguage);
  });

  $('#languages').on('change', (e) => {
    selectedLanguage = e.target.value;
    console.log(selectedLanguage);
    getBadgeData(initiative, 'contribute', selectedLanguage);
    getBadgeData(initiative, 'validate', selectedLanguage);
  });
}

$(document).ready(function () {
  initialise();
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
});