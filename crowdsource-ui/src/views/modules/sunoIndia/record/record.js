const fetch = require('../common/fetch')
const { setPageContentHeight, toggleFooterPosition,setFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('../common/utils');
const {CONTRIBUTION_LANGUAGE} = require('../common/constants');
const {showKeyboard} = require('../common/virtualKeyboard');
const { setInput } = require('../common/virtualKeyboard');
const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = 'sunoCurrentIndex';

window.crowdSource = {};

function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  crowdSource.sentences = validationSentences;
  fd.append('userInput', crowdSource.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localSpeakerDataParsed.language);
  fd.append('sentenceId', crowdSource.sentences[currentIndex].dataset_row_id);
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
  const play = $('#play');
  const pause = $('#pause');
  const replay = $('#replay');
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');


  myAudio.addEventListener("ended", () => {
    hideElement(pause)
    showElement(replay)
    hideElement(textPause);
    showElement(textReplay);
    $("#cancel-edit-button").removeAttr("disabled");
    $("#edit").removeAttr("disabled");
  });

  play.on('click', () => {
    hideElement($('#default_line'))
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

const animateCSS = ($element, animationName, callback) => {
  $element.addClass(`animated ${animationName}`);

  function handleAnimationEnd() {
    $element.removeClass(`animated ${animationName}`);
    $element.off('animationend');
    if (typeof callback === 'function') callback();
  }

  $element.on('animationend', handleAnimationEnd);
};

function getNextSentence() {
  if (currentIndex < validationSentences.length - 1) {
    currentIndex++;
    getAudioClip(validationSentences[currentIndex].dataset_row_id)
    resetValidation();
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    resetValidation();
    showThankYou();
  }
}

const updateDecisionButton = (button, colors) => {
  const children = button.children().children();
  children[0].setAttribute("fill", colors[0]);
  children[1].setAttribute("fill", colors[1]);
  children[2].setAttribute("fill", colors[2]);
}

const updateValidationCount = () => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = progressCount;
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = validationSentences.length;
}

const updateProgressBar = () => {
  const $progressBar = $("#progress_bar");
  progressCount++;
  const multiplier = 10 * (10 / validationSentences.length);
  $progressBar.width(progressCount * multiplier + '%');
  $progressBar.prop('aria-valuenow', progressCount);
  updateValidationCount();
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

  hideElement($("#replay"))
  hideElement($('#pause'))
  showElement($("#play"))
  showElement($('#default_line'))
}

function recordValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = validationSentences[currentIndex].dataset_row_id
  const contribution_id = validationSentences[currentIndex].contribution_id
  fetch(`/validate/${contribution_id}/${action}`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify({
      sentenceId: sentenceId,
      state: localStorage.getItem('state_region') || "",
      country: localStorage.getItem('country') || ""
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

const closeEditor = function (){
  hideElement($('.simple-keyboard'));
}

const openEditor = function (){
  showElement($('.simple-keyboard'));
}


const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
showKeyboard(contributionLanguage.toLowerCase());
function addListeners() {

  const $skipButton = $('#skip_button');

  $("#edit").focus(function(){
    hideElement($('#progress-row'));
    showElement($('.simple-keyboard'));
    openEditor();
  });

  $('#cancel-edit-button').on('click', () => {
    $("#edit").val("");
    setInput("");
    showElement($('#progress-row'))
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled',true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    setInput("");
    hideElement($('.simple-keyboard'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#audio-player-btn'))
    hideElement($('#skip_button'))
    showElement($('#thankyou-text'));
    crowdSource.editedText = $("#edit").val();
    $("#edit").css('pointer-events','none');
    $("#cancel-edit-button").attr("disabled",true);
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled',true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    showElement($('#progress-row'))
    uploadToServer();
    setTimeout(()=>{
      hideElement($('#thankyou-text'));
      showElement($('#cancel-edit-button'));
      showElement($('#submit-edit-button'))
      showElement($('#audio-player-btn'))
      showElement($('#skip_button'))
      $("#edit").css('pointer-events','unset');
      $("#edit").val("");
      closeEditor();
      updateProgressBar();
      getNextSentence();
    }, 2000)
  })


  $skipButton.on('click', () => {
    $('#pause').trigger('click');
    $('#edit').val("");
    setInput("");
    $('#submit-edit-button').attr('disabled',true);
    recordValidation(SKIP_ACTION)
    updateProgressBar();
    getNextSentence();
    showElement($('#sentences-row'));
    showElement($('#progress-row'));
    $("#cancel-edit-button").attr("disabled",true);
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

let validationSentences = [{ sentence: '' }]

const loadAudio = function (audioLink) {
  $('#my-audio').attr('src', audioLink)
};

function disableSkipButton() {
  const $skipButton = $('#skip_button');
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
        enableButton($('#skip_button'))
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
  hideElement($('#audio-player-btn'))
}

function showAudioRow() {
  hideElement($('#loader-audio-row'));
  showElement($('#audio-row'));
  hideElement($('#loader-play-btn'));
  showElement($('#audio-player-btn'))
}

function showThankYou() {
  // hideElement($('#sentences-row'));
  // hideElement($('#audio-row'))
  // hideElement($('#validation-button-row'))
  // showElement($('#thank-you-row'))
  // hideElement($('#progress-row'));
  // hideElement($('#skip_btn_row'));
  // hideElement($('#validation-container'));
  // $("#validation-container").removeClass("validation-container");
  // hideElement($('#report_btn'));
  // hideElement($("#test-mic-speakers"));
  // hideElement($('#instructive-msg'));
  // hideElement($('#editor-row'));
  // hideElement($('#thankyou-text'));
  // hideElement($('.simple-keyboard'));
  // hideElement($('#sentenceLabel'));

  // const language = localStorage.getItem('contributionLanguage');
  // const stringifyData = localStorage.getItem('aggregateDataCountByLanguage');
  // const aggregateDetails = JSON.parse(stringifyData);
  // const totalInfo = aggregateDetails.find((element) => element.language === language);
  // if (totalInfo) {
  //   $('#spn-total-hr-contributed').html(totalInfo.total_contributions);
  //   $('#spn-total-hr-validated').html(totalInfo.total_validations);
  // } else {
  //   $('#spn-total-hr-contributed').html(0);
  //   $('#spn-total-hr-validated').html(0);
  // }
  // $('#spn-validation-count').html(validationCount);
  localStorage.setItem(currentIndexKey, 0);
  window.location.href = './thank-you.html';
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#sentences-row'));
  hideElement($('#audio-row'))
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
  hideElement($('.simple-keyboard'));
  $("#validation-container").removeClass("validation-container");
  // $('#start-validation-language').html(localStorage.getItem('contributionLanguage'));
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem("contributionLanguage");
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: validationSentences[currentIndex].contribution_id,
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
$(document).ready(() => {
  hideElement($('.simple-keyboard'));
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
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

  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);
  const type = 'asr';
  const toLanguage = ""; //can be anything
  const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  fetch(`/media/${type}`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify({
      userName: "",
      language: fromLanguage,
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
    }).then((result) => {
    if (result.data.length === 0) {
      showNoSentencesMessage();
      return;
    }
    validationSentences = result.data;
    window.crowdSource = result.data;
    const audio = validationSentences[currentIndex];


    if (audio) {
      getAudioClip(audio.dataset_row_id );
      updateValidationCount();
      resetValidation();
      addListeners();
      setAudioPlayer();
    }
  }).catch((err) => {
    console.log(err)
  });
});

module.exports = {
  setAudioPlayer,
  addListeners,
};

