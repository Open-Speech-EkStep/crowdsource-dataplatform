const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  // toggleFooterPosition,
  setFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording, getDeviceInfo, getBrowserInfo, getLocaleString, translate } = require('../common/utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE,MODULE,LOCALE_STRINGS} = require('../common/constants');
const {showKeyboard,setInput} = require('../common/virtualKeyboard');
const { isKeyboardExtensionPresent,showOrHideExtensionCloseBtn,isMobileDevice,showErrorPopup } = require('../common/common');
const { showUserProfile, onChangeUser,onOpenUserDropDown } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');
const { cdn_url } = require('../common/env-api');
const { initializeFeedbackModal } = require('../common/feedback');
const { setDataSource } = require('../common/sourceInfo');
const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

let currentIndex ;
// let localeStrings;
// eslint-disable-next-line no-unused-vars
let validationCount = 0;

const currentIndexKey = 'dekhoValidatorCurrentIndex';
const sentencesKey = 'dekhoValidatorSentencesKey';
const dekhoValidatorCountKey = 'dekhoValidatorCount';

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

window.dekhoIndiaValidator = {};

function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', dekhoIndiaValidator.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localStorage.getItem(CONTRIBUTION_LANGUAGE));
  fd.append('sentenceId', dekhoIndiaValidator.sentences[currentIndex].dataset_row_id);
  fd.append('state', localStorage.getItem('state_region') || "");
  fd.append('country', localStorage.getItem('country') || "");
  fd.append('device', getDeviceInfo());
  fd.append('browser', getBrowserInfo());
  fd.append('type', MODULE.dekho["api-type"]);
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

function setCapturedText(index) {
  const $capturedtext = $('#original-text');
  const capturedText = dekhoIndiaValidator.sentences[index].contribution;
  $capturedtext.text(capturedText);
  $('#captured-text').text(capturedText);
  $('#edit').text(capturedText);
}

function getNextSentence() {
  if (currentIndex < dekhoIndiaValidator.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1,dekhoIndiaValidator.sentences.length);
    const encodedUrl = encodeURIComponent(dekhoIndiaValidator.sentences[currentIndex].sentence);
    setDekhoImage(`${cdn_url}/${encodedUrl}`);
    setDataSource(dekhoIndiaValidator.sentences[currentIndex].source_info);
    setCapturedText(currentIndex);
    localStorage.setItem(currentIndexKey, currentIndex);
    enableButton($('#skip_button'))
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
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

function skipValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = dekhoIndiaValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = dekhoIndiaValidator.sentences[currentIndex].contribution_id
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
      type: MODULE.dekho["api-type"],
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
  hideElement($('#keyboardBox'));
}

function addListeners() {

  const likeButton = $("#like_button");
  const needChangeButton = $("#need_change");
  // const dislikeButton = $("#dislike_button");
  const $skipButton = $('#skip_button');

  needChangeButton.on('click',()=>{
    if(!isMobileDevice()) {
      showElement($('#virtualKeyBoardBtn'));
    }
    hideElement($('#textarea-row'));
    openEditor();
    const originalText = dekhoIndiaValidator.sentences[currentIndex].contribution;
    $('#captured-text').text(originalText);
    $('#edit').val('');
    $('#edit').val(originalText);
    setInput(originalText);
  })

  $("#edit").focus(function(){
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if(!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false' && !isMobileDevice()){
      showElement($('#keyboardBox'));
    }
  });

  $('#cancel-edit-button').on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    const $submitEditButton = $("#submit-edit-button");
    $submitEditButton.attr('disabled',true);
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    hideElement($('#edit-error-row'))
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    setInput("");
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    hideElement($('#virtualKeyBoardBtn'));
    skipValidation(REJECT_ACTION)
    setInput("");
    hideElement($('#keyboardBox'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#audio-player-btn'))
    hideElement($('#skip_button'))
    showElement($('#thankyou-text'));
    showElement($('#progress-row'));
    dekhoIndiaValidator.editedText = $("#edit").val();
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

function showThankYou() {
  window.location.href = './validator-thank-you.html'
}

function showNoSentencesMessage() {
  const contributionLanguage = localStorage.getItem('contributionLanguage');
  $('#spn-validation-language').html(translate(contributionLanguage));
  hideElement($('#extension-bar'));
  hideElement($('#textarea-row'));
  hideElement($('#virtualKeyBoardBtn'));
  hideElement($('#audio-row'));
  hideElement($('#dekho-image'));
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  hideElement($('#mic-report-row'));
  showElement($('#no-textarea-row'))
  hideElement($('#skip_btn_row'));
  showElement($('#no-sentences-row'));
  hideElement($('#validation-container'));
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thank-you-row'));
  hideElement($('#keyboardInstructions'));
  hideElement($('#keyboardBox'));
  $("#validation-container").removeClass("validation-container");
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem("contributionLanguage");
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: dekhoIndiaValidator.sentences[currentIndex].dataset_row_id,
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

const initializeComponent = () => {
  // showOrHideExtensionCloseBtn();
    hideElement($('#virtualKeyBoardBtn'));
    const totalItems = dekhoIndiaValidator.sentences.length;
    currentIndex = getCurrentIndex(totalItems - 1);
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

    const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    const localeLanguage = localeStrings[contributionLanguage];
    $('#edit-language').text(localeLanguage);
    $('#keyboardLayoutName').text(localeLanguage);

    addListeners();
    const validationData = dekhoIndiaValidator.sentences[currentIndex];
    if (validationData) {
      const encodedUrl = encodeURIComponent(validationData.sentence);
      setDekhoImage(`${cdn_url}/${encodedUrl}`);
      setDataSource(validationData.source_info);
      setCapturedText(currentIndex);
      setCurrentSentenceIndex(currentIndex + 1);
      setTotalSentenceIndex(totalItems);
      updateProgressBar(currentIndex + 1,dekhoIndiaValidator.sentences.length)
    }
}

const getLocationInfo = () => {
  fetchLocationInfo().then(res => {
    return res.json()
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
  localStorage.setItem(CURRENT_MODULE, MODULE.dekho.value);
  const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  initializeFeedbackModal();
  setFooterPosition();
  showKeyboard(contributionLanguage.toLowerCase());
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
  showUserProfile(localSpeakerDataParsed.userName);
  onChangeUser('./validator-page.html',MODULE.dekho.value);
  onOpenUserDropDown();
  const isExistingUser = localSentencesParsed &&
    localSentencesParsed.userName === localSpeakerDataParsed.userName
    &&
    localSentencesParsed.language === localSpeakerDataParsed.language;

  if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === language) {
    setFooterPosition();
    dekhoIndiaValidator.sentences = localSentencesParsed.sentences;
    initializeComponent();
  } else {
    localStorage.removeItem(currentIndexKey);
    const type = 'ocr';
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
    }).then(result => {
      dekhoIndiaValidator.sentences = result.data ? result.data : [];
      localStorage.setItem(dekhoValidatorCountKey, dekhoIndiaValidator.sentences.length);
      localStorage.setItem(
        sentencesKey,
        JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          sentences: dekhoIndiaValidator.sentences,
          language: language,
          toLanguage: ''
        })
      );
      if(dekhoIndiaValidator.sentences.length === 0){
        showNoSentencesMessage();
        return;
      }
      setFooterPosition();

      initializeComponent();
    });
  }
};

$(document).ready(() => {
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
