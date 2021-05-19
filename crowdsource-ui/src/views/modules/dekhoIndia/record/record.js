const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  toggleFooterPosition,
  setFooterPosition,
  updateLocaleLanguagesDropdown,
  showElement,
  hideElement,
  fetchLocationInfo,
  getLocaleString,
  reportSentenceOrRecording
} = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, MODULE, LOCALE_STRINGS} = require('../common/constants');
const {showKeyboard,setInput} = require('../common/virtualKeyboard');
const {isKeyboardExtensionPresent,enableCancelButton,disableCancelButton} = require('../common/common');
const { showUserProfile } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';

const dekhoCountKey = 'dekhoCount';
const currentIndexKey = 'dekhoCurrentIndex';
const sentencesKey = 'dekhoSentencesKey';

let localeStrings;

window.dekhoIndia = {};

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

function markContributionSkipped() {
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: dekhoIndia.sentences[currentIndex].dataset_row_id,
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



function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', dekhoIndia.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localSpeakerDataParsed.language);
  fd.append('sentenceId', dekhoIndia.sentences[currentIndex].dataset_row_id);
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

let currentIndex;
let progressCount = 0, validationCount = 0;

function getNextSentence() {
  if (currentIndex < dekhoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex,dekhoIndia.sentences.length);
    getImage(dekhoIndia.sentences[currentIndex].dataset_row_id);
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
    localStorage.setItem(currentIndexKey, currentIndex);
    showThankYou();
  }
}

const updateDecisionButton = (button, colors) => {
  const children = button.children().children();
  children[0].setAttribute("fill", colors[0]);
  children[1].setAttribute("fill", colors[1]);
  children[2].setAttribute("fill", colors[2]);
}


function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function skipValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = dekhoIndia.sentences[currentIndex].dataset_row_id
  fetch(`/validate/${sentenceId}/${action}`, {
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

const openEditor = function () {
  const $editorRow = $('#editor-row');
  $editorRow.removeClass('d-none')
  // $('#original-text').text('Original Text');
  hideElement($("#need_change"));
  hideElement($("#like_button"));
  showElement($('#cancel-edit-button'))
  showElement($('#submit-edit-button'))
}

const closeEditor = function () {
  hideElement($('#keyboardBox'));
}

function addListeners() {

  const needChangeButton = $("#need_change");
  const $skipButton = $('#skip_button');
  const likeButton = $("#like_button")

  likeButton.hover(() => {
      updateDecisionButton(likeButton, ["#bfddf5", "", "#007BFF"]);
    },
    () => {
      updateDecisionButton(likeButton, ["white", "", "#343A40"]);
    });

  needChangeButton.hover(() => {
      updateDecisionButton(needChangeButton, ["#bfddf5", "#007BFF", "#007BFF"]);
      $("#textarea-row .prompt").addClass('hover-edit');
    },
    () => {
      updateDecisionButton(needChangeButton, ["white", "#007BFF", "#343A40"]);
      $("#textarea-row .prompt").removeClass('hover-edit');
    });

  needChangeButton.mousedown(() => {
    updateDecisionButton(needChangeButton, ["#007BFF", "white", "white"]);
  });

  likeButton.mousedown(() => {
    updateDecisionButton(likeButton, ["#007BFF", "", "white"]);
  });


  needChangeButton.on('click', () => {
    hideElement($('#textarea-row'));
    openEditor();
    const originalText = dekhoIndia.sentences[currentIndex].contribution;
    $('#captured-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
  })

  $("#edit").focus(function () {
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if(!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false'){
      showElement($('#keyboardBox'));
    }
  });

  $('#cancel-edit-button').on('click', () => {
    $("#edit").val("");
    setInput("");
    showElement($('#progress-row'))
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    setInput("");
    hideElement($('#keyboardBox'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#skip_button'))
    showElement($('#thankyou-text'));
    $("#edit").css('pointer-events', 'none');
    $("#cancel-edit-button").attr("disabled", true);
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    showElement($('#progress-row'))
    dekhoIndia.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events', 'none');
    setTimeout(() => {
      hideElement($('#thankyou-text'));
      showElement($('#cancel-edit-button'));
      showElement($('#submit-edit-button'))
      showElement($('#skip_button'))
      $("#edit").css('pointer-events', 'unset');
      $("#edit").val("");
      closeEditor();
      getNextSentence();
    }, 2000)
  })

  likeButton.on('click', () => {
    skipValidation(ACCEPT_ACTION)
    getNextSentence();
  })

  $skipButton.on('click', () => {
    $('#edit').val("");
    setInput("");
    $('#submit-edit-button').attr('disabled', true);
    markContributionSkipped();
    getNextSentence();
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    $("#cancel-edit-button").attr("disabled", true);
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

const setDekhoImage = function (audioLink) {
  $('#view-image').attr('src', audioLink)
};

function disableSkipButton() {
  const $skipButton = $('#skip_button');
  $skipButton.removeAttr('style');
  disableButton($skipButton)
}

function enableButton(element) {
  element.children().removeAttr("opacity")
  element.removeAttr("disabled")
}

const getImage = function (contributionId) {
  // hideAudioRow();
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
        setDekhoImage(e.target.result);
        enableButton($('#skip_button'))
      }
      fileReader.readAsDataURL(blob);
    });
  }).catch((err) => {
    console.log(err)
  });
}

function showThankYou() {
  window.location.href = './thank-you.html';
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#textarea-row'));
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($('#audio-row'))
  hideElement($('#dekho-image'));
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  showElement($('#no-textarea-row'))
  hideElement($('#skip_btn_row'));
  hideElement($('#validation-container'));
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thankyou-text'));
  hideElement($('#keyboardBox'));
  showElement($('#no-sentences-row'));
  $("#validation-container").removeClass("validation-container");
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: dekhoIndia.sentences[currentIndex].dataset_row_id,
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

const initializeComponent = () => {
  const totalItems = dekhoIndia.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);

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

  const validationData = dekhoIndia.sentences[currentIndex];
  addListeners();
  if (validationData) {
    getImage(validationData.dataset_row_id);
    setCurrentSentenceIndex(currentIndex);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex,dekhoIndia.sentences.length)
  }

}

const getLocationInfo = () => {
  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);
}

let selectedReportVal = '';

const executeOnLoad = function () {
  hideElement($('#keyboardBox'));
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  const $validationInstructionModal = $("#validation-instruction-modal");
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  $('#keyboardLayoutName').text(language);
  showKeyboard(language.toLowerCase(),enableCancelButton,disableCancelButton);
  hideElement($('#keyboardBox'));

  if (language) {
    updateLocaleLanguagesDropdown(language);
  }

  getLocationInfo();
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

    if (!localSpeakerDataParsed) {
      location.href = './home.html';
      return;
    }

    showUserProfile(localSpeakerDataParsed.userName);
    const isExistingUser = localSentencesParsed &&
      localSentencesParsed.userName === localSpeakerDataParsed.userName
      &&
      localSentencesParsed.language === localSpeakerDataParsed.language;

    if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === language) {
      setFooterPosition();
      dekhoIndia.sentences = localSentencesParsed.sentences;
      initializeComponent();
    } else {
      localStorage.removeItem(currentIndexKey);
      const type = 'ocr';
      fetch(`/media/${type}`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          language: localSpeakerDataParsed.language,
          toLanguage: '',
        }),
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
          $validationInstructionModal.removeClass("d-none");
          setFooterPosition();
        }
        setFooterPosition();
        dekhoIndia.sentences = sentenceData.data;
        localStorage.setItem(dekhoCountKey, dekhoIndia.sentences.length);
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
  localStorage.setItem(CURRENT_MODULE, MODULE.dekho.value);
  hideElement($('#keyboardBox'));
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
});

module.exports = {
  addListeners,
};
