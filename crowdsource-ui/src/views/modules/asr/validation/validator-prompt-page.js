const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  // toggleFooterPosition,
  setFooterPosition,
  updateLocaleLanguagesDropdown,
  showElement,
  hideElement,
  fetchLocationInfo,
  reportSentenceOrRecording,
  getBrowserInfo,
  getDeviceInfo,
  getLocaleString,
  translate,
  safeJson
} = require('../common/utils');
const { onChangeUser, onOpenUserDropDown, showUserProfile } = require('../common/header');
const { CONTRIBUTION_LANGUAGE, CURRENT_MODULE, LOCALE_STRINGS,config,INITIATIVES } = require('../common/constants');
const { showKeyboard, setInput } = require('../common/virtualKeyboard');
const {
  isKeyboardExtensionPresent,
  isMobileDevice,
  showOrHideExtensionCloseBtn,
  showErrorPopup,
  redirectToHomeForDirectLanding,
} = require('../common/common');
const {
  setCurrentSentenceIndex,
  setTotalSentenceIndex,
  updateProgressBar,
} = require('../common/progressBar');
const { cdn_url } = require('../common/env-api');
const { initializeFeedbackModal } = require('../common/feedback');
const { setDataSource } = require('../common/sourceInfo');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = `${config.initiativeKey_1}ValidationCurrentIndex`;
const asrValidatorCountKey = `${config.initiativeKey_1}ValidatorCount`;

window.asrValidator = {};

let playStr = "";
let pauseStr = "";
let replayStr = "";
let resumeStr = "";
let audioPlayerBtn = "";
let needChange = "";
let submitButton = "";
let cancelButton = "";
let likeBtn = "";
let skipButton = "";

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
  fd.append('userInput', asrValidator.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localStorage.getItem(CONTRIBUTION_LANGUAGE));
  fd.append('sentenceId', asrValidator.sentences[currentIndex].dataset_row_id);
  fd.append('state', localStorage.getItem('state_region') || "");
  fd.append('country', localStorage.getItem('country') || "");
  fd.append('device', getDeviceInfo());
  fd.append('browser', getBrowserInfo());
  fd.append('type', INITIATIVES.asr.type);
  fetch('/store', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: fd,
  })
  .then(data => {
    if (!data.ok) {
      throw (data.status || 500);
    } else {
      return Promise.resolve(data.json());
    }
  })
  .catch(errStatus => {
    showErrorPopup(errStatus);
    throw errStatus
  })
    .then(() => {
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
  const resume = $(resumeStr);
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');
  const textResume = $('#audioplayer-text_resume');
  const $submitButton = $(submitButton);

  myAudio.addEventListener('play', () => {
    hideElement(play);
    hideElement(resume);
    showElement(pause);
    hideElement(textPlay);
    hideElement(textResume);
    hideElement(replay);
    hideElement(textReplay);
    showElement(textPause);
  })

  myAudio.addEventListener('pause', () => {
    hideElement(pause);
    showElement(resume);
    hideElement(textPause);
    showElement(textResume);
    hideElement(replay);
    hideElement(textReplay);
  })

  myAudio.addEventListener("ended", () => {
    enableValidation();
    hideElement(pause)
    hideElement(resume)
    showElement(replay)
    hideElement(textPause);
    hideElement(textResume);
    showElement(textReplay);
    localStorage.setItem("validation_audioPlayed", true);
    const previousActiveError = $("#edit-error-text .error-active");
    if($("#edit").val() && !previousActiveError[0]){
      $submitButton.removeAttr("disabled");
    }
  });

  play.on('click', () => {
    hideElement($('#default_line'))
    playAudio();
  });

  pause.on('click', pauseAudio);

  replay.on('click', () => {
    replayAudio();
  });

  resume.on('click', () => {
    resumeAudio();
  });

  function playAudio() {
    myAudio.load();
    enableNeedChangeBtn();
    hideElement(play)
    hideElement(resume)
    showElement(pause)
    hideElement(textPlay);
    hideElement(textResume);
    showElement(textPause);
    myAudio.play();
  }

  function pauseAudio() {
    hideElement(pause)
    showElement(resume)
    hideElement(textPause)
    showElement(textResume)
    myAudio.pause();
  }

  function resumeAudio() {
    showElement(pause)
    hideElement(resume)
    showElement(textPause)
    hideElement(textResume)
    myAudio.play();
  }


  function replayAudio() {
    // myAudio.load();
    hideElement(replay)
    showElement(pause)
    hideElement(textReplay);
    showElement(textPause);
    myAudio.play();
  }

  function enableValidation() {
    const likeButton = $("#like_button");
    const needChangeButton = $("#need_change");
    enableButton(likeButton)
    enableButton(needChangeButton)
  }

  function enableNeedChangeBtn() {
    const needChangeButton = $("#need_change");
    enableButton(needChangeButton)
  }
}

let currentIndex = localStorage.getItem(currentIndexKey) || 0;
// eslint-disable-next-line no-unused-vars
let validationCount = 0;

function setSentenceLabel(index) {
  const $sentenceLabel = $('#sentenceLabel');
  const originalText = asrValidator.sentences[index].contribution;
  $sentenceLabel[0].innerText = originalText;
  $('#original-text').text(originalText);
  $('#edit').text(originalText);
}

function getNextSentence() {
  if (currentIndex < asrValidator.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, asrValidator.sentences.length);
    const encodedUrl = encodeURIComponent(asrValidator.sentences[currentIndex].sentence);
    localStorage.setItem("validation_audioPlayed", false);
    loadAudio(`${cdn_url}/${encodedUrl}`);
    setDataSource(asrValidator.sentences[currentIndex].source_info);
    resetValidation();
    setSentenceLabel(currentIndex);
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    localStorage.setItem(currentIndexKey, currentIndex);
    resetValidation();
    // showThankYou();
    disableSkipButton()
    setTimeout(showThankYou, 1000);
  }
}

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function disableValidation() {
  const needChangeButton = $("#need_change");
  const likeButton = $("#like_button");
  disableButton(likeButton)
  disableButton(needChangeButton)
}

function resetValidation() {
  disableValidation();
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

function recordValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = asrValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = asrValidator.sentences[currentIndex].contribution_id;
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
  fetch(`/validate/${contribution_id}/${action}`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify({
      sentenceId: sentenceId,
      state: localStorage.getItem('state_region') || "",
      country: localStorage.getItem('country') || "",
      userName: speakerDetails && speakerDetails.userName,
      device: getDeviceInfo(),
      browser: getBrowserInfo(),
      type:INITIATIVES.asr.type,
      fromLanguage: localStorage.getItem("contributionLanguage")
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(data => {
    if (!data.ok) {
      throw (data.status || 500);
    } else {
      return Promise.resolve(data.json());
    }
  })
  .catch(errStatus => {
    showErrorPopup(errStatus);
    throw errStatus
  })
}

const openEditor = function () {
  const $editorRow = $('#editor-row');
  $editorRow.removeClass('d-none')
  // $('#original-text').text('Original Text');
  hideElement($(needChange));
  hideElement($(likeBtn));
  showElement($(cancelButton))
  showElement($(submitButton))
}

const closeEditor = function () {
  const $editorRow = $('#editor-row');
  hideElement($editorRow);
  showElement($(needChange));
  showElement($(skipButton));
  showElement($(likeBtn));
  hideElement($(cancelButton))
  hideElement($(submitButton))
  hideElement($('#keyboardBox'));
}

function addListeners() {

  const likeButton = $(likeBtn);
  const needChangeButton = $(needChange);
  const $submitButton = $(submitButton);
  const $cancelButton = $(cancelButton);
  // const dislikeButton = $("#dislike_button");
  const $skipButton = $(skipButton);

  needChangeButton.on('click', () => {
    if(!isMobileDevice())  {
      showElement($('#virtualKeyBoardBtn'));
    }
    hideElement($('#sentences-row'));
    openEditor();
    const originalText = asrValidator.sentences[currentIndex].contribution;
    $('#original-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
    $submitButton.attr('disabled', true);
  })

  $("#edit").focus(function () {
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if (!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false' && !isMobileDevice()) {
      showElement($('#keyboardBox'));
    }
  });

  $cancelButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    const $submitEditButton = $submitButton;
    $submitEditButton.attr('disabled', true);
    showElement($('#sentences-row'));
    showElement($('#progress-row'));
    hideElement($('#edit-error-row'))
    const previousActiveError = $("#edit-error-text .error-active");
    previousActiveError && previousActiveError.removeClass('error-active').addClass('d-none');
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    setInput("");
    closeEditor();
  })

  $submitButton.on('click', () => {
    recordValidation(REJECT_ACTION);
    hideElement($('#keyboardBox'));
    hideElement($('#virtualKeyBoardBtn'));
    hideElement($cancelButton);
    hideElement($submitButton)
    hideElement($(audioPlayerBtn))
    hideElement($(skipButton))
    showElement($('#thankyou-text'));
    showElement($('#progress-row'))
    asrValidator.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events', 'none');
    setTimeout(() => {
      closeEditor();
      showElement($('#progress-row'))
      showElement($(playStr))
      hideElement($(resumeStr))
      showElement($("#audioplayer-text_play"));
      hideElement($("#audioplayer-text_resume"));
      showElement($('#sentences-row'));
      showElement($(audioPlayerBtn))
      hideElement($('#thankyou-text'));
      getNextSentence();
      $("#edit").css('pointer-events', 'unset');
    }, 2000)
  })

  likeButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    $(resumeStr).addClass('d-none')
    const textResume = $('#audioplayer-text_resume');
    textResume.addClass('d-none');
    recordValidation(ACCEPT_ACTION)
    getNextSentence();
  })

  $skipButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    if ($(pauseStr).hasClass('d-none')) {
      $(pauseStr).trigger('click');
    }
    $(resumeStr).addClass('d-none')
    const textResume = $('#audioplayer-text_resume');
    textResume.addClass('d-none');
    recordValidation(SKIP_ACTION)
    getNextSentence();
    showElement($('#sentences-row'));
    showElement($('#progress-row'))
    hideElement($('#edit-error-row'))
    const previousActiveError = $("#edit-error-text .error-active");
    previousActiveError && previousActiveError.removeClass('error-active').addClass('d-none');
    $("#edit-text").removeClass('edit-error-area');
    closeEditor();
  })
}

const loadAudio = function (audioLink) {
  $('#my-audio').attr('src', audioLink)
};

function disableSkipButton() {
  const $skipButton = $(skipButton);
  $skipButton.removeAttr('style');
  disableButton($skipButton)
}

function showThankYou() {
  window.location.href = './validator-thank-you.html'
}

function showNoSentencesMessage() {
  const contributionLanguage = localStorage.getItem('contributionLanguage');
  $('#spn-validation-language').html(translate(contributionLanguage));
  hideElement($('#extension-bar'));
  hideElement($('#sentences-row'));
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($(audioPlayerBtn))
  hideElement($('#validation-button-row'))
  hideElement($('#audio-row'))
  hideElement($('#progress-row'))
  hideElement($('#mic-report-row'))
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
  $('#start-validation-language').html(contributionLanguage);
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem("contributionLanguage");
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: asrValidator.sentences[currentIndex].dataset_row_id,
    reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
    language: contributionLanguage,
    userName: speakerDetails ? speakerDetails.userName : '',
    source: "validation"
  };
  reportSentenceOrRecording(reqObj).then(function (resp) {
    if (resp.statusCode === 200) {
      $("#report_sentence_modal").modal('hide');
      $("#report_sentence_thanks_modal").modal('show');
      $("#report_submit_id").attr("disabled", true);
      $("input[type=radio][name=reportRadio]").each(function () {
        $(this).prop("checked", false);
      });
      $("#other_text").val("");
    } else {
      $("#report_sentence_modal").modal('hide');
  }
  }).catch(()=> { $("#report_sentence_modal").modal('hide'); });
}

let selectedReportVal = '';


const initializeComponent = function () {
  showOrHideExtensionCloseBtn();
  hideElement($('#virtualKeyBoardBtn'));
  const totalItems = asrValidator.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const audio = asrValidator.sentences[currentIndex];
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeLanguage = localeStrings[contributionLanguage];
  $('#edit-language').text(localeLanguage);
  $('#keyboardLayoutName').text(localeLanguage);

  addListeners();
  if (audio) {
    const encodedUrl = encodeURIComponent(audio.sentence);
    loadAudio(`${cdn_url}/${encodedUrl}`);
    setDataSource(audio.source_info);
    setSentenceLabel(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    resetValidation();
    setAudioPlayer();
    updateProgressBar(currentIndex + 1, asrValidator.sentences.length)
  }
}

const detectDevice = () => {
  // false for not mobile device
  playStr = "#play";
  replayStr = "#replay";
  pauseStr = "#pause";
  resumeStr = "#resume";
  audioPlayerBtn = "#audio-player-btn";
  needChange = "#need_change";
  submitButton = "#submit-edit-button";
  cancelButton = "#cancel-edit-button";
  likeBtn = "#like_button";
  skipButton = "#skip_button"
}

const executeOnLoad = function () {
  const browser = getBrowserInfo();
  const isNotChrome = !browser.includes('Chrome');
  if(isMobileDevice()) {
    hideElement($('#virtualKeyBoardBtn'));
  }
  if (isMobileDevice() || isNotChrome) {
    hideElement($('#extension-bar'));
  } else {
    showOrHideExtensionCloseBtn();
  }
  localStorage.setItem(CURRENT_MODULE,INITIATIVES.asr.value);
  initializeFeedbackModal();
  detectDevice();
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  setFooterPosition();
  showKeyboard(contributionLanguage.toLowerCase(), () => {
  }, () => {
  }, 'validation_audioPlayed');
  hideElement($('#keyboardBox'));
  // toggleFooterPosition();
  setPageContentHeight();
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeLanguage = localeStrings[contributionLanguage];

  $('#keyboardLayoutName').text(localeLanguage);
  const language = localStorage.getItem('contributionLanguage');
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
    location.href = './record.html';
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
    $('#skip_button').click();
  });

  $("input[type=radio][name=reportRadio]").on("change", function () {
    selectedReportVal = this.value;
    $("#report_submit_id").attr("disabled", false);
  });

  fetchLocationInfo().then(res => {
    return safeJson(res);
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch((err) => {console.log(err)});

  const localSpeakerData = localStorage.getItem(speakerDetailsKey);
  const localSpeakerDataParsed = JSON.parse(localSpeakerData);
  setPageContentHeight();

  if (!localSpeakerDataParsed) {
    location.href = './home.html';
    return;
  }

  showUserProfile(localSpeakerDataParsed.userName)
  onChangeUser('./validator-page.html',INITIATIVES.asr.value);
  onOpenUserDropDown();

    localStorage.setItem("validation_audioPlayed", false);
    localStorage.removeItem(currentIndexKey);
    const type = 'asr';
    const toLanguage = '';
    fetch(`/contributions/${type}?from=${language}&to=${toLanguage}&username=${localSpeakerDataParsed.userName}`, {
      credentials: 'include',
      mode: 'cors'
    })
    .then(data => {
      if (!data.ok) {
        throw (data.status || 500);
      } else {
        return Promise.resolve(data.json());
      }
    })
    .catch(errStatus => {
      showErrorPopup(errStatus);
      throw errStatus
    }).then((result) => {
      asrValidator.sentences = result.data ? result.data : [];
      localStorage.setItem(asrValidatorCountKey, asrValidator.sentences.length);
      if (asrValidator.sentences.length === 0) {
        showNoSentencesMessage();
        return;
      }
      $('#audio-player-btn').removeClass('disable-control');
      $('#skip_button').removeAttr('disabled');
      setFooterPosition();

      initializeComponent();
    });
};

$(document).ready(() => {
  redirectToHomeForDirectLanding();
  getLocaleString()
    .then(() => {
      executeOnLoad();
    })
    .catch(() => {
      executeOnLoad();
    });
});

module.exports = {
  setSentenceLabel,
  setAudioPlayer,
  addListeners,
};