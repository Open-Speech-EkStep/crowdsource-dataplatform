const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  // toggleFooterPosition,
  setFooterPosition,
  showElement,
  hideElement,
  fetchLocationInfo,
  reportSentenceOrRecording,
  getDeviceInfo,
  getBrowserInfo,
  getLocaleString,
  translate,
  safeJson
} = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, PARALLEL_TO_LANGUAGE,LOCALE_STRINGS,config,INITIATIVES} = require('../common/constants');
const {showKeyboard, setInput} = require('../common/virtualKeyboard');
const {isKeyboardExtensionPresent,showOrHideExtensionCloseBtn,isMobileDevice,showErrorPopup, updateParallelLocaleLanguagesDropdown,redirectToHomeForDirectLanding} = require('../common/common');
const {setCurrentSentenceIndex, setTotalSentenceIndex, updateProgressBar} = require('../common/progressBar');
const {showUserProfile, onChangeUser,onOpenUserDropDown} = require('../common/header');
const { setDataSource } = require('../common/sourceInfo');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';
const {initializeFeedbackModal} = require('../common/feedback');

const currentIndexKey = `${config.initiativeKey_3}ValidatorCurrentIndex`;
const parallelValidatorCountKey = `${config.initiativeKey_3}ValidatorCount`;

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

function showNoSentencesMessage() {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  $('#spn-validation-language').html(translate(contributionLanguage));
  hideElement($('#extension-bar'));
  hideElement($('#sentences-row'));
  hideElement($('#translation-row'));
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($('#audio-row'))
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  hideElement($('#mic-report-row'));
  showElement($('#no-sentences-row'))
  hideElement($('#skip_btn_row'));
  hideElement($('#validation-container'));
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thank-you-row'));
  hideElement($('#keyboardBox'));
  $("#validation-container").removeClass("validation-container");
}

window.parallelValidator = {};

function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', parallelValidator.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localStorage.getItem(PARALLEL_TO_LANGUAGE));
  fd.append('fromLanguage', localStorage.getItem(CONTRIBUTION_LANGUAGE));
  fd.append('sentenceId', parallelValidator.sentences[currentIndex].dataset_row_id);
  fd.append('state', localStorage.getItem('state_region') || "");
  fd.append('country', localStorage.getItem('country') || "");
  fd.append('device', getDeviceInfo());
  fd.append('browser', getBrowserInfo());
  fd.append('type', INITIATIVES.parallel.type);
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

let currentIndex;
// eslint-disable-next-line no-unused-vars
let validationCount = 0;

function setCapturedText(index) {
  const capturedText = parallelValidator.sentences[index].contribution;
  $('#edit').text(capturedText);
}

function enableButton(element) {
  element.children().removeAttr("opacity")
  element.removeAttr("disabled")
}

function getNextSentence() {
  if (currentIndex < parallelValidator.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, parallelValidator.sentences.length)
    setSentence(parallelValidator.sentences[currentIndex].sentence);
    setDataSource(parallelValidator.sentences[currentIndex].source_info);
    setTranslation(parallelValidator.sentences[currentIndex].contribution);
    setCapturedText(currentIndex);
    localStorage.setItem(currentIndexKey, currentIndex);
    enableButton($('#skip_button'))
  } else {
    localStorage.setItem(currentIndexKey, currentIndex);
    // showThankYou();
    disableSkipButton();
    setTimeout(showThankYou, 1000);
  }
}

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function disableSkipButton() {
  const $skipButton = $('#skip_button');
  $skipButton.removeAttr('style');
  disableButton($skipButton)
}

function skipValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = parallelValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = parallelValidator.sentences[currentIndex].contribution_id
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
      type: INITIATIVES.parallel.type,
      fromLanguage: localStorage.getItem("contributionLanguage"),
      language: localStorage.getItem(PARALLEL_TO_LANGUAGE)
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
  hideElement($("#need_change"));
  hideElement($("#like_button"));
  showElement($('#cancel-edit-button'))
  showElement($('#submit-edit-button'))
}

const closeEditor = function () {
  const $editorRow = $('#editor-row');
  hideElement($editorRow);
  showElement($("#need_change"));
  showElement($("#skip_button"));
  showElement($("#like_button"));
  hideElement($('#cancel-edit-button'))
  hideElement($('#submit-edit-button'))
  hideElement($('#keyboardBox'));
}

function addListeners() {
  const likeButton = $("#like_button");
  const needChangeButton = $("#need_change");
  const $skipButton = $('#skip_button');

  needChangeButton.on('click', () => {
    if(!isMobileDevice()) {
      showElement($('#virtualKeyBoardBtn'));
    }
    showElement($('#editor-row'));
    openEditor();
    const originalText = parallelValidator.sentences[currentIndex].contribution;
    $('#captured-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
  })

  $("#edit").focus(function () {
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if (!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false' && !isMobileDevice()) {
      showElement($('#keyboardBox'));
    }
  });

  $('#cancel-edit-button').on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    const $submitEditButton = $("#submit-edit-button");
    $submitEditButton.attr('disabled', true);
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    hideElement($('#edit-error-row'))
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    setInput("");
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    skipValidation(REJECT_ACTION);
    setInput("");
    hideElement($('#keyboardBox'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#skip_button'))
    showElement($('#thank-you-row'));
    showElement($('#progress-row'))
    hideElement($('#edit-error-row'))
    const previousActiveError = $("#edit-error-text .error-active");
    previousActiveError && previousActiveError.removeClass('error-active').addClass('d-none');
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    parallelValidator.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events', 'none');
    setTimeout(() => {
      closeEditor();
      showElement($('#progress-row'))
      showElement($('#textarea-row'));
      hideElement($('#thank-you-row'));
      getNextSentence();
      $("#edit").css('pointer-events', 'unset');
    }, 2000)
  })

  likeButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    skipValidation(ACCEPT_ACTION)
    getNextSentence();
  })

  $skipButton.on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    disableSkipButton();
    $('#pause').trigger('click');
    skipValidation(SKIP_ACTION)
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    hideElement($('#edit-error-row'))
    $("#edit-text").removeClass('edit-error-area');
    getNextSentence();
    closeEditor();
  })

  $skipButton.mousedown(() => {
    $skipButton.css('background-color', '#bfddf5')
  })
}

function showThankYou() {
  window.location.href = "./validator-thank-you.html"
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: parallelValidator.sentences[currentIndex].contribution_id,
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
    }else {
      $("#report_sentence_modal").modal('hide');
  }
  }).catch(()=> { $("#report_sentence_modal").modal('hide');});
}

const setSentence = function (sentence) {
  $('#original-text').text(sentence);
}

const setTranslation = function (translatedText) {
  $('#translate-text').text(translatedText);
}


const initializeComponent = () => {
  showOrHideExtensionCloseBtn();
  hideElement($('#virtualKeyBoardBtn'));
  const totalItems = parallelValidator.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const validationData = parallelValidator.sentences[currentIndex];
  const toLanguage = localStorage.getItem(PARALLEL_TO_LANGUAGE);
  const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));

  const localeToLanguage = localeStrings[toLanguage];
  const localeFromLanguage = localeStrings[fromLanguage];

  $('#keyboardLayoutName').text(localeToLanguage);
  $('#from-label').text(localeFromLanguage);
  $('#to-label').text(localeToLanguage);
  $('#edit-language').text(localeToLanguage);

  addListeners();

  if (validationData) {
    setSentence(validationData.sentence);
    setDataSource(validationData.source_info);
    setTranslation(validationData.contribution);
    setCapturedText(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1, parallelValidator.sentences.length)
  }
}

const getLocationInfo = () => {
  fetchLocationInfo().then(res => {
    return safeJson(res);
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch((err) => {console.log(err)});
}

let selectedReportVal = '';
const executeOnLoad = function () {
  const browser = getBrowserInfo();
  const isNotChrome = !browser.includes('Chrome');
  if(isMobileDevice()) {
    hideElement($('#virtualKeyBoardBtn'));
  }
  if(isMobileDevice() || isNotChrome){
    hideElement($('#extension-bar'));
  } else {
    showOrHideExtensionCloseBtn();
  }
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
  const fromLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  const toLanguage = localStorage.getItem(PARALLEL_TO_LANGUAGE);
  initializeFeedbackModal();
  setFooterPosition();
  showKeyboard(toLanguage.toLowerCase());
  hideElement($('#keyboardBox'));
  // toggleFooterPosition();
  setPageContentHeight();
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const localeToLanguage = localeStrings[toLanguage];
  const localeFromLanguage = localeStrings[fromLanguage];
  $('#keyboardLayoutName').text(localeToLanguage);
  $('#from-label').text(localeFromLanguage);
  $('#to-label').text(localeToLanguage);

  if (fromLanguage && toLanguage) {
    updateParallelLocaleLanguagesDropdown(fromLanguage, toLanguage);
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
    $('#skip_button').click();
  });

  $("input[type=radio][name=reportRadio]").on("change", function () {
    selectedReportVal = this.value;
    $("#report_submit_id").attr("disabled", false);
  });

  getLocationInfo();
  const localSpeakerData = localStorage.getItem(speakerDetailsKey);
  const localSpeakerDataParsed = JSON.parse(localSpeakerData);
  setPageContentHeight();

  if (!localSpeakerDataParsed) {
    location.href = './home.html';
    return;
  }
  showUserProfile(localSpeakerDataParsed.userName)
  onChangeUser('./validator-page.html',INITIATIVES.parallel.value);
  onOpenUserDropDown();
    localStorage.removeItem(currentIndexKey);
    const type = 'parallel';
    fetch(`/contributions/${type}?from=${fromLanguage}&to=${toLanguage}&username=${localSpeakerDataParsed.userName}`, {
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
    }).then(result => {
      parallelValidator.sentences = result.data ? result.data : [];
      localStorage.setItem(parallelValidatorCountKey, parallelValidator.sentences.length);
      if (parallelValidator.sentences.length == 0) {
        showNoSentencesMessage();
        return;
      }
      $('#need_change').removeAttr('disabled');
      $('#like_button').removeAttr('disabled');
      $('#skip_button').removeAttr('disabled');

      setFooterPosition();

      initializeComponent();
    });
};

$(document).ready(() => {
  redirectToHomeForDirectLanding();
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
})

module.exports = {
  setCapturedText,
  addListeners,
};
