const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  toggleFooterPosition,
  setFooterPosition,
  getLocaleString,
  showElement,
  hideElement,
  fetchLocationInfo,
  reportSentenceOrRecording,
  getDeviceInfo, getBrowserInfo
} = require('../common/utils');
const { LIKHO_FROM_LANGUAGE, LIKHO_TO_LANGUAGE, LOCALE_STRINGS, CURRENT_MODULE, MODULE, ALL_LANGUAGES } = require('../common/constants');
const { showKeyboard, setInput } = require('../common/virtualKeyboard');
const { isKeyboardExtensionPresent, enableCancelButton, disableCancelButton, isMobileDevice,showOrHideExtensionCloseBtn } = require('../common/common');
const { showUserProfile, onChangeUser,onOpenUserDropDown } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex, updateProgressBar } = require('../common/progressBar');
const speakerDetailsKey = 'speakerDetails';
const {initializeFeedbackModal} = require('../common/feedback');
const { setDataSource } = require('../common/sourceInfo');

const currentIndexKey = 'likhoCurrentIndex';
const sentencesKey = 'likhoSentencesKey';
const likhoCountKey = 'likhoCount';
let localeStrings;

window.likhoIndia = {};
// device-browser
function uploadToServer(cb) {
  const fd = new FormData();
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const speakerDetails = JSON.stringify({
    userName: localSpeakerDataParsed.userName,
  });
  fd.append('userInput', likhoIndia.editedText);
  fd.append('speakerDetails', speakerDetails);
  fd.append('language', localStorage.getItem(LIKHO_TO_LANGUAGE));
  fd.append('sentenceId', likhoIndia.sentences[currentIndex].dataset_row_id);
  fd.append('state', localStorage.getItem('state_region') || "");
  fd.append('country', localStorage.getItem('country') || "");
  fd.append('device', getDeviceInfo());
  fd.append('browser', getBrowserInfo());
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
    })
    .then((finalRes) => {
      if (cb && typeof cb === 'function') {
        cb();
      }
    });
}

let currentIndex;

function disableButton(button) {
  button.children().attr("opacity", "50%");
  button.attr("disabled", "disabled");
}

function enableButton(element) {
  element.children().removeAttr("opacity")
  element.removeAttr("disabled")
}

function disableSkipButton() {
  const $skipButton = isMobileDevice() ? $('#skip_button_mob') : $('#skip_button');
  $skipButton.removeAttr('style');
  disableButton($skipButton)
}

function getNextSentence() {
  if (currentIndex < likhoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, likhoIndia.sentences.length);
    setSentence(likhoIndia.sentences[currentIndex].media_data);
    setDataSource(likhoIndia.sentences[currentIndex].source_info);
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

const closeEditor = function () {
  hideElement($('#keyboardBox'));
}

const openEditor = function () {
  showElement($('#keyboardBox'));
}




function markContributionSkipped() {
  const contributionLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
  const state_region = localStorage.getItem('state_region') || "";
  const country = localStorage.getItem('country') || "";
  const reqObj = {
    sentenceId: likhoIndia.sentences[currentIndex].dataset_row_id,
    userName: speakerDetails.userName,
    language: contributionLanguage,
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    state_region: state_region,
    country: country
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
    .catch((err) => {})
}

function addListeners() {

  const $skipButton = $('#skip_button');

  $("#edit").focus(function () {
    const isPhysicalKeyboardOn = localStorage.getItem("physicalKeyboard");

    if (!isKeyboardExtensionPresent() && isPhysicalKeyboardOn === 'false') {
      showElement($('#keyboardBox'));
    }
  });

  $('#cancel-edit-button').on('click', () => {
    $("#edit").val("");
    setInput("");
    showElement($('#progress-row'))
    hideElement($('#edit-error-row'))
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    const $cancelEditButton = $('#cancel-edit-button');
    $cancelEditButton.attr('disabled', true);
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    setInput("");
    hideElement($('#keyboardBox'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#audio-player-btn'))
    hideElement($('#skip_button'))
    showElement($('#thankyou-text'));
    likhoIndia.editedText = $("#edit").val();
    $("#edit").css('pointer-events', 'none');
    $("#cancel-edit-button").attr("disabled", true);
    const $submitEditButton = $('#submit-edit-button');
    $submitEditButton.attr('disabled', true);
    showElement($('#progress-row'))
    try {
      uploadToServer();
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
    } catch (e) {}

  })

  $skipButton.on('click', () => {
    disableSkipButton();
    if ($('#pause').hasClass('d-none')) {
      $('#pause').trigger('click');
    }
    $('#edit').val("");
    setInput("");
    $('#submit-edit-button').attr('disabled', true);
    hideElement($('#edit-error-row'))
    $("#edit-text").removeClass('edit-error-area').addClass('edit-text');
    markContributionSkipped();
    getNextSentence();
    showElement($('#sentences-row'));
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


function showThankYou() {
  window.location.href = './thank-you.html';
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem(LIKHO_FROM_LANGUAGE));
  hideElement($('#extension-bar'));
  hideElement($('#sentences-row'));
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
  hideElement($('#thankyou-text'));
  hideElement($('#keyboardBox'));
  $("#validation-container").removeClass("validation-container");
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem("contributionLanguage");
  const otherText = $("#other_text").val();
  const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

  const reqObj = {
    sentenceId: likhoIndia.sentences[currentIndex].dataset_row_id,
    reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
    language: contributionLanguage,
    userName: speakerDetails ? speakerDetails.userName : '',
    source: "contribution"
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

const setSentence = function (text) {
  $('#captured-text').text(text);
  $('#edit').val('');
  setInput("");
}

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

let selectedReportVal = '';
const initialize = function () {
  const totalItems = likhoIndia.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const language = localStorage.getItem(LIKHO_FROM_LANGUAGE);

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

  const translation = likhoIndia.sentences[currentIndex];
  addListeners();

  if (translation) {
    setSentence(translation.media_data);
    setDataSource(translation.source_info);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1, likhoIndia.sentences.length)
  }
};

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  // const dropDown = $('#localisation_dropdown');
  // const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  // const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  // const invalidToLang = toLanguage.toLowerCase() === "english" || toLang.hasLocaleText === false;
  // const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  // if (invalidToLang && invalidFromLang) {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  // } else if (invalidFromLang) {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
  //     <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  // } else if (invalidToLang) {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
  //       <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  // } else if (toLanguage.toLowerCase() === language.toLowerCase()) {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
  //       <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  // } else {
  //   dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
  //       <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
  //       <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  // }
}

function executeOnLoad() {
  // toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  const $validationInstructionModal = $("#validation-instruction-modal");
  const $errorModal = $('#errorModal');
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
  const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  $('#keyboardLayoutName').text(toLanguage);
  $('#from-label').text(fromLanguage);
  $('#to-label').text(toLanguage);

  if (fromLanguage && toLanguage) {
    updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
  }

  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch((err) => {});
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
      location.href = './home.html';
    });

    if (!localSpeakerDataParsed) {
      location.href = './home.html';
      return;
    }

    showUserProfile(localSpeakerDataParsed.userName);
    onChangeUser('./record.html',MODULE.likho.value);
    onOpenUserDropDown();
    const isExistingUser = localSentencesParsed &&
      localSentencesParsed.userName === localSpeakerDataParsed.userName
      &&
      localSentencesParsed.language === localSpeakerDataParsed.language;

    if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === fromLanguage && localSentencesParsed.toLanguage === toLanguage) {
      $loader.hide();
      $pageContent.removeClass('d-none');
      setFooterPosition();
      likhoIndia.sentences = localSentencesParsed.sentences;
      initialize();
    } else {
      localStorage.removeItem(currentIndexKey);
      const type = 'parallel';
      fetch(`/media/${type}`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          language: fromLanguage,
          toLanguage: toLanguage,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => {
          if (!data.ok) {
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
            $validationInstructionModal.removeClass("d-none");
            setFooterPosition();
          }
          $pageContent.removeClass('d-none');
          setFooterPosition();

          likhoIndia.sentences = sentenceData.data;
          localStorage.setItem(likhoCountKey, likhoIndia.sentences.length);
          $loader.hide();
          localStorage.setItem(
            sentencesKey,
            JSON.stringify({
              userName: localSpeakerDataParsed.userName,
              sentences: sentenceData.data,
              language: fromLanguage,
              toLanguage: toLanguage
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

$(document).ready(() => {
  const browser = getBrowserInfo();
  const isNotChrome = !browser.includes('Chrome');
  if(isMobileDevice() || isNotChrome){
    hideElement($('#extension-bar'));
  } else {
    showOrHideExtensionCloseBtn();
  }
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  const translationLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
  initializeFeedbackModal();
  showKeyboard(translationLanguage.toLowerCase(), enableCancelButton, disableCancelButton);
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


