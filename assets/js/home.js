$(document).ready(function () {
  const defaultLang = 'Odia';

  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  const genderRadios = document.querySelectorAll('input[name = "gender"]');
  const age = document.getElementById('age');
  const $languageDropdown = $('language');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  const $userNameError = $userName.next();
  const $tncCheckbox = $('#tnc');
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
  const $speakersData = $('#speaker-data');
  const $speakersDataLoader = $speakersData.find('#loader1,#loader2');
  const $speakersDataSpeakerWrapper = $speakersData.find('#speakers-wrapper');
  const $speakersDataSpeakerValue = $speakersData.find('#speaker-value');
  const $speakersDataHoursWrapper = $speakersData.find('#hours-wrapper');
  const $speakersDataHoursValue = $speakersData.find('#hour-value');
  const speakersDataKey = 'speakersData';
  let sentenceLanguage = defaultLang;

  const testUserName = (val) => mobileRegex.test(val) || emailRegex.test(val);
  const setUserNameTooltip = () => {
    if ($userName.val().length > 11) {
      $userName.tooltip('enable');
      $userName.tooltip('show');
    } else {
      $userName.tooltip('disable');
      $userName.tooltip('hide');
    }
  };
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
    setUserNameTooltip();
  };
  $userName.tooltip({
    container: 'body',
    placement: screen.availWidth > 500 ? 'right' : 'auto',
    trigger: 'focus',
  });
  setUserNameTooltip();
  $tncCheckbox.prop('checked', false);
  $startRecordBtnTooltip.tooltip({
    container: 'body',
    placement: screen.availWidth > 500 ? 'right' : 'auto',
  });
  const speakerDetailsKey = 'speakerDetails';
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

  genderRadios.forEach((element) => {
    element.addEventListener('click', (e) => {
      if (e.target.previous) {
        e.target.checked = false;
      }
      e.target.previous = e.target.checked;
    });
  });

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

  document.getElementById('language').addEventListener('click', (e) => {
    const lang = e.target.value;
    updateLanguage(lang);
    updateGraph(lang);
    languageBottom = lang;
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

  $startRecordBtn.on('click', (event) => {
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

  updateLanguageInButton(defaultLang);

  fetch(`/getDetails/${defaultLang}`)
    .then((data) => {
      if (!data.ok) {
        throw Error(data.statusText || 'HTTP error');
      } else {
        return data.json();
      }
    })
    .then((data) => {
      try {
        $speakersDataLoader.addClass('d-none');
        const totalSentence = data.find((t) => t.index === 1).count;
        const totalSeconds = totalSentence * 6;
        const hours = Math.floor(totalSeconds / 3600);
        const remainingAfterHours = totalSeconds % 3600;
        const minutes = Math.floor(remainingAfterHours / 60);
        const seconds = remainingAfterHours % 60;

        $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
        $speakersDataSpeakerValue.text(data.find((t) => t.index === 0).count);
        $speakersDataHoursWrapper.removeClass('d-none');
        $speakersDataSpeakerWrapper.removeClass('d-none');
        localStorage.setItem(speakersDataKey, JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

function updateLanguageInButton(lang) {
  document.getElementById(
    'start-record'
  ).innerText = `START RECORDING IN ${lang.toUpperCase()}`;
}

function updateLanguage(language) {
  const g = $('#speaker-data'),
    u = g.find('#loader1,#loader2'),
    m = g.find('#speakers-wrapper'),
    p = g.find('#speaker-value'),
    h = g.find('#hours-wrapper'),
    v = g.find('#hour-value');
  fetch(`/getDetails/${language}`)
    .then((e) => {
      if (e.ok) return e.json();
      throw Error(e.statusText || 'HTTP error');
    })
    .then((e) => {
      try {
        u.addClass('d-none');
        const t = 6 * e.find((e) => 1 === e.index).count,
          a = Math.floor(t / 3600),
          o = t % 3600,
          r = Math.floor(o / 60),
          n = o % 60;
        document.getElementById('language_button').innerText = language;
        updateLanguageInButton(language);

        v.text(`${a}h ${r}m ${n}s`),
          p.text(e.find((e) => 0 === e.index).count),
          h.removeClass('d-none'),
          m.removeClass('d-none'),
          localStorage.setItem('speakersData', JSON.stringify(e));
      } catch (e) {
        console.log(e);
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

// function enableRecording() {
//   const $toggleButton = $('#start_recording');
//   $toggleButton.removeAttr('disabled');
// }
