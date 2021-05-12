const fetch = require('../common/fetch')
const { setPageContentHeight, toggleFooterPosition,setFooterPosition, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('../common/utils');
const {LIKHO_FROM_LANGUAGE, CURRENT_MODULE, MODULE,LIKHO_TO_LANGUAGE,ALL_LANGUAGES} = require('../common/constants');
const {showKeyboard,setInput} = require('../common/virtualKeyboard');
const { isKeyboardExtensionPresent } = require('../common/common');

const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = 'likhoValidatorCurrentIndex';
const sentencesKey = 'likhoValidatorSentencesKey';
const likhoValidatorCountKey = 'likhoValidatorCount';

const updateLocaleLanguagesDropdown = (language, toLanguage) => {
  const dropDown = $('#localisation_dropdown');
  const localeLang = ALL_LANGUAGES.find(ele => ele.value === language);
  const toLang = ALL_LANGUAGES.find(ele => ele.value === toLanguage);
  const invalidToLang = toLanguage.toLowerCase() === "english" || toLanguage.hasLocaleText === false;
  const invalidFromLang = language.toLowerCase() === "english" || localeLang.hasLocaleText === false;
  if (invalidToLang && invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>`);
  } else if (invalidFromLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
      <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  } else if (invalidToLang) {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  } else if (toLanguage.toLowerCase() === language.toLowerCase()){
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>`);
  }else {
    dropDown.html(`<a id="english" class="dropdown-item" href="#" locale="en">English</a>
        <a id=${localeLang.value} class="dropdown-item" href="#" locale="${localeLang.id}">${localeLang.text}</a>
        <a id=${toLang.value} class="dropdown-item" href="#" locale="${toLang.id}">${toLang.text}</a>`);
  }
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

const setCurrentSentenceIndex = (index) => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = index;
}

const setTotalSentenceIndex = (index) => {
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = index;
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem(LIKHO_FROM_LANGUAGE));
  hideElement($('#sentences-row'));
  hideElement($('#translation-row'));
  hideElement($('#virtualKeyBoardBtn'));
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
  hideElement($('#thank-you-row'));
  hideElement($('#keyboardBox'));
  $("#validation-container").removeClass("validation-container");
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

let currentIndex;
let validationCount = 0;

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

const updateProgressBar = (index) => {
  const $progressBar = $("#progress_bar");
  const multiplier = 10 * (10 / likhoIndiaValidator.sentences.length);
  $progressBar.width(index * multiplier + '%');
  $progressBar.prop('aria-valuenow', index);
  setCurrentSentenceIndex(index);
}

function skipValidation(action) {
  if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
    validationCount++;
  }
  const sentenceId = likhoIndiaValidator.sentences[currentIndex].dataset_row_id
  const contribution_id = likhoIndiaValidator.sentences[currentIndex].contribution_id
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
    if(! isKeyboardExtensionPresent()){
      showElement($('#keyboardBox'));
    }
  });

  $('#cancel-edit-button').on('click', () => {
    const $submitEditButton = $("#submit-edit-button");
    $submitEditButton.attr('disabled',true);
    const children = $submitEditButton.children().children();
    children[0].setAttribute("fill", '#D7D7D7');
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
    setInput("");
    closeEditor();
  })

  $('#submit-edit-button').on('click', () => {
    skipValidation(REJECT_ACTION);
    setInput("");
    hideElement($('#keyboardBox'));
    hideElement($('#cancel-edit-button'));
    hideElement($('#submit-edit-button'))
    hideElement($('#skip_button'))
    showElement($('#thank-you-row'));
    showElement($('#progress-row'))
    likhoIndiaValidator.editedText = $("#edit").val();
    uploadToServer();
    $("#edit").css('pointer-events','none');
    setTimeout(()=>{
      closeEditor();
      showElement($('#progress-row'))
      showElement($('#textarea-row'));
      hideElement($('#thank-you-row'));
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

function showThankYou() {
  window.location.href = "./validator-thank-you.html"
}

const handleSubmitFeedback = function () {
  const contributionLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
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
      updateProgressBar(currentIndex)
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
  const fromLanguage = localStorage.getItem(LIKHO_FROM_LANGUAGE);
  const toLanguage = localStorage.getItem(LIKHO_TO_LANGUAGE);
  setFooterPosition();
  showKeyboard(toLanguage.toLowerCase());
  hideElement($('#keyboardBox'));
  toggleFooterPosition();
  setPageContentHeight();
  $('#keyboardLayoutName').text(toLanguage);
  $('#from-label').text(fromLanguage);
  $('#to-label').text(toLanguage);

  if (fromLanguage && toLanguage) {
    updateLocaleLanguagesDropdown(fromLanguage, toLanguage);
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
    fetch(`/contributions/${type}?from=${fromLanguage}&to=${toLanguage}&username=${localSpeakerDataParsed.userName}`, {
      credentials: 'include',
      mode: 'cors'
    })
      .then((data) => {
        if (!data.ok) {
          showNoSentencesMessage();
          throw Error(data.statusText || 'HTTP error');
        } else {
          return data.json();
        }
      }).then(result => {
        if(result.data.length == 0){
          showNoSentencesMessage();
          return;
        }
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
