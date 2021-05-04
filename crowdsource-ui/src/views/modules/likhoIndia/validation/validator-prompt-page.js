const fetch = require('../common/fetch')
const { setPageContentHeight, toggleFooterPosition,setFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, MODULE} = require('../common/constants');
const {showKeyboard} = require('../common/virtualKeyboard');
const { setInput } = require('../common/virtualKeyboard');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

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

let currentIndex = 0, progressCount = 0, validationCount = 0;

const animateCSS = ($element, animationName, callback) => {
  $element.addClass(`animated ${animationName}`);

  function handleAnimationEnd() {
    $element.removeClass(`animated ${animationName}`);
    $element.off('animationend');
    if (typeof callback === 'function') callback();
  }

  $element.on('animationend', handleAnimationEnd);
};

function setCapturedText(index) {
  const capturedText = validationSentences[index].contribution;
  $('#edit').text(capturedText);
}

function getNextSentence() {
  console.log("next Sentence", currentIndex)
  if (currentIndex < validationSentences.length - 1) {
    currentIndex++;
    setSentence(validationSentences[currentIndex].sentence);
    setTranslation(validationSentences[currentIndex].contribution);
    setCapturedText(currentIndex);
  } else {
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

function skipValidation(action) {
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

const openEditor = function (){
  const $editorRow = $('#editor-row');
  $editorRow.removeClass('d-none')
  // $('#original-text').text('Original Text');
  hideElement($("#need_change"));
  hideElement($("#like_button"));
  showElement($('#cancel-edit-button'))
  showElement($('#submit-edit-button'))
}

const closeEditor = function (){
  const $editorRow = $('#editor-row');
  hideElement($editorRow);
  showElement($("#need_change"));
  showElement($("#skip_button"));
  showElement($("#like_button"));
  hideElement($('#cancel-edit-button'))
  hideElement($('#submit-edit-button'))
  hideElement($('.simple-keyboard'));
}

function addListeners() {

  const likeButton = $("#like_button");
  const needChangeButton = $("#need_change");
  const $skipButton = $('#skip_button');

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


  needChangeButton.on('click',()=>{
    showElement($('#editor-row'));
    openEditor();
    const originalText = validationSentences[currentIndex].contribution;
    $('#captured-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
  })

  $("#edit").focus(function(){
    const $submitEditButton = $("#submit-edit-button");
    $submitEditButton.removeAttr('disabled');
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#007BFF');
    hideElement($('#progress-row'));
    showElement($('.simple-keyboard'));
  });

  $('#cancel-edit-button').on('click', () => {
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    setInput("");
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    setInput("");
    hideElement($('.simple-keyboard'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#skip_button'))
    showElement($('#thankyou-text'));
    showElement($('#progress-row'))
    crowdSource.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events','none');
    setTimeout(()=>{
      closeEditor();
      showElement($('#progress-row'))
      showElement($('#textarea-row'));
      hideElement($('#thankyou-text'));
      updateProgressBar();
      getNextSentence();
      $("#edit").css('pointer-events','unset');
    }, 2000)
  })

  likeButton.on('click', () => {
    skipValidation(ACCEPT_ACTION)
    updateProgressBar();
    getNextSentence();
  })

  $skipButton.on('click', () => {
    $('#pause').trigger('click');
    skipValidation(SKIP_ACTION)
    updateProgressBar();
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    getNextSentence();
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

function showThankYou() {
  hideElement($('#textarea-row'));
  hideElement($('#dekho-image'));
  hideElement($('#audio-row'))
  hideElement($('#validation-button-row'))
  showElement($('#thank-you-row'))
  hideElement($('#progress-row'));
  hideElement($('#skip_btn_row'));
  hideElement($('#validation-container'));
  $("#validation-container").removeClass("validation-container");
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thankyou-text'));
  hideElement($('.simple-keyboard'));
  hideElement($('#sentenceLabel'));

  const language = localStorage.getItem('contributionLanguage');
  const stringifyData = localStorage.getItem('aggregateDataCountByLanguage');
  const aggregateDetails = JSON.parse(stringifyData);
  const totalInfo = aggregateDetails.find((element) => element.language === language);
  if (totalInfo) {
    $('#spn-total-hr-contributed').html(totalInfo.total_contributions);
    $('#spn-total-hr-validated').html(totalInfo.total_validations);
  } else {
    $('#spn-total-hr-contributed').html(0);
    $('#spn-total-hr-validated').html(0);
  }
  $('#spn-validation-count').html(validationCount);
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#textarea-row'));
  hideElement($('#audio-row'))
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
  hideElement($('.simple-keyboard'));
  $("#validation-container").removeClass("validation-container");
  $('#start-validation-language').html(localStorage.getItem('contributionLanguage'));
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

const setSentence = function (sentence){
  $('#original-text').text(sentence);
}

const setTranslation = function (translatedText){
  $('#translate-text').text(translatedText);
}


const initializeComponent = () => {
  const type = 'parallel';
  const toLanguage = localStorage.getItem('to-language');
  const fromLanguage = localStorage.getItem('from-language');
  fetch(`/contributions/${type}?from=${fromLanguage}&to=${toLanguage}`, {
    credentials: 'include',
    mode: 'cors'
  })
    .then((data) => {
      if (!data.ok) {
        throw Error(data.statusText || 'HTTP error');
      } else {
        return data.json();
      }
    }).then((result) => {
    // if (result.data.length === 0) {
    //   showNoSentencesMessage();
    //   return;
    // }
    validationSentences = result.data;
    window.crowdSource = result.data;
    const validationData = validationSentences[currentIndex];
    addListeners();
    console.log(validationSentences)

    if (validationData) {
      setSentence(validationData.sentence);
      setTranslation(validationData.contribution);
      setCapturedText(currentIndex);
      updateValidationCount();
    }
  }).catch((err) => {
    console.log(err)
  });
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
$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  setFooterPosition();
  showKeyboard(contributionLanguage.toLowerCase());
  hideElement($('.simple-keyboard'));
  toggleFooterPosition();
  setPageContentHeight();
  const fromLanguage = localStorage.getItem('from-language');
  const toLanguage = localStorage.getItem('to-language');
  if (fromLanguage && toLanguage) {
    updateLocaleLanguagesDropdown(fromLanguage);
  }

  $("#start_contributing_id").on('click', function () {
    const data = localStorage.getItem("speakerDetails");
    if (data !== null) {
      const speakerDetails = JSON.parse(data);
      speakerDetails.language = fromLanguage;
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

  getLocationInfo();
  initializeComponent();
});

module.exports = {
  setCapturedText,
  addListeners,
};
