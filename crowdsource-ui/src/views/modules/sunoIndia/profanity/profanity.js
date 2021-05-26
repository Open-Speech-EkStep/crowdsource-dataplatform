const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  toggleFooterPosition,
  setFooterPosition,
  updateLocaleLanguagesDropdown,
  getLocaleString,
  showElement,
  hideElement,
  fetchLocationInfo,
  reportSentenceOrRecording
} = require('../common/utils');
const { cdn_url } = require('../common/env-api');
const {CONTRIBUTION_LANGUAGE, LOCALE_STRINGS, CURRENT_MODULE, MODULE} = require('../common/constants');
const {showUserProfile} = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');
const { isMobileDevice} = require('../common/common');

const speakerDetailsKey = 'speakerDetails';

const sunoCountKey = 'sunoCount';
const currentIndexKey = 'sunoCurrentIndex';
const sentencesKey = 'sunoSentencesKey';
window.sunoIndia = {};

let playStr = "";
let pauseStr = "";
let replayStr = "";
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

const setAudioPlayer = function () {
  const myAudio = document.getElementById('my-audio');
  const play = $(playStr);
  const pause = $(pauseStr);
  const replay = $(replayStr);
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');

  myAudio.addEventListener("ended", () => {
    hideElement(pause)
    showElement(replay)
    hideElement(textPause);
    showElement(textReplay);
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
let progressCount = currentIndex, validationCount = 0;

function getNextSentence() {
  if (currentIndex < sunoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, sunoIndia.sentences.length);
    loadAudio(`${cdn_url}/${sunoIndia.sentences[currentIndex].media_data}`);
    resetValidation();
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, {sentences: []});
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

// const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
// showKeyboard(contributionLanguage.toLowerCase(),enableCancelButton,disableCancelButton);

function markContributionSkipped() {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const speakerDetails = JSON.parse(localStorage.getItem('profanityUserDetails'));

  const reqObj = {
    sentenceId: sunoIndia.sentences[currentIndex].dataset_row_id,
    userName: speakerDetails.userName,
    language:contributionLanguage
  };
  fetch('/skip', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqObj),
  })
    .then((res) => res.json())
    .then((result) => {
    })
    .catch((err) => {
      console.log(err);
    })
}

function updateProfanityState(userName, sentenceId, language, state){
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

function onProfanityUpdated($skipButton, $submitButton, cancelButton){
    hideElement(cancelButton);
    hideElement($submitButton)
    hideElement($(audioPlayerBtn))
    hideElement($skipButton)
    showElement($('#thankyou-text'));
    showElement($('#progress-row'))
    try {
      setTimeout(() => {
        hideElement($('#thankyou-text'));
        showElement(cancelButton);
        showElement($submitButton);
        showElement($(audioPlayerBtn))
        showElement($skipButton)
        getNextSentence();
      }, 2000)
    } catch (e) {
    }
}

function invokeProfanityStateUpdate(state, $skipButton, $submitButton, cancelButton){
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
    updateProfanityState(localSpeakerDataParsed.userName, sunoIndia.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
      .then(res=>{
        onProfanityUpdated($skipButton, $submitButton, cancelButton);
      }).catch(err=>{
        console.log(err);
      })
}

function addListeners() {

  const $skipButton = isMobileDevice() ? $('#skip_button_mob') :  $('#skip_button');
  const $submitButton = isMobileDevice() ?  $('#submit-edit-button_mob') :  $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');

  cancelButton.on('click', () => {
    invokeProfanityStateUpdate(false, $skipButton, $submitButton, cancelButton);
  })

  $submitButton.on('click', () => {
    invokeProfanityStateUpdate(true, $skipButton, $submitButton, cancelButton);
  })


  $skipButton.on('click', () => {
    if ($('#pause').hasClass('d-none')) {
      $('#pause').trigger('click');
    }
    // markContributionSkipped();
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
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#thankyou-text'));
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem('profanityUserDetails'));
  const $skipButton = isMobileDevice() ? $('#skip_button_mob') :  $('#skip_button');

  const reqObj = {
    sentenceId: sunoIndia.sentences[currentIndex].dataset_row_id,
    reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
    language: contributionLanguage,
    userName: speakerDetails ? speakerDetails.userName : '',
    source: "contribution"
  };
  reportSentenceOrRecording(reqObj).then(function (resp) {
    if (resp.statusCode === 200) {
      $skipButton.click();
      $("#report_sentence_modal").modal('hide');
      $("#report_sentence_thanks_modal").modal('show');
      $("#report_submit_id").attr("disabled", true);
      $("input[type=radio][name=reportRadio]").each(function () {
        $(this).prop("checked", false);
      });
      $("#other_text").val("");
    }
  });
}

let selectedReportVal = '';
const initialize = function () {
  const totalItems = sunoIndia.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (language) {
    updateLocaleLanguagesDropdown(language);
  }

  const $reportModal = $("#report_sentence_modal");

  $("#report_submit_id").on('click', handleSubmitFeedback);

  $("#report_close_btn").on("click", function () {
    $reportModal.modal('hide');
  });

  $("#report_sentence_thanks_close_id").on("click", function () {
    $("#report_sentence_thanks_modal").modal('hide');
  });

  $("input[type=radio][name=reportRadio]").on("change", function () {
    selectedReportVal = this.value;
    $("#report_submit_id").attr("disabled", false);
  });

  const audio = sunoIndia.sentences[currentIndex];
  addListeners();

  if (audio) {
    loadAudio(`${cdn_url}/${audio.media_data}`);
    resetValidation();
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    setAudioPlayer();
    updateProgressBar(currentIndex + 1,sunoIndia.sentences.length)
  }
};

function executeOnLoad() {
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  if (contributionLanguage) { 
    updateLocaleLanguagesDropdown(contributionLanguage);
  }

  fetchLocationInfo().then(res => {
    console.log(res);
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);



  try {
    const localSpeakerData = localStorage.getItem('profanityUserDetails');
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);

    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

    setPageContentHeight();

    if (!localSpeakerDataParsed) {
      location.href = '/profanity/sunoindia';
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
      sunoIndia.sentences = localSentencesParsed.sentences;
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
          sunoIndia.sentences = sentenceData.data;
          localStorage.setItem(sunoCountKey, sunoIndia.sentences.length);
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
if(isMobileView){
    // true for mobile device
    playStr = "#play_mob";
    replayStr = "#replay_mob";
    pauseStr = "#pause_mob";
    audioPlayerBtn = "#audio-player-btn_mob";
  }else{
    // false for not mobile device
    playStr = "#play";
    replayStr = "#replay";
    pauseStr = "#pause";
    audioPlayerBtn = "#audio-player-btn";
  }
}

$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE, MODULE.suno.value);
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

