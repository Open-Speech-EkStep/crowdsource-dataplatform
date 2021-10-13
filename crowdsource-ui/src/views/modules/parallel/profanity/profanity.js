const fetch = require('../common/fetch')
const {
  setPageContentHeight,
  // toggleFooterPosition,
  setFooterPosition,
  getLocaleString,
  showElement,
  hideElement,
  onHover,
  afterHover
} = require('../common/utils');
const { LOCALE_STRINGS, CURRENT_MODULE ,INITIATIVES,config} = require('../common/constants');
const { showUserProfile } = require('../common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex, updateProgressBar } = require('../common/progressBar');
const speakerDetailsKey = 'profanityUserDetails';

const currentIndexKey = `${config.initiativeKey_3}CurrentIndex`;
const sentencesKey = `${config.initiativeKey_3}SentencesKey`;
const parallelCountKey = `${config.initiativeKey_3}Count`;
// eslint-disable-next-line no-unused-vars
let localeStrings;

window.likhoIndia = {};

let currentIndex;

function getNextSentence() {
  if (currentIndex < likhoIndia.sentences.length - 1) {
    currentIndex++;
    updateProgressBar(currentIndex + 1, likhoIndia.sentences.length);
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

function updateProfanityState(userName, sentenceId, language, state) {
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

function onProfanityUpdated() {
  // hideElement($('#cancel-edit-button'));
  // hideElement($('#submit-edit-button'))
  // hideElement($('#skip_button'))
  // showElement($('#thankyou-text'));
  // showElement($('#progress-row'))
  // try{
  //   setTimeout(() => {
  //     hideElement($('#thankyou-text'));
  //     showElement($('#cancel-edit-button'));
  //     showElement($('#submit-edit-button'))
  //     showElement($('#skip_button'))
  getNextSentence();
  //   }, 2000)
  // } catch (e){
  //   console.log(e)
  // }
}

function invokeProfanityStateUpdate(state) {
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
  updateProfanityState(localSpeakerDataParsed.userName, likhoIndia.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
    .then(() => {
      onProfanityUpdated();
    }).catch(err => {
      console.log(err);
    })
}

function updateSkipAction() {
  const sentenceId = likhoIndia.sentences[currentIndex].dataset_row_id;
  const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
  fetch(`/profanity-skip/parallel`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sentenceId: sentenceId,
      userName: localSpeakerDataParsed.userName
    })
  }).then(() => { }).catch(err => {
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

  $('#cancel-edit-button').hover(
    () => {
      onHover($('#cancel-edit-button'));
    },
    () => {
      afterHover($('#cancel-edit-button'))
    });

  $('#submit-edit-button').hover(
    () => {
      onHover($('#submit-edit-button'));
    },
    () => {
      afterHover($('#submit-edit-button'))
    });


  $skipButton.on('click', () => {
    if ($('#pause').hasClass('d-none')) {
      $('#pause').trigger('click');
    }
    // markContributionSkipped();
    updateSkipAction();
    getNextSentence();
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
  hideElement($("#test-mic-speakers"));
  hideElement($('#instructive-msg'));
  hideElement($('#editor-row'));
}

const setSentence = function (text) {
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

const initialize = function () {
  const totalItems = likhoIndia.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);

  const translation = likhoIndia.sentences[currentIndex];
  addListeners();
  console.log(translation);
  if (translation) {
    setSentence(translation.media);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1, likhoIndia.sentences.length)
  }
};

function executeOnLoad() {
  setPageContentHeight();
  setFooterPosition();
  const $loader = $('#loader');
  const $pageContent = $('#page-content');
  const fromLanguage = localStorage.getItem('contributionLanguage');
  localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  $('#from-label').text(fromLanguage);
  
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
      location.href = '/en/profanity.html?type=parallel';
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
          localStorage.setItem(parallelCountKey, likhoIndia.sentences.length);
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
  localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
  getLocaleString().then(() => {
    executeOnLoad();
  }).catch(() => {
    executeOnLoad();
  });
});


module.exports = {
  addListeners,
};


