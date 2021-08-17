const { HOUR_IN_SECONDS, SIXTY, ALL_LANGUAGES, CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE, ErrorStatusCode } = require("./constants");
const fetch = require('./fetch')
const platform = require('./platform');


function getDeviceInfo() {
  const os = platform.os;
  let info = "";
  if (os.family) {
    info = info + os.family;
  }
  if (os.version) {
    info = info + " " + os.version;
  }
  if (platform.product) {
    info = info + " " + platform.product;
  }
  return info.trim();
}

function getBrowserInfo() {
  let info = "";
  if (platform.name) {
    info = info + platform.name;
  }
  if (platform.version) {
    info = info + " " + platform.version;
  }
  return info.trim();
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function showElement(element) {
  element.removeClass('d-none');
}

function hideElement(element) {
  element.addClass('d-none');
}

function convertPXToVH(px) {
  return px * (100 / document.documentElement.clientHeight);
}

function setPageContentHeight() {
  const $footer = $('footer');
  const $nav = $('.navbar');
  const edgeHeightInPixel = $footer.outerHeight() + $nav.outerHeight()
  const contentHeightInVH = 100 - convertPXToVH(edgeHeightInPixel)
  $('#content-wrapper').css('min-height', contentHeightInVH + 'vh');
}

function toggleFooterPosition() {
  // const $footer = $('footer');
  // $footer.toggleClass('fixed-bottom')
  // $footer.toggleClass('bottom')
}

const safeJson = (res) => {
  if (!res) return res;
  if (typeof res.json === "function") return res.json();
  return res;
}

const safeJsonParse = (value, fallBack = {}) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallBack;
  }
}

function fetchLocationInfo() {
  //https://api.ipify.org/?format=json
  let regionName = localStorage.getItem("state_region") || "NOT_PRESENT";
  let countryName = localStorage.getItem("country") || "NOT_PRESENT";
  if (regionName !== "NOT_PRESENT" && countryName !== "NOT_PRESENT" && regionName.length > 0 && countryName.length > 0) {
    return new Promise((resolve) => {
      resolve({ "regionName": regionName, "country": countryName })
    })
  }
  return fetch('https://www.cloudflare.com/cdn-cgi/trace').then(res => res.text()).then(ipAddressText => {
    const dataArray = ipAddressText.split('\n');
    let ipAddress = "";
    for (let ind in dataArray) {
      if (dataArray[ind].startsWith("ip=")) {
        ipAddress = dataArray[ind].replace('ip=', '');
        break;
      }
    }
    if (ipAddress.length !== 0) {
      return fetch(`/location-info?ip=${ipAddress}`);
    } else {
      return new Promise((resolve, reject) => {
        reject("Ip Address not available")
      })
    }
  });
}

const showErrorPopup = (status = 500) => {
  const text = getErrorText(status);
  bindErrorText(text);
  const $errorDialog = $('#errorPopup');
  $errorDialog.modal('show');
}

const getErrorText = (status) => {
  const errorText = status === ErrorStatusCode.SERVICE_UNAVAILABLE ?
    translate("We are processing multiple requests at the moment. Please try again after sometime.")
    : translate("An unexpected error has occurred.");
  return errorText;
}

const bindErrorText = (text) => {
  const $errorText = $("#error-text");
  $errorText.text(text);
}

const performAPIRequest = (url) => {
  return fetch(url, {
    credentials: 'include',
    mode: 'cors'
  }).then((data) => {
    if (!data.ok) {
      throw (data.status || 500);
    } else {
      return Promise.resolve(data.json());
    }
  })
  .catch(errStatus => {
    showErrorPopup(errStatus);
    throw errStatus
  });
}

const getLocaleString = function () {
  return new Promise(function (resolve, reject) {
    const locale = sessionStorage.getItem("i18n") ?? "en";
    performAPIRequest(`/get-locale-strings/${locale}`)
      .then((response) => {
        if (response) {
          localStorage.setItem('localeString', JSON.stringify(response));
          resolve(response);
        }
      }).catch((err) => { reject(err) });
  });
}

const updateLocaleLanguagesDropdown = (language) => {
  const dropDown = $('#localisation_dropdown');
  language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
  const localeLang = ALL_LANGUAGES.find(ele => ele.value.toLowerCase() === language.toLowerCase());
  if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
    dropDown.html('<a id="english" class="dropdown-item d-flex align-items-center py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>');
  } else {
    dropDown.html(`<a id="english" class="dropdown-item py-3 py-md-2 py-lg-2" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item d-flex align-items-center py-3 py-md-2 py-lg-2" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }
}

const calculateTime = function (totalSeconds, isSeconds = true) {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.round(remainingAfterHours % SIXTY);
  if (isSeconds) {
    return { hours, minutes, seconds };
  } else {
    return { hours, minutes };
  }
};

const translate = function (string) {
  const localeStrings = JSON.parse(localStorage.getItem('localeString'));
  return localeStrings[string] || string;
}

const formatTime = function (hours, minutes = 0, seconds = 0, translate = true) {
  const localeStrings = JSON.parse(localStorage.getItem('localeString') || "{}");
  const hrStr = translate ? localeStrings['hour(s)'] || 'hour(s)' : 'hour(s)';
  const minStr = translate ? localeStrings['minute(s)'] || 'minute(s)' : 'minute(s)';
  const secStr = translate ? localeStrings['second(s)'] || 'second(s)' : 'second(s)';
  let result = "";
  if (hours > 0) {
    result += `${hours} ${hrStr} `;
  }
  if (minutes > 0) {
    result += `${minutes} ${minStr} `;
  }
  if (hours === 0 && minutes === 0 && seconds > 0) {
    result += `${seconds} ${secStr} `;
  }

  if (hours === 0 && minutes === 0 && seconds === 0) {
    result += `0 ${secStr} `;
  }

  if (result.charAt(result.length - 1) !== ' ')
    return result.substr(0, result.length);
  else
    return result.substr(0, result.length - 1);
};

const formatTimeForLegends = function (hours, minutes = 0, seconds = 0, isLabelRequired = true) {
  const localsStrings = JSON.parse(localStorage.getItem('localeString'));
  const hrStr = localsStrings['hours'];
  const minStr = localsStrings['minutes'];
  const secStr = localsStrings['seconds'];
  if (hours && minutes) {
    return isLabelRequired ? `${hours}.${minutes} ${hrStr}` : `${hours}.${minutes}`;
  }
  if (hours == 0 && minutes == 0) {
    return isLabelRequired ? `${seconds} ${secStr}` : `${seconds}`;
  }
  const hoursStr = hours ? (isLabelRequired ? `${hours} ${hrStr}` : `${hours}`) : '';
  const minutesStr = minutes ? (isLabelRequired ? `${minutes} ${minStr}` : `${minutes}`) : '';
  return `${hoursStr} ${minutesStr}`.trim();
}

const setFooterPosition = () => {
  const contentHeight = $('#page-content').outerHeight();
  const bodyHeight = $('body').outerHeight();
  const navHeight = $('nav').outerHeight();
  const footerHeight = $('footer').outerHeight();
  const totalHeight = contentHeight + navHeight + footerHeight;
  if (bodyHeight <= totalHeight) {
    $('footer').removeClass('fixed-bottom').addClass('bottom');
  }
}

const reportSentenceOrRecording = (reqObj) => {
  return new Promise(function (resolve, reject) {
    try {
      fetch('/report', {
        method: "POST",
        credentials: 'include',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      })
        .then((res) => res.json())
        .then((resp) => {
          resolve(resp);
        })
    } catch (err) {
      reject(err);
    }
  });
}

const getJson = (path) => {
    return new Promise((resolve) => {
      $.getJSON(path, (data) => {
        resolve(data);
      }).fail((e) => {
        if(e && e.statusText !== "error") {
          showErrorModal();
        }
      });
    })
}

const covertStringToCapitalised = (tempStr) => {
  if (tempStr) {
    return tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
  } else {
    return tempStr;
  }
}

const showErrorModal = () => {
  const $errorText = $("#error-text");
  $errorText.text("");
  $errorText.text(translate("An unexpected error has occurred."));
  const $errorDialog = $('#errorPopup');
  $errorDialog.modal('show');
}

const getLanguageBadge = (contibutedLanguage, badgeType, source, initiativeType) => {
  const language = ALL_LANGUAGES.find(language => language.value.toLowerCase() === contibutedLanguage.toLowerCase());
  const langaugePrefix = language ? language.id : 'en';
  return `/img/${langaugePrefix}_${initiativeType}_${badgeType}_${source}.svg`;
}


module.exports = {
  safeJsonParse,
  safeJson,
  toggleFooterPosition,
  fetchLocationInfo,
  updateLocaleLanguagesDropdown,
  calculateTime,
  covertStringToCapitalised,
  formatTime,
  getLocaleString,
  performAPIRequest,
  showElement,
  hideElement,
  setFooterPosition,
  reportSentenceOrRecording,
  getCookie,
  setCookie,
  getJson,
  setPageContentHeight,
  getDeviceInfo,
  getBrowserInfo,
  formatTimeForLegends,
  getLanguageBadge,
  translate
}
