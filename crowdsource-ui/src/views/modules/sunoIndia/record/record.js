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
const {CONTRIBUTION_LANGUAGE, LOCALE_STRINGS, CURRENT_MODULE, MODULE} = require('../common/constants');
const {showKeyboard,setInput} = require('../common/virtualKeyboard');
const {showUserProfile} = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');
const {isKeyboardExtensionPresent,enableCancelButton,disableCancelButton, isMobileDevice} = require('../common/common');
const speakerDetailsKey = 'speakerDetails';

const sunoCountKey = 'sunoCount';
const currentIndexKey = 'sunoCurrentIndex';
const sentencesKey = 'sunoSentencesKey';
let localeStrings;
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


function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', sunoIndia.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localSpeakerDataParsed.language);
  fd.append('sentenceId', sunoIndia.sentences[currentIndex].dataset_row_id);
  fd.append('state', localStorage.getItem('state_region') || "");
  fd.append('country', localStorage.getItem('country') || "");
  fetch('/store', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: fd,
  })
    .then((res) => res.json())
    .then((result) => {
    })
    .catch((err) => {

      console.log(err);
    })
    .then((finalRes) => {
      if (cb && typeof cb === 'function') {
        cb();
      }
    });
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
  const cancelButton = isMobileDevice() ? $("#cancel-edit-button_mob") : $("#cancel-edit-button");


  myAudio.addEventListener("ended", () => {
    hideElement(pause)
    showElement(replay)
    hideElement(textPause);
    showElement(textReplay);
    cancelButton.removeAttr("disabled");
    $("#edit").removeAttr("disabled");
  });

  play.on('click', () => {
    hideElement($('#default_line'))
    playAudio();
    $("#edit").removeAttr("disabled");
    $("#edit-text-suno").addClass("edit-text");
  });

  pause.on('click', pauseAudio);

  replay.on('click', () => {
    replayAudio();
    $("#edit").removeAttr("disabled");
    $("#edit-text-suno").addClass("edit-text");
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
    updateProgressBar(currentIndex, sunoIndia.sentences.length);
    getAudioClip(sunoIndia.sentences[currentIndex].dataset_row_id)
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

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
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
  showElement($('#default_line'))
}

const closeEditor = function () {
  hideElement($('#keyboardBox'));
}

const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
showKeyboard(contributionLanguage.toLowerCase(),enableCancelButton,disableCancelButton);

function markContributionSkipped() {
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: sunoIndia.sentences[currentIndex].dataset_row_id,
    userName: speakerDetails.userName
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

function addListeners() {

  const $skipButton = isMobileDevice() ? $('#skip_button_mob') :  $('#skip_button');
  const $submitButton = isMobileDevice() ?  $('#submit-edit-button_mob') :  $('#submit-edit-button');
  const cancelButton = isMobileDevice() ? $('#cancel-edit-button_mob') : $('#cancel-edit-button');

  $("#edit").focus(function () {
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if(!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false'){
      showElement($('#keyboardBox'));
    }
  });

  cancelButton.on('click', () => {
    $("#edit").val("");
    setInput("");
    showElement($('#progress-row'))
    const $cancelEditButton = cancelButton;
    $cancelEditButton.attr('disabled', true);
    const $submitEditButton = isMobileDevice() ? $('#submit-edit-button_mob') : $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    closeEditor();
  })

  $submitButton.on('click', () => {
    setInput("");
    $("#edit").attr("disabled", true);
    $("#edit-text-suno").removeClass("edit-text");
    hideElement($('#keyboardBox'));
    hideElement(cancelButton);
    hideElement($submitButton)
    hideElement($(audioPlayerBtn))
    hideElement($skipButton)
    showElement($('#thankyou-text'));
    sunoIndia.editedText = $("#edit").val();
    $("#edit").css('pointer-events', 'none');
    $(cancelButton).attr("disabled", true);
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    showElement($('#progress-row'))
    try {
      uploadToServer();
      setTimeout(() => {
        hideElement($('#thankyou-text'));
        showElement(cancelButton);
        showElement($submitButton);
        showElement($(audioPlayerBtn))
        showElement($skipButton)
        $("#edit").css('pointer-events', 'unset');
        $("#edit").val("");
        closeEditor();
        getNextSentence();
      }, 2000)
    } catch (e) {
      console.log(e)
    }

  })


  $skipButton.on('click', () => {
    $("#edit").attr("disabled", true);
    $("#edit-text-suno").removeClass("edit-text");
    if ($('#pause').hasClass('d-none')) {
      $('#pause').trigger('click');
    }
    $('#edit').val("");
    setInput("");
    $('#submit-edit-button').attr('disabled', true);
    markContributionSkipped();
    getNextSentence();
    showElement($('#sentences-row'));
    showElement($('#progress-row'));
    cancelButton.attr("disabled", true);
    closeEditor();

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

function disableSkipButton() {
  const $skipButton = isMobileDevice() ? $('#skip_button_mob') :  $('#skip_button');
  $skipButton.removeAttr('style');
  disableButton($skipButton)
}

const getAudioClip = function (contributionId) {
  hideAudioRow();
  disableSkipButton();
  const source = 'contribute';
  fetch(`/media-object/${source}/${contributionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((stream) => {
    stream.arrayBuffer().then((buffer) => {
      const blob = new Blob([buffer], {type: "audio/wav"});
      // loadAudio(URL.createObjectURL(blob))
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        loadAudio(e.target.result);
        showAudioRow();
        enableButton(isMobileDevice() ? $('#skip_button_mob') :  $('#skip_button'));
      }
      fileReader.readAsDataURL(blob);
    });
  }).catch((err) => {
    console.log(err)
    showAudioRow();
  });
}

function hideAudioRow() {
  showElement($('#loader-audio-row'));
  hideElement($('#audio-row'))
  showElement($('#loader-play-btn'));
  hideElement($(audioPlayerBtn))
}

function showAudioRow() {
  hideElement($('#loader-audio-row'));
  showElement($('#audio-row'));
  hideElement($('#loader-play-btn'));
  showElement($(audioPlayerBtn))
}

function showThankYou() {
  window.location.href = './thank-you.html';
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem(CONTRIBUTION_LANGUAGE));
  hideElement($('#sentences-row'));
  hideElement($('#audio-row'))
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  showElement($('#no-sentences-row'))
  hideElement($('#skip_btn_row'));
  hideElement($('#validation-container'));
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thankyou-text'));
  hideElement($('#keyboardBox'));
  $("#validation-container").removeClass("validation-container");
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
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

  $("#start_contributing_id").on('click', function () {
    const data = localStorage.getItem("speakerDetails");
    if (data !== null) {
      const speakerDetails = JSON.parse(data);
      speakerDetails.language = language;
      localStorage.setItem("speakerDetails", JSON.stringify(speakerDetails));
    }
    location.href = './home.html';
  });

  const $reportModal = $("#report_sentence_modal");

  $("#report_submit_id").on('click', handleSubmitFeedback);

  $("#report_btn").on('click', function () {
    $reportModal.modal('show');
  });

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
    getAudioClip(audio.dataset_row_id);
    resetValidation();
    setCurrentSentenceIndex(currentIndex);
    setTotalSentenceIndex(totalItems);
    setAudioPlayer();
    updateProgressBar(currentIndex,sunoIndia.sentences.length)
  }
};

function executeOnLoad() {
  hideElement($('#keyboardBox'));
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  const $validationInstructionModal = $("#validation-instruction-modal");
  const $errorModal = $('#errorModal');
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  $('#keyboardLayoutName').text(contributionLanguage);
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  if (contributionLanguage) {
    updateLocaleLanguagesDropdown(contributionLanguage);
  }

  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);
  try {
    const localSpeakerData = localStorage.getItem(speakerDetailsKey);
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);
    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

    setPageContentHeight();
    $("#instructions_close_btn").on("click", function () {
      $validationInstructionModal.addClass("d-none");
      setFooterPosition();
    })

    $errorModal.on('show.bs.modal', function () {
      $validationInstructionModal.addClass("d-none");
      setFooterPosition();

    });
    $errorModal.on('hidden.bs.modal', function () {
      location.href = './home.html#speaker-details';
    });

    if (!localSpeakerDataParsed) {
      location.href = './home.html#speaker-details';
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
      const type = 'asr';
      fetch(`/media/${type}`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          language: contributionLanguage,
        }),
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
          if (sentenceData.data.length === 0) {
            showNoSentencesMessage();
            return;
          }
          if (!isExistingUser) {
            //$instructionModal.modal('show');
            $validationInstructionModal.removeClass("d-none");
            setFooterPosition();
            // toggleFooterPosition();
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
          $errorModal.modal('show');
        })
        .then(() => {
          $loader.hide();
        });
    }
  } catch (err) {
    console.log(err);
    $errorModal.modal('show');
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
  hideElement($('#keyboardBox'));
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

