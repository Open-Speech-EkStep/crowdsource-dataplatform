const {ALL_LANGUAGES} = require('./constants')

const setLangNavBar = (targetedDiv, top_lang, $languageNavBar) => {
  const allDivs = $languageNavBar.children();
  let targetedDivIndex = -1
  allDivs.each(function (index, element) {
    if (element.getAttribute('value') === top_lang) {
      targetedDivIndex = index;
    }
  });

  const previousActiveDiv = $languageNavBar.find('.active');
  previousActiveDiv.removeClass('active');
  const $6th_place = document.getElementById('6th_option');
  const lang = ALL_LANGUAGES.find(ele => ele.value === top_lang);
  $6th_place.innerText = lang.text;
  if (targetedDivIndex < 0) {
    $6th_place.classList.remove('d-none');
    $6th_place.classList.add('active');
    $6th_place.setAttribute('value', top_lang);
  } else {
    allDivs[targetedDivIndex].classList.add('active');
    $6th_place.classList.remove('active');
    $6th_place.classList.add('d-none');
  }
}

module.exports = {setLangNavBar}