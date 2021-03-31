const {HOUR_IN_SECONDS, SIXTY, ALL_LANGUAGES} = require("./constants");
const {getCookie} = require("./locale")

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
  const $footer = $('footer');
  $footer.toggleClass('fixed-bottom')
  $footer.toggleClass('bottom')
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
  return fetch(url).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
}

const getLocaleString = function () {
  return new Promise(function (resolve, reject) {
    let locale = getCookie("i18n");
    if (!locale) {
      document.cookie = `i18n=en`;
      locale = "en";
    }
    performAPIRequest(`/get-locale-strings/${locale}`)
      .then((response) => {
        localStorage.setItem('localeString', JSON.stringify(response));
        resolve(response);
      }).catch((err) => reject(err));
  });
}

const updateLocaleLanguagesDropdown = (language) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
    dropDown.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>');
  } else {
    dropDown.html(`<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="/changeLocale/${localeLang.id}">${localeLang.text}</a>`);
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
  let result = "";
  if (hours > 0) {
    result += `${hours} hrs `;
  }
  if (minutes > 0) {
    result += `${minutes} min `;
  }
  if (hours === 0 && minutes === 0 && seconds > 0) {
    result += `${seconds} sec `;
  }
  return result.substr(0, result.length - 1);
};

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

module.exports = {
  setPageContentHeight,
  toggleFooterPosition,
  fetchLocationInfo,
  updateLocaleLanguagesDropdown,
  calculateTime,
  formatTime,
  getLocaleString,
  performAPIRequest,
  showElement,
  hideElement,
  setFooterPosition,
  reportSentenceOrRecording
}
