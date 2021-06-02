const {DEFAULT_CON_LANGUAGE, CONTRIBUTION_LANGUAGE, ALL_LANGUAGES, LOCALE_STRINGS,LIKHO_TO_LANGUAGE,LIKHO_FROM_LANGUAGE,MODULE} = require('./constants');
const {getLocaleString} = require('./utils');
const fetch = require('./fetch');

const testBoloUserName = (val) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
  return mobileRegex.test(val) || emailRegex.test(val);
};

function validateBoloUserName($userName, $userNameError) {
  const userNameValue = $userName.val().trim();
  if (testBoloUserName(userNameValue)) {
    $userName.addClass('is-invalid');
    $userNameError.removeClass('d-none');
  } else {
    $userName.removeClass('is-invalid');
    $userNameError.addClass('d-none');
  }
}

function resetBoloSpeakerDetails() {
  const userName = document.getElementById('bolo-username');
  userName.value = '';
}


function setBoloUserNameTooltip($userName) {
  if ($userName.val().length > 11) {
    $userName.tooltip('enable');
    $userName.tooltip('show');
  } else {
    $userName.tooltip('disable');
    $userName.tooltip('hide');
  }
}

const setBoloStartRecordBtnToolTipContent = (userName, $startRecordBtnTooltip) => {
  const text = 'Please validate any error message before proceeding';
  getLocaleString().then(() => {
    const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    if (testBoloUserName(userName)) {
      $startRecordBtnTooltip.attr(
        'data-original-title',
        localeString[text]
      );
    }

  });
};

const setBoloSpeakerDetails = (speakerDetailsKey, $userName) => {
  const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
  if (speakerDetailsValue) {
    const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
    $userName.val(
      parsedSpeakerDetails.userName
        ? parsedSpeakerDetails.userName.trim().substring(0, 12)
        : ''
    );
    validateBoloUserName($userName, $userName.next());
  }
};

const setBoloUserModalOnShown = function ($userName) {
  $('#boloUserModal').on('shown.bs.modal', function () {
    $('#boloResetBtn').on('click', resetBoloSpeakerDetails);
    $userName.tooltip({
      container: 'body',
      placement: screen.availWidth > 500 ? 'right' : 'auto',
      trigger: 'focus',
    });
    // setUserNameTooltip($userName);
  });
}

const setBoloUserNameOnInputFocus = function () {
  const $userName = $('#bolo-username');
  const $userNameError = $userName.next();
  const $startRecordBtn = $('#bolo-proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  $userName.on('input focus', () => {
    validateBoloUserName($userName, $userNameError);
    // setUserNameTooltip($userName);
    const userNameValue = $userName.val().trim();
    if($startRecordBtnTooltip) {
      if (!testBoloUserName(userNameValue)) {
        $startRecordBtn.removeAttr('disabled').removeClass('point-none');
        $startRecordBtnTooltip.tooltip('disable');
      } else {
        setBoloStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
        $startRecordBtn.prop('disabled', true).addClass('point-none');
        $startRecordBtnTooltip.tooltip('enable');
      }
    }
  });
}

const verifyUser = (userName) => {
  return fetch('/uat/verify', {
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

const setLetGoBtnOnClick = function (url, module='') {
  const speakerDetailsKey = 'speakerDetails';
  const $startRecordBtn = $('#bolo-proceed-box');
  const $userName = $('#bolo-username');
  $startRecordBtn.on('click', () => {
    const userNameValue = $userName.val().trim().substring(0, 12);
    let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const selectedLanguage = ALL_LANGUAGES.find(e => e.value === contributionLanguage);
    if (!selectedLanguage.data) contributionLanguage = DEFAULT_CON_LANGUAGE;
    if (testBoloUserName(userNameValue)) {
      return;
    }
    const speakerDetails = {
      userName: userNameValue,
      language: contributionLanguage,
      toLanguage:'',
    };
    if (location.host.includes('uat')) {
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

module.exports = {
  setBoloSpeakerDetails,
  resetBoloSpeakerDetails,
  setBoloUserNameTooltip,
  setBoloStartRecordBtnToolTipContent,
  setBoloUserModalOnShown,
  setBoloUserNameOnInputFocus,
  setLetGoBtnOnClick
};