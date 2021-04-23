const {LOCALE_STRINGS,AGGREGATED_DATA_BY_LANGUAGE}=require('../js/constants');

const $say = $('#say');
const $listen = $('#listen');
const $listen_p_2 = $('#listen-p-2');
const $say_p_2 = $('#say-p-2');
const $say_container = $('#say_container');
const $listen_container = $('#listen_container');


const updateLocaleText = function (total_contributions, total_validations, language) {
  const $say_p_3 = $("#say-p-3");
  const $listen_p_3 = $("#listen-p-3");
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  let hrsRecordedIn = localeStrings['hrs recorded in'];
  hrsRecordedIn = hrsRecordedIn.replace("%hours", total_contributions);
  hrsRecordedIn = hrsRecordedIn.replace("%language", language);
  $say_p_3.text(hrsRecordedIn);

  let hrsValidatedIn = localeStrings['hrs validated in'];
  hrsValidatedIn = hrsValidatedIn.replace("%hours", total_validations);
  hrsValidatedIn = hrsValidatedIn.replace("%language", language);
  $listen_p_3.text(hrsValidatedIn);
}

function updateHrsForSayAndListen(language) {
  const $sayLoader = $('#say-loader');
  const $listenLoader = $('#listen-loader');
  $sayLoader.removeClass('d-none');
  $listenLoader.removeClass('d-none');
  const aggregateDetails = JSON.parse(localStorage.getItem(AGGREGATED_DATA_BY_LANGUAGE));
  const totalInfo = aggregateDetails && aggregateDetails.find((element) => element.language === language);
  if (totalInfo) {
    updateLocaleText(totalInfo.total_contributions, totalInfo.total_validations, language);
  } else {
    updateLocaleText(0, 0, language);
  }
  $sayLoader.addClass('d-none');
  $listenLoader.addClass('d-none');
}

const setSayListenBackground = function (){
  const $say = $("#say");
  const $listen = $("#listen");
  const $sayWidth = $say.outerWidth( true);
  const $listenWidth = $listen.outerWidth(true);
  const totalWidth = $sayWidth + $listenWidth;
  $say.css("background-size",`${totalWidth}px auto`);
  $listen.css("background-size",`${totalWidth}px auto`);
}

$(window).on("orientationchange",function(){
  setSayListenBackground();
});

setSayListenBackground();

$say.hover(() => {
  $say.removeClass('col-lg-5');
  $listen.removeClass('col-lg-5');
  $say.addClass('col-lg-6');
  $listen.addClass('col-lg-4');
  $say.removeClass('col-md-5');
  $listen.removeClass('col-md-5');
  $say.addClass('col-md-6');
  $listen.addClass('col-md-4');
  $say_p_2.removeClass('d-none');
  $say_container.addClass('say-active');
}, () => {
  $say.removeClass('col-lg-6');
  $listen.removeClass('col-lg-4');
  $say.addClass('col-lg-5');
  $listen.addClass('col-lg-5');
  $say.removeClass('col-md-6');
  $listen.removeClass('col-md-4');
  $say.addClass('col-md-5');
  $listen.addClass('col-md-5');
  $say_p_2.addClass('d-none');
  $say_container.removeClass('say-active');
});

$listen.hover(() => {
  $say.removeClass('col-lg-5');
  $listen.removeClass('col-lg-5');
  $listen.addClass('col-lg-6');
  $say.addClass('col-lg-4');
  $listen_p_2.removeClass('d-none');
  $listen_container.addClass('listen-active');
}, () => {
  $say.removeClass('col-lg-4');
  $listen.removeClass('col-lg-6');
  $say.addClass('col-lg-5');
  $listen.addClass('col-lg-5');
  $listen_p_2.addClass('d-none');
  $listen_container.removeClass('listen-active');
});

module.exports = {updateHrsForSayAndListen}
