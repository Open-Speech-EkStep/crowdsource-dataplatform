const fetch = require('../common/fetch')
const { setPageContentHeight, toggleFooterPosition,setFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('../common/utils');
const {CONTRIBUTION_LANGUAGE,CURRENT_MODULE,MODULE} = require('../common/constants');
const {showKeyboard,setInput} = require('../common/virtualKeyboard');
const { showUserProfile } = require('../common/header');
const { isKeyboardExtensionPresent,isMobileDevice } = require('../common/common');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');
const { cdn_url } = require('../common/env-api');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = 'sunoValidationCurrentIndex';
const sentencesKey = 'sunoValidatorSentencesKey';
const sunoValidatorCountKey = 'sunoValidatorCount';

window.sunoIndiaValidator = {};

let playStr = "";
let pauseStr = "";
let replayStr = "";
let resumeStr = "";
let audioPlayerBtn = "";
let needChange = "";
let submitButton ="";
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
  fd.append('userInput', sunoIndiaValidator.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localSpeakerDataParsed.language);
  fd.append('sentenceId', sunoIndiaValidator.sentences[currentIndex].dataset_row_id);
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
  const resume = $(resumeStr);
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');
  const textResume = $('#audioplayer-text_resume');


  myAudio.addEventListener("ended", () => {
    enableValidation();
    hideElement(pause)
    hideElement(resume)
    showElement(replay)
    hideElement(textPause);
    hideElement(textResume);
    showElement(textReplay);
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
    const likeButton = isMobileDevice() ? $("#like_button_mob") : $("#like_button");
    const needChangeButton = isMobileDevice() ? $("#need_change_mob") : $("#need_change");
    enableButton(likeButton)
    enableButton(needChangeButton)
  }

  function enableNeedChangeBtn() {
    const needChangeButton = isMobileDevice() ? $("#need_change_mob") : $("#need_change");
    enableButton(needChangeButton)
  }
}

let currentIndex = localStorage.getItem(currentIndexKey) || 0;
let progressCount = currentIndex, validationCount = 0;

const animateCSS = ($element, animationName, callback) => {
  $element.addClass(`animated ${animationName}`);

  function handleAnimationEnd() {
    $element.removeClass(`animated ${animationName}`);
    $element.off('animationend');
    if (typeof callback === 'function') callback();
  }

  $element.on('animationend', handleAnimationEnd);
};

function setSentenceLabel(index) {
  const $sentenceLabel = $('#sentenceLabel');
  const originalText = sunoIndiaValidator.sentences[index].contribution;
  $sentenceLabel[0].innerText = originalText;
  animateCSS($sentenceLabel, 'lightSpeedIn');
  $('#original-text').text(originalText);
  $('#edit').text(originalText);
  
}

function getNextSentence() {
  if (currentIndex < sunoIndiaValidator.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1,sunoIndiaValidator.sentences.length)
    loadAudio(`${cdn_url}/${sunoIndiaValidator.sentences[currentIndex].sentence}`);
    resetValidation();
    setSentenceLabel(currentIndex);
    localStorage.setItem(currentIndexKey,currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
    localStorage.setItem(currentIndexKey, currentIndex);
    resetValidation();
    showThankYou();
  }
}

const updateDecisionButton = (button, colors) => {
  if(!isMobileDevice()) {
    const children = button.children().children();
    children[0].setAttribute("fill", colors[0]);
    children[1].setAttribute("fill", colors[1]);
    children[2].setAttribute("fill", colors[2]);
  }
}

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function disableValidation() {
  const needChangeButton = isMobileDevice() ? $("#need_change_mob") : $("#need_change");
  const likeButton = isMobileDevice() ? $("#like_button_mob") : $("#like_button");
  updateDecisionButton(needChangeButton, ["white", "#007BFF", "#343A40"]);
  updateDecisionButton(likeButton, ["white", "", "#343A40"]);
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
  const sentenceId = sunoIndiaValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = sunoIndiaValidator.sentences[currentIndex].contribution_id;
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
  fetch(`/validate/${contribution_id}/${action}`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify({
      sentenceId: sentenceId,
      state: localStorage.getItem('state_region') || "",
      country: localStorage.getItem('country') || "",
      userName: speakerDetails && speakerDetails.userName
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(
      (data) => {
        if (!data.ok) {
          throw Error(data.statusText || 'HTTP error');
        }
      });
}

const openEditor = function (){
const $editorRow = $('#editor-row');
  $editorRow.removeClass('d-none')
  // $('#original-text').text('Original Text');
  hideElement($(needChange));
  hideElement($(likeBtn));
  showElement($(cancelButton))
  showElement($(submitButton))
}

const closeEditor = function (){
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

  likeButton.hover(() => {
      updateDecisionButton(likeButton, ["#bfddf5", "", "#007BFF"]);
    },
    () => {
      updateDecisionButton(likeButton, ["white", "", "#343A40"]);
    });

  needChangeButton.hover(() => {
      updateDecisionButton(needChangeButton, ["#bfddf5", "#007BFF", "#007BFF"]);
      $("#sentences-row .prompt").addClass('hover-edit');
    },
    () => {
      updateDecisionButton(needChangeButton, ["white", "#007BFF", "#343A40"]);
      $("#sentences-row .prompt").removeClass('hover-edit');
    });

  needChangeButton.mousedown(() => {
    updateDecisionButton(needChangeButton, ["#007BFF", "white", "white"]);
  });

  likeButton.mousedown(() => {
   
    updateDecisionButton(likeButton, ["#007BFF", "", "white"]);
  });


  needChangeButton.on('click',()=>{
    showElement($('#virtualKeyBoardBtn'));
    hideElement($('#sentences-row'));
    openEditor();
    const originalText = sunoIndiaValidator.sentences[currentIndex].contribution;
    $('#original-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
  })

  $("#edit").focus(function(){
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if(!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false'){
      showElement($('#keyboardBox'));
    }
  });

  $cancelButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    const $submitEditButton = $submitButton;
    $submitEditButton.attr('disabled',true);
    if(!isMobileDevice()) {
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#D7D7D7');
    }
    showElement($('#sentences-row'));
    showElement($('#progress-row'));
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
    sunoIndiaValidator.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events','none');
    setTimeout(()=>{
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
      $("#edit").css('pointer-events','unset');
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
    if($(pauseStr).hasClass('d-none')){
      $(pauseStr).trigger('click');
    }
    $(resumeStr).addClass('d-none')
    const textResume = $('#audioplayer-text_resume');
    textResume.addClass('d-none');
    recordValidation(SKIP_ACTION)
    getNextSentence();
    showElement($('#sentences-row'));
    showElement($('#progress-row'))
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
  const $skipButton = $(skipButton);
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
      const blob = new Blob([buffer], { type: "audio/wav" });
      // loadAudio(URL.createObjectURL(blob))
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        loadAudio(e.target.result);
        showAudioRow();
        enableButton($(skipButton))
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
  window.location.href = './validator-thank-you.html'
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#sentences-row'));
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($(audioPlayerBtn))
  hideElement($('#validation-button-row'))
  hideElement($('#audio-row'))
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
  $('#start-validation-language').html(localStorage.getItem('contributionLanguage'));

}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem("contributionLanguage");
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: sunoIndiaValidator.sentences[currentIndex].dataset_row_id,
    reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
    language: contributionLanguage,
    userName: speakerDetails ? speakerDetails.userName : '',
    source: "validation"
  };
  reportSentenceOrRecording(reqObj).then(function (resp) {
    if (resp.statusCode === 200) {
      $('#skip_button').click();
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


const initializeComponent = function () {
  hideElement($('#virtualKeyBoardBtn'));
  const totalItems = sunoIndiaValidator.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const audio = sunoIndiaValidator.sentences[currentIndex];
  addListeners();
  if (audio) {
    loadAudio(`${cdn_url}/${audio.sentence}`);
    setSentenceLabel(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    resetValidation();
    setAudioPlayer();
    updateProgressBar(currentIndex + 1,sunoIndiaValidator.sentences.length)
  }
}

const detectDevice = () => {
  const isMobileView = isMobileDevice();
if(isMobileView){
    // true for mobile device
    playStr = "#play_mob";
    replayStr = "#replay_mob";
    pauseStr = "#pause_mob";
    resumeStr = "#resume_mob";
    audioPlayerBtn = "#audio-player-btn_mob";
     needChange = "#need_change_mob";
 submitButton ="#submit-edit-button_mob";
 cancelButton = "#cancel-edit-button_mob";
 likeBtn = "#like_button_mob";
 skipButton = "#skip_button_mob"
  }else{
    // false for not mobile device
    playStr = "#play";
    replayStr = "#replay";
    pauseStr = "#pause";
  resumeStr = "#resume";
    audioPlayerBtn = "#audio-player-btn";
    needChange = "#need_change";
    submitButton ="#submit-edit-button";
    cancelButton = "#cancel-edit-button";
    likeBtn = "#like_button";
    skipButton = "#skip_button"
  }
}

$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE, MODULE.suno.value);
  detectDevice();
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  setFooterPosition();
  showKeyboard(contributionLanguage.toLowerCase());
  hideElement($('#keyboardBox'));
  toggleFooterPosition();
  setPageContentHeight();
  $('#keyboardLayoutName').text(contributionLanguage);
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
  });

  $("input[type=radio][name=reportRadio]").on("change", function () {
    selectedReportVal = this.value;
    $("#report_submit_id").attr("disabled", false);
  });

  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);

  const localSpeakerData = localStorage.getItem(speakerDetailsKey);
  const localSpeakerDataParsed = JSON.parse(localSpeakerData);
  const localSentences = localStorage.getItem(sentencesKey);
  const localSentencesParsed = JSON.parse(localSentences);
  setPageContentHeight();
  if (!localSpeakerDataParsed) {
    location.href = './home.html';
    return;
  }

  showUserProfile(localSpeakerDataParsed.userName)

  const isExistingUser = localSentencesParsed &&
    localSentencesParsed.userName === localSpeakerDataParsed.userName
    &&
    localSentencesParsed.language === localSpeakerDataParsed.language;

  if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === language) {
    setFooterPosition();
    sunoIndiaValidator.sentences = localSentencesParsed.sentences;
    initializeComponent();
  } else {
    localStorage.removeItem(currentIndexKey);
    const type = 'asr';
    const toLanguage = '';
    fetch(`/contributions/${type}?from=${language}&to=${toLanguage}&username=${localSpeakerDataParsed.userName}`, {
      credentials: 'include',
      mode: 'cors'
    }).then((data) => {
      if (!data.ok) {
        showNoSentencesMessage();
        throw Error(data.statusText || 'HTTP error');
      } else {
        return data.json();
      }
    }).then((result) => {
      if (result.data.length === 0) {
        showNoSentencesMessage();
        return;
      }
      setFooterPosition();
      sunoIndiaValidator.sentences = result.data;
      localStorage.setItem(sunoValidatorCountKey, sunoIndiaValidator.sentences.length);
      localStorage.setItem(
        sentencesKey,
        JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          sentences: result.data,
          language: localSpeakerDataParsed.language,
        })
      );

      initializeComponent();
    }).catch((err) => {
      console.log(err);
    })
  }
})

module.exports = {
  setSentenceLabel,
  setAudioPlayer,
  addListeners,
};
