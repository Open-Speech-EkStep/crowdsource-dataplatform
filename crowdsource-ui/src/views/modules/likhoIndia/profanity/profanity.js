const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  toggleFooterPosition,
  setFooterPosition,
  getLocaleString,
  showElement,
  hideElement,
  fetchLocationInfo
} = require('../common/utils');
const {LOCALE_STRINGS,CURRENT_MODULE, MODULE} = require('../common/constants');
const {showUserProfile} = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../common/progressBar');
const speakerDetailsKey = 'profanityUserDetails';

const currentIndexKey = 'likhoCurrentIndex';
const sentencesKey = 'likhoSentencesKey';
const likhoCountKey = 'likhoCount';
let localeStrings;

window.likhoIndia = {};

let currentIndex;

function getNextSentence() {
  if (currentIndex < likhoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1,likhoIndia.sentences.length);
    setSentence(likhoIndia.sentences[currentIndex].media);
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
  return fetch(`/profanity-status/parallel`, {
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
    updateProfanityState(localSpeakerDataParsed.userName, likhoIndia.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
      .then(res=>{
        onProfanityUpdated();
      }).catch(err=>{
        console.log(err);
      })
}

function updateSkipAction(){
  const sentenceId = likhoIndia.sentences[currentIndex].dataset_row_id;
  fetch(`/profanity-skip/parallel`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sentenceId: sentenceId
    })
  }).then(res=>{}).catch(err=>{
    console.log(err)
  });
}

function addListeners() {

  const $skipButton = $('#skip_button');

  $('#cancel-edit-button').on('click', () => {
    invokeProfanityStateUpdate(false)
  })

  $('#submit-edit-button').on('click', () => {
    invokeProfanityStateUpdate(true)
  })


  $skipButton.on('click', () => {
    if($('#pause').hasClass('d-none')){
      $('#pause').trigger('click');
    }
    // markContributionSkipped();
    getNextSentence();
    updateSkipAction();
    showElement($('#sentences-row'));
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


function showThankYou() {
  $("#profanityThankYouModal").modal('show');
}

function showNoSentencesMessage() {
  $('#spn-validation-language').html(localStorage.getItem("contributionLanguage"));
  hideElement($('#sentences-row'));
  hideElement($('#audio-row'))
  hideElement($('#validation-button-row'))
  hideElement($('#progress-row'))
  showElement($('#no-sentences-row'))
  hideElement($('#skip_btn_row'));
  // hideElement($('#report_btn'));
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
  hideElement($('#thankyou-text'));
}

// const handleSubmitFeedback = function () {
//   const contributionLanguage = localStorage.getItem("contributionLanguage");
//   const otherText = $("#other_text").val();
//   const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
//
//   const reqObj = {
//     sentenceId: likhoIndia.sentences[currentIndex].dataset_row_id,
//     reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
//     language: contributionLanguage,
//     userName: speakerDetails ? speakerDetails.userName : '',
//     source: "contribution"
//   };
//   reportSentenceOrRecording(reqObj).then(function (resp) {
//     if (resp.statusCode === 200) {
//       $('#skip_button').click();
//       $("#report_sentence_modal").modal('hide');
//       $("#report_sentence_thanks_modal").modal('show');
//       $("#report_submit_id").attr("disabled", true);
//       $("input[type=radio][name=reportRadio]").each(function () {
//         $(this).prop("checked", false);
//       });
//       $("#other_text").val("");
//     }
//   });
// }

const setSentence = function (text){
  $('#captured-text').text(text);
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
  const language = localStorage.getItem('contributionLanguage');

  // $("#start_contributing_id").on('click', function () {
  //   const data = localStorage.getItem("speakerDetails");
  //   if (data !== null) {
  //     const speakerDetails = JSON.parse(data);
  //     speakerDetails.language = language;
  //     localStorage.setItem("speakerDetails", JSON.stringify(speakerDetails));
  //   }
  //   location.href = './home.html';
  // });

  // const $reportModal = $("#report_sentence_modal");

  // $("#report_submit_id").on('click', handleSubmitFeedback);
  //
  // $("#report_btn").on('click', function () {
  //   $reportModal.modal('show');
  // });
  //
  // $("#report_close_btn").on("click", function () {
  //   $reportModal.modal('hide');
  // });
  //
  // $("#report_sentence_thanks_close_id").on("click", function () {
  //   $("#report_sentence_thanks_modal").modal('hide');
  // });
  //
  // $("input[type=radio][name=reportRadio]").on("change", function () {
  //   selectedReportVal = this.value;
  //   $("#report_submit_id").attr("disabled", false);
  // });

  const translation = likhoIndia.sentences[currentIndex];
  addListeners();
  console.log(translation);
  if (translation) {
    setSentence(translation.media);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1,likhoIndia.sentences.length)
  }
};

function executeOnLoad() {
  toggleFooterPosition();
  setPageContentHeight();
  setFooterPosition();
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const fromLanguage = localStorage.getItem('contributionLanguage');
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  $('#from-label').text(fromLanguage);

  fetchLocationInfo().then(res => {
    return res.json()
  }).then(response => {
    localStorage.setItem("state_region", response.regionName);
    localStorage.setItem("country", response.country);
  }).catch(console.log);
  try {
    const localSpeakerData = localStorage.getItem(speakerDetailsKey);
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);
    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

    setPageContentHeight();
    $("#instructions_close_btn").on("click", function () {
      setFooterPosition();
    })

    if (!localSpeakerDataParsed) {
      location.href = '/profanity/likhoindia';
      return;
    }

    showUserProfile(localSpeakerDataParsed.userName);
    const isExistingUser = localSentencesParsed &&
      localSentencesParsed.userName === localSpeakerDataParsed.userName
      &&
      localSentencesParsed.language === localSpeakerDataParsed.language;

    if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === fromLanguage) {
      $loader.hide();
      $pageContent.removeClass('d-none');
      setFooterPosition();
      likhoIndia.sentences = localSentencesParsed.sentences;
      initialize();
    } else {
      localStorage.removeItem(currentIndexKey);
      const type = 'parallel';
      fetch(`/sentences-for-profanity-check/${type}?username=${localSpeakerDataParsed.userName}&language=${fromLanguage}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
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
        })
        .then((sentenceData) => {
          if (sentenceData.data.length === 0) {
            showNoSentencesMessage();
            return;
          }

          if (!isExistingUser) {
            setFooterPosition();
          }
          $pageContent.removeClass('d-none');
          setFooterPosition();

          likhoIndia.sentences = sentenceData.data;
          localStorage.setItem(likhoCountKey,likhoIndia.sentences.length);
          $loader.hide();
          localStorage.setItem(
            sentencesKey,
            JSON.stringify({
              userName: localSpeakerDataParsed.userName,
              sentences: sentenceData.data,
              language: fromLanguage,
            })
          );
          setFooterPosition();
          initialize();
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          $loader.hide();
        });
    }
  } catch (err) {
    console.log(err);
  }
}

$(document).ready(() => {
  $('#from-label').text(localStorage.getItem('contributionLanguage'));
  localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
});


module.exports = {
  addListeners,
};


