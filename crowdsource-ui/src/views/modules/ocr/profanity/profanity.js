const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  setFooterPosition,
  updateLocaleLanguagesDropdown,
  showElement,
  hideElement,
  // fetchLocationInfo,
  getLocaleString,
  onHover,
  afterHover
} = require('../common/utils');
const { cdn_url } = require('../common/env-api');
const { CONTRIBUTION_LANGUAGE, CURRENT_MODULE, LOCALE_STRINGS,config,INITIATIVES } = require('../common/constants');
const { showUserProfile } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex, updateProgressBar } = require('../common/progressBar');

const speakerDetailsKey = 'profanityUserDetails';

const ocrCountKey = `${config.initiativeKey_4}Count`;
const currentIndexKey = `${config.initiativeKey_4}CurrentIndex`;
const sentencesKey = `${config.initiativeKey_4}SentencesKey`;

// eslint-disable-next-line no-unused-vars
let localeStrings;

window.ocrInitiative = {};

function getValue(number, maxValue) {
  return number < 0
    ? 0
    : number > maxValue
      ? maxValue
      : number;
}

function getCurrentIndex(lastIndex) {
  const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
  return getValue(currentIndexInStorage, lastIndex);
}

let currentIndex;

function getNextSentence() {
  if (currentIndex < window.ocrInitiative.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, window.ocrInitiative.sentences.length);
    const encodedUrl = encodeURIComponent(window.ocrInitiative.sentences[currentIndex].media);
    setOcrImage(`${cdn_url}/${encodedUrl}`);
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
    localStorage.setItem(currentIndexKey, currentIndex);
    showThankYou();
  }
}

function updateProfanityState(userName, sentenceId, language, state) {
  const fd = new FormData();
  // fd.append('language', language);
  fd.append('sentenceId', sentenceId);
  fd.append('profanityStatus', state);
  fd.append('userName', userName);
  return fetch(`/profanity-status/ocr`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: userName,
      profanityStatus: state,
      sentenceId: sentenceId
    })
  });
}

function onProfanityUpdated() {
  getNextSentence();
}

function invokeProfanityStateUpdate(state) {
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
  updateProfanityState(localSpeakerDataParsed.userName, window.ocrInitiative.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
    .then(() => {
      onProfanityUpdated();
    }).catch(err => {
      console.log(err);
    })
}

function updateSkipAction() {
  const sentenceId = window.ocrInitiative.sentences[currentIndex].dataset_row_id;
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
  fetch(`/profanity-skip/ocr`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sentenceId: sentenceId,
      userName: localSpeakerDataParsed.userName
    })
  }).then(() => { }).catch(err => {
    console.log(err)
  });
}

function addListeners() {

  const $skipButton = $('#skip_button');

  $('#cancel-edit-button').on('click', () => {
    invokeProfanityStateUpdate(false);
  })

  $('#submit-edit-button').on('click', () => {
    invokeProfanityStateUpdate(true);
  })

  $('#cancel-edit-button').hover(
    () => {
      onHover($('#cancel-edit-button'));
    },
    () => {
      afterHover($('#cancel-edit-button'))
    });
  
    $('#submit-edit-button').hover(
      () => {
        onHover($('#submit-edit-button'));
      },
      () => {
        afterHover($('#submit-edit-button'))
      });

  $skipButton.on('click', () => {
    updateSkipAction();
    getNextSentence();
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
  })

  $skipButton.hover(() => {
    $skipButton.css('border-color', '#bfddf5');
  }, () => {
    $skipButton.removeAttr('style');
  })

  $skipButton.mousedown(() => {
    $skipButton.css('background-color', '#bfddf5')
  })
}

const setOcrImage = function (audioLink) {
  $('#view-image').attr('src', audioLink)
};


function showThankYou() {
  $("#profanityThankYouModal").modal('show');
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#audio-row'))
  hideElement($('#ocr-image'));
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  hideElement($('#skip_btn_row'));
  // hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  // hideElement($('#thankyou-text'));
  showElement($('#no-sentences-row'));
}


const initializeComponent = () => {
  const totalItems = window.ocrInitiative.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const validationData = window.ocrInitiative.sentences[currentIndex];
  addListeners();
  if (validationData) {
    const encodedUrl = encodeURIComponent(validationData.media);
    setOcrImage(`${cdn_url}/${encodedUrl}`);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1, window.ocrInitiative.sentences.length)
  }

}

const executeOnLoad = function () {
  setPageContentHeight();
  setFooterPosition();
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);

  if (language) {
    updateLocaleLanguagesDropdown(language);
  }

  try {
    const localSpeakerData = localStorage.getItem(speakerDetailsKey);
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);
    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

    setPageContentHeight();

    if (!localSpeakerDataParsed) {
      location.href = '/en/profanity.html?type=ocr';
      return;
    }

    showUserProfile(localSpeakerDataParsed.userName);
    const isExistingUser = localSentencesParsed &&
      localSentencesParsed.userName === localSpeakerDataParsed.userName
      &&
      localSentencesParsed.language === localSpeakerDataParsed.language;

    if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === language) {
      setFooterPosition();
      window.ocrInitiative.sentences = localSentencesParsed.sentences;
      initializeComponent();
    } else {
      localStorage.removeItem(currentIndexKey);
      const type = 'ocr';
      fetch(`/sentences-for-profanity-check/${type}?username=${localSpeakerDataParsed.userName}&language=${localSpeakerDataParsed.language}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((data) => {
        if (!data.ok) {
          showNoSentencesMessage();
          throw Error(data.statusText || 'HTTP error');
        } else {
          return data.json();
        }
      }).then((sentenceData) => {
        if (sentenceData.data.length === 0) {
          showNoSentencesMessage();
          return;
        }
        if (!isExistingUser) {
          setFooterPosition();
        }
        setFooterPosition();
        window.ocrInitiative.sentences = sentenceData.data;
        localStorage.setItem(ocrCountKey, window.ocrInitiative.sentences.length);
        localStorage.setItem(
          sentencesKey,
          JSON.stringify({
            userName: localSpeakerDataParsed.userName,
            sentences: sentenceData.data,
            language: localSpeakerDataParsed.language,
            toLanguage: ''
          })
        );
        initializeComponent();
      }).catch((err) => {
        console.log(err);
      }).then(() => {
      });
    }

  } catch (err) {
    console.log(err);
  }
}

$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
});

module.exports = {
  addListeners,
};
