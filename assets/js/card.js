const {LOCALE_STRINGS,AGGREGATED_DATA_BY_LANGUAGE}=require('../js/constants');

const $left = $('#left');
const $right = $('#right');
const $right_p_2 = $('#right-p-2');
const $left_p_2 = $('#left-p-2');
const $left_container = $('#left_container');
const $right_container = $('#right_container');


const updateLocaleText = function (total_contributions, total_validations, language) {
  const $left_p_3 = $("#left-p-3");
  const $right_p_3 = $("#right-p-3");
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  let hrsRecordedIn = localeStrings['hrs recorded in'];
  hrsRecordedIn = hrsRecordedIn.replace("%hours", total_contributions);
  hrsRecordedIn = hrsRecordedIn.replace("%language", language);
  $left_p_3.text(hrsRecordedIn);

  let hrsValidatedIn = localeStrings['hrs validated in'];
  hrsValidatedIn = hrsValidatedIn.replace("%hours", total_validations);
  hrsValidatedIn = hrsValidatedIn.replace("%language", language);
  $right_p_3.text(hrsValidatedIn);
}

function updateHrsForCards(language) {
  const $leftLoader = $('#left-loader');
  const $rightLoader = $('#right-loader');
  $leftLoader.removeClass('d-none');
  $rightLoader.removeClass('d-none');
  const aggregateDetails = JSON.parse(localStorage.getItem(AGGREGATED_DATA_BY_LANGUAGE));
  const totalInfo = aggregateDetails && aggregateDetails.find((element) => element.language === language);
  if (totalInfo) {
    updateLocaleText(totalInfo.total_contributions, totalInfo.total_validations, language);
  } else {
    updateLocaleText(0, 0, language);
  }
  $leftLoader.addClass('d-none');
  $rightLoader.addClass('d-none');
}

const setCardsBackground = function (){
  const $left = $("#left");
  const $right = $("#right");
  const $leftWidth = $left.outerWidth( true);
  const $rightWidth = $right.outerWidth(true);
  const totalWidth = $leftWidth + $rightWidth;
  $left.css("background-size",`${totalWidth}px auto`);
  $right.css("background-size",`${totalWidth}px auto`);
}

$(window).on("orientationchange",function(){
  setCardsBackground();
});

setCardsBackground();

$left.hover(() => {
  $left.removeClass('col-lg-5');
  $right.removeClass('col-lg-5');
  $left.addClass('col-lg-6');
  $right.addClass('col-lg-4');
  $left.removeClass('col-md-5');
  $right.removeClass('col-md-5');
  $left.addClass('col-md-6');
  $right.addClass('col-md-4');
  $left_p_2.removeClass('d-none');
  $left_container.addClass('left-active');
}, () => {
  $left.removeClass('col-lg-6');
  $right.removeClass('col-lg-4');
  $left.addClass('col-lg-5');
  $right.addClass('col-lg-5');
  $left.removeClass('col-md-6');
  $right.removeClass('col-md-4');
  $left.addClass('col-md-5');
  $right.addClass('col-md-5');
  $left_p_2.addClass('d-none');
  $left_container.removeClass('left-active');
});

$right.hover(() => {
  $left.removeClass('col-lg-5');
  $right.removeClass('col-lg-5');
  $right.addClass('col-lg-6');
  $left.addClass('col-lg-4');
  $right_p_2.removeClass('d-none');
  $right_container.addClass('right-active');
}, () => {
  $left.removeClass('col-lg-4');
  $right.removeClass('col-lg-6');
  $left.addClass('col-lg-5');
  $right.addClass('col-lg-5');
  $right_p_2.addClass('d-none');
  $right_container.removeClass('right-active');
});

module.exports = {updateHrsForCards}
