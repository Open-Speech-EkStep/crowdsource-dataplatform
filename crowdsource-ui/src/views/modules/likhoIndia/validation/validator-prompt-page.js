const fetch = require('../common/fetch')
const { setPageContentHeight, toggleFooterPosition,setFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, MODULE,TO_LANGUAGE} = require('../common/constants');
const {showKeyboard} = require('../common/virtualKeyboard');
const { setInput } = require('../common/virtualKeyboard');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = 'likhoValidatorCurrentIndex';
const sentencesKey = 'likhoValidatorSentencesKey';
const likhoValidatorCountKey = 'likhoValidatorCount';

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

const setCurrentSentenceIndex = (index) => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = index;
}

const setTotalSentenceIndex = (index) => {
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = index;
}

window.likhoIndiaValidator = {};

function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', likhoIndiaValidator.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localSpeakerDataParsed.language);
  fd.append('sentenceId', likhoIndiaValidator.sentences[currentIndex].dataset_row_id);
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

let currentIndex, progressCount = 0, validationCount = 0;

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
  const capturedText = likhoIndiaValidator.sentences[index].contribution;
  $('#edit').text(capturedText);
}

function getNextSentence() {
  if (currentIndex < likhoIndiaValidator.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex)
    setSentence(likhoIndiaValidator.sentences[currentIndex].sentence);
    setTranslation(likhoIndiaValidator.sentences[currentIndex].contribution);
    setCapturedText(currentIndex);
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

const updateValidationCount = () => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = progressCount;
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = likhoIndiaValidator.sentences.length;
}

const updateProgressBar = (index) => {
  console.log("index",index)
  const $progressBar = $("#progress_bar");
  const multiplier = 10 * (10 / likhoIndiaValidator.sentences.length);
  $progressBar.width(index * multiplier + '%');
  $progressBar.prop('aria-valuenow', index);
  setCurrentSentenceIndex(index);
}

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function skipValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = likhoIndiaValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = likhoIndiaValidator.sentences[currentIndex].contribution_id
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
    const originalText = likhoIndiaValidator.sentences[currentIndex].contribution;
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
    likhoIndiaValidator.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events','none');
    setTimeout(()=>{
      closeEditor();
      showElement($('#progress-row'))
      showElement($('#textarea-row'));
      hideElement($('#thankyou-text'));
      getNextSentence();
      $("#edit").css('pointer-events','unset');
    }, 2000)
  })

  likeButton.on('click', () => {
    skipValidation(ACCEPT_ACTION)
    getNextSentence();
  })

  $skipButton.on('click', () => {
    $('#pause').trigger('click');
    skipValidation(SKIP_ACTION)
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
  // hideElement($('#textarea-row'));
  // hideElement($('#dekho-image'));
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
  window.location.href = "./validator-thank-you.html"
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
    sentenceId: likhoIndiaValidator.sentences[currentIndex].contribution_id,
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
  const totalItems = likhoIndiaValidator.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
    const validationData = likhoIndiaValidator.sentences[currentIndex];
    addListeners();
    if (validationData) {
      setSentence(validationData.sentence);
      setTranslation(validationData.contribution);
      setCapturedText(currentIndex);
      setCurrentSentenceIndex(currentIndex);
      setTotalSentenceIndex(totalItems);
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
$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const toLanguage = localStorage.getItem(TO_LANGUAGE);
  setFooterPosition();
  showKeyboard(toLanguage.toLowerCase());
  hideElement($('.simple-keyboard'));
  toggleFooterPosition();
  setPageContentHeight();
  $('#from-label').text(fromLanguage);
  $('#to-label').text(toLanguage);

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
  const localSpeakerData = localStorage.getItem(speakerDetailsKey);
  const localSpeakerDataParsed = JSON.parse(localSpeakerData);
  const localSentences = localStorage.getItem(sentencesKey);
  const localSentencesParsed = JSON.parse(localSentences);
  setPageContentHeight();
  if (!localSpeakerDataParsed) {
    location.href = './home.html';
    return;
  }

  const isExistingUser = localSentencesParsed &&
    localSentencesParsed.userName === localSpeakerDataParsed.userName
    &&
    localSentencesParsed.language === localSpeakerDataParsed.language;

  if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === fromLanguage && localSentencesParsed.toLanguage === toLanguage) {
    setFooterPosition();
    likhoIndiaValidator.sentences = localSentencesParsed.sentences;
    initializeComponent();
  } else {
    localStorage.removeItem(currentIndexKey);
    const type = 'parallel';
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
      }).then(result => {
      setFooterPosition();
      likhoIndiaValidator.sentences = result.data;
      localStorage.setItem(likhoValidatorCountKey, likhoIndiaValidator.sentences.length);
      localStorage.setItem(
        sentencesKey,
        JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          sentences: result.data,
          language: fromLanguage,
          toLanguage: toLanguage
        })
      );
      initializeComponent();
    }).catch((err) => {
      console.log(err);
    })
  }
});

module.exports = {
  setCapturedText,
  addListeners,
};
