const { DEFAULT_CON_LANGUAGE, CONTRIBUTION_LANGUAGE, ALL_LANGUAGES, LOCALE_STRINGS, LIKHO_TO_LANGUAGE, LIKHO_FROM_LANGUAGE, MODULE } = require('./constants');
const { getLocaleString } = require('./utils');
const fetch = require('./fetch')

const {whitelisting_email} = require('./env-api')


function validateUserName($userName, $userNameError) {
  const userNameValue = $userName.val().trim();
  if (testUserName(userNameValue)) {
    $userName.addClass('is-invalid');
    $userNameError.removeClass('d-none');
  } else {
    $userName.removeClass('is-invalid');
    $userNameError.addClass('d-none');
  }
}

function resetSpeakerDetails() {
  const userName = document.getElementById('username');
  userName.value = '';
}

const testUserName = (val) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
  if(whitelisting_email === 'true')return false;
  return mobileRegex.test(val) || emailRegex.test(val);
};

function setUserNameTooltip($userName) {
  if ($userName.val().length > 11) {
    $userName.tooltip('enable');
    $userName.tooltip('show');
  } else {
    $userName.tooltip('disable');
    $userName.tooltip('hide');
  }
}

const setStartRecordBtnToolTipContent = (userName, $startRecordBtnTooltip) => {
  const text = 'Please validate any error message before proceeding';
  getLocaleString().then(() => {
    const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    if (testUserName(userName)) {
      $startRecordBtnTooltip.attr(
        'data-original-title',
        localeString[text]
      );
    }

  });
};

const setSpeakerDetails = (speakerDetailsKey, $userName) => {
  const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
  if (speakerDetailsValue) {
    const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
    let userNameTxt = '';
        if(parsedSpeakerDetails.userName){
            userNameTxt = whitelisting_email === 'true'?
            parsedSpeakerDetails.userName.trim() :  
            parsedSpeakerDetails.userName.trim().substring(0, 12)
        }
        $userName.val(userNameTxt);
    validateUserName($userName, $userName.next());
  }
};

const setUserModalOnShown = function ($userName) {
  $('#userModal').on('shown.bs.modal', function () {
    $('#resetBtn').on('click', resetSpeakerDetails);
    $userName.tooltip({
      container: 'body',
      placement: screen.availWidth > 500 ? 'right' : 'auto',
      trigger: 'focus',
    });
    // setUserNameTooltip($userName);
  });
}

const setUserNameOnInputFocus = function () {
  const $userName = $('#username');
  const $userNameError = $userName.next();
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  $userName.on('input focus', () => {
    validateUserName($userName, $userNameError);
    // setUserNameTooltip($userName);
    const userNameValue = $userName.val().trim();
    if ($startRecordBtnTooltip) {
      if (!testUserName(userNameValue)) {
        $startRecordBtn.removeAttr('disabled').removeClass('point-none');
        $startRecordBtnTooltip.tooltip('disable');
      } else {
        setStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
        $startRecordBtn.prop('disabled', true).addClass('point-none');
        $startRecordBtnTooltip.tooltip('enable');
      }
    }
  });
}

const verifyUser = (userName) => {
  return fetch('/verify-user', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      userName: userName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const storeToLocal = (speakerDetailsKey, speakerDetails, contributionLanguage, url) => {
  localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
  localStorage.setItem(CONTRIBUTION_LANGUAGE, contributionLanguage);
  location.href = url;
}

const setStartRecordingBtnOnClick = function (url, module = '') {
  const speakerDetailsKey = 'speakerDetails';
  const $startRecordBtn = $('#proceed-box');
  const $userName = $('#username');
  $startRecordBtn.on('click', () => {
    let userNameValue = $userName.val().trim().substring(0, 12);
        if(whitelisting_email === 'true'){
            userNameValue = $userName.val().trim();
        }
    let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    let toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
    let fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
    const selectedLanguage = ALL_LANGUAGES.find(e => e.value === contributionLanguage);
    if (!selectedLanguage.data) contributionLanguage = DEFAULT_CON_LANGUAGE;
    if (testUserName(userNameValue)) {
      return;
    }
    const userLanguage = module === MODULE.likho.value ? fromLanguage : contributionLanguage;
    const speakerDetails = {
      userName: userNameValue,
      language: userLanguage,
      toLanguage: toLanguage || '',
    };


    if (whitelisting_email === 'true') {
      verifyUser(userNameValue).then(res => {
        if (res.ok) {
          storeToLocal(speakerDetailsKey, speakerDetails, contributionLanguage, url);
        } else {
          alert("User not found")
        }
      }).catch(err => {
        console.log(err)
        alert("User not found")
      })
    } else {
      storeToLocal(speakerDetailsKey, speakerDetails, contributionLanguage, url);
    }
  });
}

$(document).ready(() => {
  if (whitelisting_email==='true') {
    document.getElementById("username").maxLength = 100;
  } else {
    document.getElementById("username").maxLength = 12;
  }
});

module.exports = {
  testUserName,
  validateUserName,
  setSpeakerDetails,
  resetSpeakerDetails,
  setUserNameTooltip,
  setStartRecordBtnToolTipContent,
  setUserModalOnShown,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
};