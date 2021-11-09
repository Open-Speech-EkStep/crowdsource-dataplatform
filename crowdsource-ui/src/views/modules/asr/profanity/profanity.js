const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  setFooterPosition,
  updateLocaleLanguagesDropdown,
  getLocaleString,
  showElement,
  hideElement,
  onHover,
  afterHover
} = require('../common/utils');
const { cdn_url } = require('../common/env-api');
const { CONTRIBUTION_LANGUAGE, CURRENT_MODULE,config,INITIATIVES } = require('../common/constants');
const { showUserProfile } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex, updateProgressBar } = require('../common/progressBar');
const { isMobileDevice } = require('../common/common');

const speakerDetailsKey = 'profanityUserDetails';

const asrCountKey = `${config.initiativeKey_1}Count`;
const currentIndexKey = `${config.initiativeKey_1}CurrentIndex`;
const sentencesKey = `${config.initiativeKey_1}SentencesKey`;
window.asrInitiative = {};

let playStr = "";
let pauseStr = "";
let replayStr = "";
// eslint-disable-next-line no-unused-vars
let audioPlayerBtn = "";

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

function enableButton(element) {
  element.children().removeAttr("opacity")
  element.removeAttr("disabled")
}

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

const setAudioPlayer = function () {
  const myAudio = document.getElementById('my-audio');
  const play = $(playStr);
  const pause = $(pauseStr);
  const replay = $(replayStr);
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');
  const $submitButton = isMobileDevice() ? $('#submit-edit-button_mob') : $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');

  myAudio.addEventListener("ended", () => {
    hideElement(pause)
    showElement(replay)
    hideElement(textPause);
    showElement(textReplay);
    enableButton($submitButton);
    enableButton(cancelButton);
  });

  play.on('click', () => {
    playAudio();
  });

  pause.on('click', pauseAudio);

  replay.on('click', () => {
    replayAudio();
  });

  function playAudio() {
    myAudio.load();
    hideElement(play)
    showElement(pause)
    hideElement(textPlay);
    showElement(textPause);
    myAudio.play();
  }

  function pauseAudio() {
    hideElement(pause)
    showElement(replay)
    hideElement(textPause)
    showElement(textReplay)
    myAudio.pause();
  }

  function replayAudio() {
    myAudio.load();
    hideElement(replay)
    showElement(pause)
    hideElement(textReplay);
    showElement(textPause);
    myAudio.play();
  }

}

let currentIndex = localStorage.getItem(currentIndexKey) || 0;

function getNextSentence() {
  const $submitButton = isMobileDevice() ? $('#submit-edit-button_mob') : $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');
  disableButton($submitButton);
  disableButton(cancelButton);
  if (currentIndex < asrInitiative.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, asrInitiative.sentences.length);
    const encodedUrl = encodeURIComponent(asrInitiative.sentences[currentIndex].media);
    loadAudio(`${cdn_url}/${encodedUrl}`);
    resetValidation();
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
    localStorage.setItem(currentIndexKey, currentIndex);
    resetValidation();
    showThankYou();
  }
}

function resetValidation() {
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');
  hideElement(textPause);
  hideElement(textReplay);
  showElement(textPlay);

  hideElement($(replayStr))
  hideElement($(pauseStr))
  showElement($(playStr))
}

function updateProfanityState(userName, sentenceId, language, state) {
  const fd = new FormData();
  // fd.append('language', language);
  fd.append('sentenceId', sentenceId);
  fd.append('profanityStatus', state);
  fd.append('userName', userName);
  return fetch(`/profanity-status/asr`, {
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
  // hideElement(cancelButton);
  // hideElement($submitButton)
  // hideElement($(audioPlayerBtn))
  // hideElement($skipButton)
  // showElement($('#thankyou-text'));
  // showElement($('#progress-row'))
  // try {
  //   setTimeout(() => {
  //     hideElement($('#thankyou-text'));
  //     showElement(cancelButton);
  //     showElement($submitButton);
  //     showElement($(audioPlayerBtn))
  //     showElement($skipButton)
  getNextSentence();
  //   }, 2000)
  // } catch (e) {
  // }
}

function invokeProfanityStateUpdate(state, $skipButton, $submitButton, cancelButton) {
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  updateProfanityState(localSpeakerDataParsed.userName, asrInitiative.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
    .then(() => {
      onProfanityUpdated($skipButton, $submitButton, cancelButton);
    }).catch(err => {
      console.log(err);
    })
}

function updateSkipAction() {
  const sentenceId = asrInitiative.sentences[currentIndex].dataset_row_id;
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
  fetch(`/profanity-skip/asr`, {
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

  const $skipButton = isMobileDevice() ? $('#skip_button_mob') : $('#skip_button');
  const $submitButton = isMobileDevice() ? $('#submit-edit-button_mob') : $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');

  cancelButton.on('click', () => {
    invokeProfanityStateUpdate(false, $skipButton, $submitButton, cancelButton);
  })

  $submitButton.on('click', () => {
    invokeProfanityStateUpdate(true, $skipButton, $submitButton, cancelButton);
  })

  cancelButton.hover(
    () => {
      onHover(cancelButton);
    },
    () => {
      afterHover(cancelButton)
    });

  $submitButton.hover(
    () => {
      onHover($submitButton);
    },
    () => {
      afterHover($submitButton)
    });


  $skipButton.on('click', () => {
    if ($('#pause').hasClass('d-none')) {
      $('#pause').trigger('click');
    }
    updateSkipAction();
    getNextSentence();
    showElement($('#sentences-row'));
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


const loadAudio = function (audioLink) {
  $('#my-audio').attr('src', audioLink)
};

function showThankYou() {
  $("#profanityThankYouModal").modal('show');
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem(CONTRIBUTION_LANGUAGE));
  hideElement($('#sentences-row'));
  hideElement($('#audio-row'))
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  showElement($('#no-sentences-row'))
  hideElement($('#skip_btn_row'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
}

const initialize = function () {
  const totalItems = asrInitiative.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (language) {
    updateLocaleLanguagesDropdown(language);
  }

  const audio = asrInitiative.sentences[currentIndex];
  addListeners();

  if (audio) {
    const encodedUrl = encodeURIComponent(audio.media);
    loadAudio(`${cdn_url}/${encodedUrl}`);
    resetValidation();
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    setAudioPlayer();
    updateProgressBar(currentIndex + 1, asrInitiative.sentences.length)
  }
};

function executeOnLoad() {
  setPageContentHeight();
  setFooterPosition();
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (contributionLanguage) {
    updateLocaleLanguagesDropdown(contributionLanguage);
  }

  try {
    const localSpeakerData = localStorage.getItem(speakerDetailsKey);
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);

    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

    setPageContentHeight();

    if (!localSpeakerDataParsed) {
      location.href = '/en/profanity.html?type=asr';
      return;
    }

    showUserProfile(localSpeakerDataParsed.userName)
    const isExistingUser = localSentencesParsed &&
      localSentencesParsed.userName === localSpeakerDataParsed.userName
      &&
      localSentencesParsed.language === localSpeakerDataParsed.language;

    if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === contributionLanguage) {
      $loader.hide();
      $pageContent.removeClass('d-none');
      setFooterPosition();
      asrInitiative.sentences = localSentencesParsed.sentences;
      initialize();
    } else {
      localStorage.removeItem(currentIndexKey);
      fetch(`/sentences-for-profanity-check/asr?username=${localSpeakerDataParsed.userName}&language=${contributionLanguage}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => {
          if (!data.ok) {
            showNoSentencesMessage();
            throw Error(data.statusText || 'HTTP error');
          } else {
            return data.json();
          }
        })
        .then((sentenceData) => {
          console.log("SENTENCE", sentenceData)
          if (sentenceData.data.length === 0) {
            showNoSentencesMessage();
            return;
          }
          if (!isExistingUser) {
            setFooterPosition();
          }
          $pageContent.removeClass('d-none');
          asrInitiative.sentences = sentenceData.data;
          localStorage.setItem(asrCountKey, asrInitiative.sentences.length);
          $loader.hide();
          localStorage.setItem(
            sentencesKey,
            JSON.stringify({
              userName: localSpeakerDataParsed.userName,
              sentences: sentenceData.data,
              language: localSpeakerDataParsed.language,
            })
          );
          setFooterPosition();
          initialize();
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          $loader.hide();
        });
    }
  } catch (err) {
    console.log(err);
  }
}

const detectDevice = () => {
  const isMobileView = isMobileDevice();
  if (isMobileView) {
    // true for mobile device
    playStr = "#play_mob";
    replayStr = "#replay_mob";
    pauseStr = "#pause_mob";
    audioPlayerBtn = "#audio-player-btn_mob";
  } else {
    // false for not mobile device
    playStr = "#play";
    replayStr = "#replay";
    pauseStr = "#pause";
    audioPlayerBtn = "#audio-player-btn";
  }
}

$(document).ready(() => {
  const $submitButton = isMobileDevice() ? $('#submit-edit-button_mob') : $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');
  disableButton($submitButton);
  disableButton(cancelButton);
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
  detectDevice();
});

module.exports = {
  setAudioPlayer,
  addListeners,
};

