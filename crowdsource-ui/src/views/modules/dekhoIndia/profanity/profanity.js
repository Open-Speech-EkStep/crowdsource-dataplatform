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
const { cdn_url } = require('../common/env-api');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, MODULE, LOCALE_STRINGS} = require('../common/constants');
const { showUserProfile } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');

const speakerDetailsKey = 'profanityUserDetails';

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

let currentIndex;
let validationCount = 0;

function getNextSentence() {
  if (currentIndex < dekhoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1,dekhoIndia.sentences.length);
    setDekhoImage(`${cdn_url}/${dekhoIndia.sentences[currentIndex].media}`);
    localStorage.setItem(currentIndexKey, currentIndex);
  } else {
    const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
    Object.assign(sentencesObj, { sentences: [] });
    localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
    localStorage.setItem(currentIndexKey, currentIndex);
    showThankYou();
  }
}

function updateProfanityState(userName, sentenceId, language, state){
  const fd = new FormData();
  // fd.append('language', language);
  fd.append('sentenceId', sentenceId);
  fd.append('profanityStatus', state);
  fd.append('userName', userName);
  return fetch(`/profanity-status/ocr`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: userName,
      profanityStatus: state,
      sentenceId: sentenceId
    })
  });
}

function onProfanityUpdated(){
  hideElement($('#cancel-edit-button'));
  hideElement($('#submit-edit-button'))
  hideElement($('#skip_button'))
  showElement($('#thankyou-text'));
  showElement($('#progress-row'))
  try{
    setTimeout(() => {
      hideElement($('#thankyou-text'));
      showElement($('#cancel-edit-button'));
      showElement($('#submit-edit-button'))
      showElement($('#skip_button'))
      getNextSentence();
    }, 2000)
  } catch (e){
    console.log(e)
  }
}

function invokeProfanityStateUpdate(state){
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
    updateProfanityState(localSpeakerDataParsed.userName, dekhoIndia.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
      .then(res=>{
        onProfanityUpdated();
      }).catch(err=>{
        console.log(err);
      })
}

function addListeners() {

  const $skipButton = $('#skip_button');

  $('#cancel-edit-button').on('click', () => {
    invokeProfanityStateUpdate(false);
  })

  $('#submit-edit-button').on('click', () => {
    invokeProfanityStateUpdate(true);
  })

  $skipButton.on('click', () => {
    getNextSentence();
    showElement($('#textarea-row'));
    showElement($('#progress-row'));
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


function showThankYou() {
  $("#profanityThankYouModal").modal('show');
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
  hideElement($('#audio-row'))
  hideElement($('#dekho-image'));
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  hideElement($('#skip_btn_row'));
  hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thankyou-text'));
  showElement($('#no-sentences-row'));
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

  // $("#start_contributing_id").on('click', function () {
  //   const data = localStorage.getItem("speakerDetails");
  //   if (data !== null) {
  //     const speakerDetails = JSON.parse(data);
  //     speakerDetails.language = language;
  //     localStorage.setItem("speakerDetails", JSON.stringify(speakerDetails));
  //   }
  //   location.href = './record.html';
  // });

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
    setDekhoImage(`${cdn_url}/${validationData.media}`);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1,dekhoIndia.sentences.length)
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
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE);

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

    if (!localSpeakerDataParsed) {
      location.href = '/profanity/dekhoindia';
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
      fetch(`/sentences-for-profanity-check/${type}?username=${localSpeakerDataParsed.userName}&language=${localSpeakerDataParsed.language}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
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
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
});

module.exports = {
  addListeners,
};
