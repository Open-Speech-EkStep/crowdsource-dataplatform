const fetch = require('./fetch')
const { showInstructions } = require('./validator-instructions')
const Visualizer = require('./visualizer')
const { showUserProfile } = require('../../../build/js/common/header');
const { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar } = require('../../../build/js/common/progressBar');
const { setPageContentHeight, toggleFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording ,setFooterPosition, getDeviceInfo, getBrowserInfo} = require('./utils');
const { cdn_url } = require('./env-api');
const visualizer = new Visualizer();
const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const currentIndexKey = 'boloValidationCurrentIndex';
const sentencesKey = 'boloValidatorSentencesKey';
const boloValidatorCountKey = 'boloValidatorCount';

window.boloIndiaValidator = {};

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


const showInstructionsPopup = () => {
    hideElement($("#validator-page-content"));
    toggleFooterPosition();
    showInstructions();
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context, src;

function startVisualizer() {
    const $canvas = document.getElementById('myCanvas');
    const audio = document.getElementById('my-audio');
    context = context || new AudioContext();
    src = src || context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    visualizer.visualize($canvas, analyser);
}

function enableButton(element) {
    element.children().removeAttr("opacity")
    element.removeAttr("disabled")
}

const setAudioPlayer = function () {
    const myAudio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');
    const resume = $('#resume');
    const textPlay = $('#audioplayer-text_play');
    const textReplay = $('#audioplayer-text_replay');
    const textPause = $('#audioplayer-text_pause');
    const textResume = $('#audioplayer-text_resume');


    myAudio.addEventListener("ended", () => {
        enableValidation();
        hideElement(pause)
        hideElement(resume)
        hideElement(play)
        showElement(replay)
        hideElement(textPause);
        hideElement(textPlay);
        hideElement(textResume);
        showElement(textReplay);
    });

    play.on('click', () => {
        hideElement($('#default_line'))
        playAudio();
        startVisualizer();
    });

    pause.on('click', pauseAudio);

    replay.on('click', () => {
        replayAudio();
        startVisualizer();
    });

    resume.on('click', () => {
        resumeAudio();
        // startVisualizer();
    });

    function playAudio() {
        myAudio.load();
        hideElement(play)
        hideElement(resume)
        hideElement(replay)
        showElement(pause)
        hideElement(textPlay);
        hideElement(textResume);
        hideElement(textReplay);
        showElement(textPause);
        myAudio.play();
    }

    function pauseAudio() {
        hideElement(pause)
        hideElement(replay)
        hideElement(play)
        showElement(resume)
        hideElement(textPause)
        hideElement(textPlay)
        hideElement(textReplay)
        showElement(textResume)
        // enableValidation();
        myAudio.pause();
    }


    function resumeAudio() {
        showElement(pause)
        hideElement(replay)
        hideElement(play)
        hideElement(resume)
        showElement(textPause)
        hideElement(textPlay)
        hideElement(textReplay)
        hideElement(textResume)
        // enableValidation();
        myAudio.play();
    }

    function replayAudio() {
        myAudio.load();
        hideElement(replay)
        hideElement(resume)
        hideElement(play)
        showElement(pause)
        hideElement(textReplay);
        hideElement(textResume);
        hideElement(textPlay);
        showElement(textPause);
        // disableValidation();
        myAudio.play();
    }

    function enableValidation() {
        const likeButton = $("#like_button");
        const dislikeButton = $("#dislike_button");
        enableButton(likeButton)
        enableButton(dislikeButton)
    }
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

function setSentenceLabel(index) {
    const $sentenceLabel = $('#sentenceLabel')
    $sentenceLabel[0].innerText = boloIndiaValidator.sentences[index].sentence;
    animateCSS($sentenceLabel, 'lightSpeedIn');
}

function getNextSentence() {
    if (currentIndex < boloIndiaValidator.sentences.length - 1) {
        currentIndex++;
        updateProgressBar(currentIndex + 1,boloIndiaValidator.sentences.length);
        const encodedUrl = encodeURIComponent(boloIndiaValidator.sentences[currentIndex].contribution);
        loadAudio(`${cdn_url}/${encodedUrl}`)
        resetValidation();
        setSentenceLabel(currentIndex);
        localStorage.setItem(currentIndexKey,currentIndex);
    } else {
        const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
        Object.assign(sentencesObj, { sentences: [] });
        localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
        localStorage.setItem(currentIndexKey, currentIndex);
        resetValidation();
        showThankYou();
    }
}

const updateDecisionButton = (button, colors) => {
    const children = button.children().children();
    children[0].setAttribute("fill", colors[0]);
    children[1].setAttribute("fill", colors[1]);
    children[2].setAttribute("fill", colors[2]);
}

// const updateValidationCount = () => {
//     const currentSentenceLbl = document.getElementById('currentSentenceLbl');
//     currentSentenceLbl.innerText = progressCount;
//     const totalSentencesLbl = document.getElementById('totalSentencesLbl');
//     totalSentencesLbl.innerText = validationSentences.length;
// }

// const updateProgressBar = () => {
//     const $progressBar = $("#progress_bar");
//     progressCount++;
//     const multiplier = 10 * (10 / boloIndiaValidator.sentences.length);
//     $progressBar.width(progressCount * multiplier + '%');
//     $progressBar.prop('aria-valuenow', progressCount);
//     updateValidationCount();
// }

function disableButton(button) {
    button.children().attr("opacity", "50%");
    button.attr("disabled", "disabled");
}

function disableValidation() {
    const dislikeButton = $("#dislike_button");
    const likeButton = $("#like_button");
    disableButton(likeButton)
    disableButton(dislikeButton)
}

function resetValidation() {
    disableValidation();
    const textPlay = $('#audioplayer-text_play');
    const textReplay = $('#audioplayer-text_replay');
    const textPause = $('#audioplayer-text_pause');
    const textResume = $('#audioplayer-text_resume');
    hideElement(textPause);
    hideElement(textReplay);
    hideElement(textResume);
    showElement(textPlay);

    hideElement($("#replay"))
    hideElement($('#pause'))
    hideElement($('#resume'))
    showElement($("#play"))
    showElement($('#default_line'))
}

function recordValidation(action) {
    if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
        validationCount++;
    }
    const sentenceId = boloIndiaValidator.sentences[currentIndex].dataset_row_id
    const contribution_id = boloIndiaValidator.sentences[currentIndex].contribution_id;
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
            browser: getBrowserInfo()
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

function addListeners() {
    $("#instructions-link").on('click', () => {
        showInstructionsPopup();
    });

    const $validatorInstructionsModal = $('#validator-instructions-modal');

    $validatorInstructionsModal.on('hidden.bs.modal', function () {
        showElement($("#validator-page-content"));
        toggleFooterPosition();
    });

    const likeButton = $("#like_button");
    const dislikeButton = $("#dislike_button");
    const $skipButton = $('#skip_button');

    dislikeButton.on('click', () => {
        if($('#pause').hasClass('d-none')){
            $('#pause').trigger('click');
        }
        recordValidation(REJECT_ACTION)
        getNextSentence();
    })

    likeButton.on('click', () => {
        if($('#pause').hasClass('d-none')){
            $('#pause').trigger('click');
        }
        recordValidation(ACCEPT_ACTION)
        getNextSentence();
    })

    $skipButton.on('click', () => {
        if($('#pause').hasClass('d-none')){
            $('#pause').trigger('click');
        }
        recordValidation(SKIP_ACTION)
        getNextSentence();
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

const loadAudio = function (audioLink) {
    $('#my-audio').attr('src', audioLink)
};

function disableSkipButton() {
    const $skipButton = $('#skip_button');
    $skipButton.removeAttr('style');
    disableButton($skipButton)
}

function showThankYou() {
    window.location.href = './validator-thank-you.html'
}

function showNoSentencesMessage() {
    $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
    hideElement($('#instructions-row'));
    hideElement($('#sentences-row'));
    hideElement($('#audio-row'))
    hideElement($('#validation-button-row'))
    hideElement($('#progress-row'))
    showElement($('#no-sentences-row'))
    hideElement($('#skip_btn_row'));
    hideElement($('#validation-container'));
    hideElement($('#report_btn'));
    hideElement($("#test-mic-speakers"));
    $("#validation-container").removeClass("validation-container");
    $('#start-validation-language').html(localStorage.getItem('contributionLanguage'));
}

const handleSubmitFeedback = function () {
    const contributionLanguage = localStorage.getItem("contributionLanguage");
    const otherText = $("#other_text").val();
    const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

    const reqObj = {
        sentenceId: boloIndiaValidator.sentences[currentIndex].contribution_id,
        reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
        language: contributionLanguage,
        userName: speakerDetails ? speakerDetails.userName : '',
        source: "validation"
    };
    reportSentenceOrRecording(reqObj).then(function (resp) {
        if (resp.statusCode === 200) {
            $('#skip_button').click();
            $("#report_recording_modal").modal('hide');
            $("#report_sentence_thanks_modal").modal('show');
            $("#report_submit_id").attr("disabled", true);
            $("input[type=radio][name=reportRadio]").each(function () {
                $(this).prop("checked", false);
            });
            $("#other_text").val("");
        }
    });
}

let selectedReportVal = '';
$(document).ready(() => {
    localStorage.setItem('module','bolo');
    toggleFooterPosition();
    setPageContentHeight();
    const $errorModal = $('#errorModal');
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

    const $reportModal = $("#report_recording_modal");

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

    fetchLocationInfo().then(res => {
        return res.json()
    }).then(response => {
        localStorage.setItem("state_region", response.regionName);
        localStorage.setItem("country", response.country);
    }).catch(console.log);

    $errorModal.on('show.bs.modal', function () {
        setFooterPosition();

    });
    $errorModal.on('hidden.bs.modal', function () {
        location.href = './boloIndia/home.html';
    });

    const localSpeakerData = localStorage.getItem(speakerDetailsKey);
    const localSpeakerDataParsed = JSON.parse(localSpeakerData);
    const localSentences = localStorage.getItem(sentencesKey);
    const localSentencesParsed = JSON.parse(localSentences);

  if (!localSpeakerDataParsed) {
    location.href = './home.html';
    return;
  }

  showUserProfile(localSpeakerDataParsed.userName)

  const isExistingUser = localSentencesParsed &&
    localSentencesParsed.userName === localSpeakerDataParsed.userName
    &&
    localSentencesParsed.language === localSpeakerDataParsed.language;
  if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === language) {
    setFooterPosition();
    boloIndiaValidator.sentences = localSentencesParsed.sentences;
    initializeComponent();
  } else {
    localStorage.removeItem(currentIndexKey);
    const type = 'text';
    const toLanguage = ""; //can be anything

    fetch(`/contributions/${type}?from=${language}&to=${toLanguage}`, {
      credentials: 'include',
      mode: 'cors'
    })
      .then((data) => {
        if (!data.ok) {
          throw Error(data.statusText || 'HTTP error');
        } else {
          return data.json();
        }
      }).then((sentenceData) => {
      if (sentenceData.data.length === 0) {
        showNoSentencesMessage();
        return;
      }
      // validationSentences = sentenceData.data
      // const sentence = validationSentences[currentIndex];
      boloIndiaValidator.sentences = sentenceData.data;
      localStorage.setItem(boloValidatorCountKey, boloIndiaValidator.sentences.length);
      localStorage.setItem(
        sentencesKey,
        JSON.stringify({
          userName: localSpeakerDataParsed.userName,
          sentences: sentenceData.data,
          language: localSpeakerDataParsed.language,
        })
      );
      initializeComponent();
    }).catch((err) => {
      console.log(err);
      $errorModal.modal('show');
    });
  }
});

const initializeComponent = function () {
  const totalItems = boloIndiaValidator.sentences.length;
  currentIndex = getCurrentIndex(totalItems - 1);
  const sentence = boloIndiaValidator.sentences[currentIndex];
  hideElement($('#loader-play-btn'));
  addListeners();
  if (sentence) {
      const encodedUrl = encodeURIComponent(sentence.contribution);
    loadAudio(`${cdn_url}/${encodedUrl}`);
    setSentenceLabel(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    updateProgressBar(currentIndex + 1, boloIndiaValidator.sentences.length)
    // updateValidationCount();
    resetValidation();
    setAudioPlayer();
    const $canvas = document.getElementById('myCanvas');
    visualizer.drawCanvasLine($canvas);
  }
}

module.exports = {
  setSentenceLabel,
  setAudioPlayer,
  addListeners,
  startVisualizer
};
