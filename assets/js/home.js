$(document).ready(function () {
  const speakerDetailsKey = 'speakerDetails';
  const defaultLang = 'Odia';
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  const genderRadios = document.querySelectorAll('input[name = "gender"]');
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  const $userNameError = $userName.next();
  const $tncCheckbox = $('#tnc');
  let sentenceLanguage = defaultLang;

  const setStartRecordBtnToolTipContent = (userName) => {
    if (testUserName(userName)) {
      $startRecordBtnTooltip.attr(
        'data-original-title',
        'Please validate any error message before proceeding'
      );
    } else {
      $startRecordBtnTooltip.attr(
        'data-original-title',
        'Please agree to the Terms and Conditions before proceeding'
      );
    }
  };

  setUserNameTooltip($userName);

  const validateUserName = () => {
    const userNameValue = $userName.val().trim();
    if (testUserName(userNameValue)) {
      $userName.addClass('is-invalid');
      $userNameError.removeClass('d-none');
    } else {
      $userName.removeClass('is-invalid');
      $userNameError.addClass('d-none');
    }
    $tncCheckbox.trigger('change');
    setUserNameTooltip($userName);
  };

  $userName.tooltip({
    container: 'body',
    placement: screen.availWidth > 500 ? 'right' : 'auto',
    trigger: 'focus',
  });

  $tncCheckbox.prop('checked', false);

  $startRecordBtnTooltip.tooltip({
    container: 'body',
    placement: screen.availWidth > 500 ? 'right' : 'auto',
  });

  const setSpeakerDetails = () => {
    const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
    if (speakerDetailsValue) {
      const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
      const genderRadio = document.querySelector(
        'input[name = "gender"][value="' + parsedSpeakerDetails.gender + '"]'
      );
      if (genderRadio) {
        genderRadio.checked = true;
        genderRadio.previous = true;
      }
      age.value = parsedSpeakerDetails.age;
      motherTongue.value = parsedSpeakerDetails.motherTongue;
      $userName.val(
        parsedSpeakerDetails.userName
          ? parsedSpeakerDetails.userName.trim().substring(0, 12)
          : ''
      );
      validateUserName();
    }
  };

  setSpeakerDetails();

  genderRadios.forEach((element) => {
    element.addEventListener('click', (e) => {
      if (e.target.previous) {
        e.target.checked = false;
      }
      e.target.previous = e.target.checked;
    });
  });

  let langTop;
  document.getElementById('languageTop').addEventListener('change', (e) => {
    langTop = e.target.value;
    const $toggleButton = $('#start_recording');
    $toggleButton.removeAttr('disabled');
  });

  document.getElementById('start_recording').addEventListener('click', () => {
    sentenceLanguage = langTop;
  });

  let languageBottom = defaultLang;
  document.getElementById('language').addEventListener('change', (e) => {
    languageBottom = e.target.value;
    updateLanguage(languageBottom, fetchDetail);
    updateLanguageInButton(languageBottom);
    updateGraph(languageBottom);
  });

  document.getElementById('start-record').addEventListener('click', () => {
    sentenceLanguage = languageBottom;
  });

  setStartRecordBtnToolTipContent($userName.val().trim());
  $tncCheckbox.change(function () {
    const userNameValue = $userName.val().trim();
    if (this.checked && !testUserName(userNameValue)) {
      $startRecordBtn.removeAttr('disabled').removeClass('point-none');
      $startRecordBtnTooltip.tooltip('disable');
    } else {
      setStartRecordBtnToolTipContent(userNameValue);
      $startRecordBtn.prop('disabled', 'true').addClass('point-none');
      $startRecordBtnTooltip.tooltip('enable');
    }
  });

  $userName.on('input focus', validateUserName);

  $startRecordBtn.on('click', () => {
    if ($tncCheckbox.prop('checked')) {
      const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
      const genderValue = checkedGender.length ? checkedGender[0].value : '';
      const userNameValue = $userName.val().trim().substring(0, 12);
      if (testUserName(userNameValue)) {
        return;
      }
      const speakerDetails = {
        gender: genderValue,
        age: age.value,
        motherTongue: motherTongue.value,
        userName: userNameValue,
        language: sentenceLanguage,
      };
      localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
      location.href = '/record';
    }
  });

  $('#userModal').on('shown.bs.modal', function () {
    document.getElementById('resetBtn').addEventListener('click', () => {
      const selectedGender = document.querySelector(
        'input[name = "gender"]:checked'
      );
      if (selectedGender) selectedGender.checked = false;
      age.selectedIndex = 0;
      motherTongue.selectedIndex = 0;
      $userName[0].value = '';
    });
  });

  updateLanguageInButton(defaultLang);
  updateLanguage(defaultLang, fetchDetail);
});

const testUserName = (val) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
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

function updateLanguageInButton(lang) {
  document.getElementById(
    'start-record'
  ).innerText = `START RECORDING IN ${lang.toUpperCase()}`;
}

function calculateTime(totalSentence) {
  const totalSeconds = totalSentence * 6;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingAfterHours = totalSeconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = remainingAfterHours % 60;
  return {hours, minutes, seconds};
}

const fetchDetail = (language) => {
  return fetch(`/getDetails/${language}`).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
};

function updateLanguage(language, fetchDetail) {
  const $speakersData = $('#speaker-data');
  const $speakersDataLoader = $speakersData.find('#loader1,#loader2');
  const $speakersDataSpeakerWrapper = $('#speakers-wrapper');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataHoursWrapper = $('#hours-wrapper');
  const $speakersDataHoursValue = $('#hour-value');
  $speakersDataLoader.removeClass('d-none');
  $speakersDataHoursWrapper.addClass('d-none');
  $speakersDataSpeakerWrapper.addClass('d-none');

  return fetchDetail(language)
    .then((data) => {
      try {
        const totalSentence = data.find((t) => t.index === 1).count;
        const {hours, minutes, seconds} = calculateTime(totalSentence);
        $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
        $speakersDataSpeakerValue.text(data.find((t) => t.index === 0).count);
        $speakersDataLoader.addClass('d-none');
        $speakersDataHoursWrapper.removeClass('d-none');
        $speakersDataSpeakerWrapper.removeClass('d-none');
        localStorage.setItem('speakersData', JSON.stringify(data));
        return Promise.resolve(true);
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
}

module.exports = {
  updateLanguageInButton,
  updateLanguage,
  calculateTime,
  testUserName,
};
