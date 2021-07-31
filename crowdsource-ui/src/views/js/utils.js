const { HOUR_IN_SECONDS, SIXTY, ALL_LANGUAGES } = require("./constants");
const fetch = require('./fetch')
const platform = require('./platform');
const { context_root } = require('./env-api');

function getDeviceInfo() {
  const os = platform.os;
  let info = "";
  if(os.family){
    info = info + os.family;
  }
  if(os.version){
    info = info + " "+ os.version;
  }
  if (platform.product) {
      info = info + " " + platform.product;
  }
  return info.trim();
}

function getBrowserInfo() {
  let info = "";
  if(platform.name){
    info = info + platform.name;
  }
  if(platform.version){
    info = info + " "+ platform.version;
  }
  return info.trim();
}

const onHover = function (btn) {
  btn.css('background-color', 'rgba(0, 123, 255, 0.3)');
}

const afterHover = function (btn) {
  btn.css('background-color', 'white');
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const formatTransAndImages= (source,target,type) =>{
  const localsStrings = JSON.parse(localStorage.getItem('localeString'));
  const translations = localsStrings['translations'];
  const images = localsStrings['images'];
  const sourceType = type == 'images' ? images : translations;
  return source && source.length ? `${source} - ${target} ${sourceType}` : `${target} ${sourceType}`
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

function fetchLocationInfo() {
  //https://api.ipify.org/?format=json
  let regionName = localStorage.getItem("state_region") || "NOT_PRESENT";
  let countryName = localStorage.getItem("country") || "NOT_PRESENT";
  if (regionName !== "NOT_PRESENT" && countryName !== "NOT_PRESENT" && regionName.length > 0 && countryName.length > 0) {
    return new Promise((resolve) => {
      resolve({"regionName": regionName, "country": countryName})
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

const performAPIRequest = (url) => {
  return fetch(url, {
    credentials: 'include',
    mode: 'cors'
  }).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
}

const getLocaleString = function() {
    return new Promise(function(resolve, reject) {
        const locale = sessionStorage.getItem("i18n") ?? "en";
        performAPIRequest(`/get-locale-strings/${locale}`)
        .then((response) => {
            localStorage.setItem('localeString', JSON.stringify(response));
            resolve(response);
        }).catch((err)=>reject(err));
    });
}

const updateLocaleLanguagesDropdown = (language) => {
    const dropDown = $('#localisation_dropdown');
    const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
    if(language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
        dropDown.html('<a id="english" class="dropdown-item" href="#" locale="en">English</a>');
    } else {
        dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
    }
}

const calculateTime = function (totalSeconds, isSeconds = true) {
  const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  const minutes = Math.floor(remainingAfterHours / SIXTY);
  const seconds = Math.round(remainingAfterHours % SIXTY);
  if (isSeconds) {
    return {hours, minutes, seconds};
  } else {
    return {hours, minutes};
  }
};

const formatTime = function (hours, minutes = 0, seconds = 0) {
  const localsStrings = JSON.parse(localStorage.getItem('localeString'));
  const hrStr = localsStrings['hour(s)'];
  const minStr = localsStrings['minute(s)'];
  const secStr = localsStrings['second(s)'];
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

  if(hours === 0 && minutes === 0 && seconds === 0){
    result += `0 ${secStr} `;
  }

  if(result.charAt(result.length - 1 ) !== ' ')
    return result.substr(0, result.length);
  else 
    return result.substr(0, result.length - 1);
};


const formatTimeForLegends = function (hours, minutes = 0, seconds = 0, isLabelRequired=true) {
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
    return new Promise(function(resolve, reject) {
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
        } catch(err) {
            reject(err);
        }
    });
}

const getJson = (path) => {
    return new Promise((resolve) => {
      $.getJSON(`${context_root}${path}`, (data) => {
        resolve(data);
      });
    })
}

const getLanguageBadge = (contibutedLanguage, badgeType, source, initiativeType) => {
  ALL_LANGUAGES.find(language=>language.value.toLowerCase() === contibutedLanguage.toLowerCase());
  return `/img/en_${initiativeType}_${badgeType}_${source}.svg`;
}


module.exports = { setPageContentHeight,
  toggleFooterPosition,
  fetchLocationInfo,
  getLanguageBadge,
  updateLocaleLanguagesDropdown,
  calculateTime,
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
  onHover,
  afterHover,
  getDeviceInfo,
  getBrowserInfo,
  formatTimeForLegends,
  formatTransAndImages
}
