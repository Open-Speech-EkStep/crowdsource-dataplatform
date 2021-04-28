const fetch = require('./fetch')
const { showInstructions } = require('./validator-instructions')
const Visualizer = require('./visualizer')
const { setPageContentHeight, toggleFooterPosition, updateLocaleLanguagesDropdown, showElement, hideElement, fetchLocationInfo, reportSentenceOrRecording } = require('./utils');

const visualizer = new Visualizer();
const speakerDetailsKey = 'speakerDetails';
const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

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
    const textPlay = $('#audioplayer-text_play');
    const textReplay = $('#audioplayer-text_replay');
    const textPause = $('#audioplayer-text_pause');


    myAudio.addEventListener("ended", () => {
        enableValidation();
        hideElement(pause)
        showElement(replay)
        hideElement(textPause);
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

    function playAudio() {
        myAudio.load();
        hideElement(play)
        showElement(pause)
        hideElement(textPlay);
        showElement(textPause);
        myAudio.play();
    }

    function pauseAudio() {
        hideElement(pause)
        showElement(replay)
        hideElement(textPause)
        showElement(textReplay)
        enableValidation();
        myAudio.pause();
    }

    function replayAudio() {
        myAudio.load();
        hideElement(replay)
        showElement(pause)
        hideElement(textReplay);
        showElement(textPause);
        disableValidation();
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
    $sentenceLabel[0].innerText = validationSentences[index].sentence;
    animateCSS($sentenceLabel, 'lightSpeedIn');
}

function getNextSentence() {
    if (currentIndex < validationSentences.length - 1) {
        currentIndex++;
        getAudioClip(validationSentences[currentIndex].contribution_id)
        resetValidation();
        setSentenceLabel(currentIndex);
    } else {
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

const updateValidationCount = () => {
    const currentSentenceLbl = document.getElementById('currentSentenceLbl');
    currentSentenceLbl.innerText = progressCount;
    const totalSentencesLbl = document.getElementById('totalSentencesLbl');
    totalSentencesLbl.innerText = validationSentences.length;
}

const updateProgressBar = () => {
    const $getStarted = $('#get-started');
    let progressMessages = [
        'Let’s get started',
        'We know you can do more! ',
        'You are halfway there. Keep going!',
        'Just few more steps to go!',
        'Four dead, one more to go!',
        'Yay! Done & Dusted!',
    ];
    if (validationSentences.length == 4) {
        progressMessages = [
            'Let’s get started',
            'We know you can do more! ',
            'You are halfway there. Keep going!',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    } else if (validationSentences.length == 3) {
        progressMessages = [
            'Let’s get started',
            'We know you can do more! ',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    } else if (validationSentences.length == 2) {
        progressMessages = [
            'Let’s get started',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    } else if (validationSentences.length == 1) {
        progressMessages = [
            'Let’s get started',
            'Yay! Done & Dusted!'
        ];
    }
    const $progressBar = $("#progress_bar");
    progressCount++;
    $getStarted.text(progressMessages[progressCount]).show();

    const multiplier = 10 * (10 / validationSentences.length);
    $progressBar.width(progressCount * multiplier + '%');
    $progressBar.prop('aria-valuenow', progressCount);
    updateValidationCount();
}

function disableButton(button) {
    button.children().attr("opacity", "50%");
    button.attr("disabled", "disabled");
}

function disableValidation() {
    const dislikeButton = $("#dislike_button");
    const likeButton = $("#like_button");
    updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
    updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);
    disableButton(likeButton)
    disableButton(dislikeButton)
}

function resetValidation() {
    disableValidation();
    const textPlay = $('#audioplayer-text_play');
    const textReplay = $('#audioplayer-text_replay');
    const textPause = $('#audioplayer-text_pause');
    hideElement(textPause);
    hideElement(textReplay);
    showElement(textPlay);

    hideElement($("#replay"))
    hideElement($('#pause'))
    showElement($("#play"))
    showElement($('#default_line'))
}

function recordValidation(action) {
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

    likeButton.hover(() => {
        updateDecisionButton(likeButton, ["#bfddf5", "#007BFF", "#007BFF"]);
    },
        () => {
            updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);
        });

    dislikeButton.hover(() => {
        updateDecisionButton(dislikeButton, ["#bfddf5", "#007BFF", "#007BFF"]);
    },
        () => {
            updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
        });

    dislikeButton.mousedown(() => {
        updateDecisionButton(dislikeButton, ["#007BFF", "white", "white"]);
    });

    likeButton.mousedown(() => {
        updateDecisionButton(likeButton, ["#007BFF", "white", "white"]);
    });

    dislikeButton.on('click', () => {
        recordValidation(REJECT_ACTION)
        updateProgressBar();
        getNextSentence();
    })

    likeButton.on('click', () => {
        recordValidation(ACCEPT_ACTION)
        updateProgressBar();
        getNextSentence();
    })

    $skipButton.on('click', () => {
        $('#pause').trigger('click');
        recordValidation(SKIP_ACTION)
        updateProgressBar();
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

const getAudioClip = function (contributionId) {
    hideAudioRow();
    disableSkipButton();
    const source = 'validate';
    fetch(`/contributed-media/${source}/${contributionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((stream) => {
        stream.arrayBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "audio/wav" });
            // loadAudio(URL.createObjectURL(blob))
            const fileReader = new FileReader();
            fileReader.onload = function (e) {
                loadAudio(e.target.result);
                showAudioRow();
                enableButton($('#skip_button'))
            }
            fileReader.readAsDataURL(blob);
        });
    }).catch((err) => {
        console.log(err)
        showAudioRow();
    });
}

function hideAudioRow() {
    showElement($('#loader-audio-row'));
    hideElement($('#audio-row'))
    showElement($('#loader-play-btn'));
    hideElement($('#audio-player-btn'))
}

function showAudioRow() {
    hideElement($('#loader-audio-row'));
    showElement($('#audio-row'));
    hideElement($('#loader-play-btn'));
    showElement($('#audio-player-btn'))
}

function showThankYou() {
    hideElement($('#instructions-row'));
    hideElement($('#sentences-row'));
    hideElement($('#audio-row'))
    hideElement($('#validation-button-row'))
    showElement($('#thank-you-row'))
    hideElement($('#progress-row'));
    hideElement($('#skip_btn_row'));
    hideElement($('#validation-container'));
    $("#validation-container").removeClass("validation-container");
    hideElement($('#report_btn'));
    hideElement($("#test-mic-speakers"));

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
        sentenceId: validationSentences[currentIndex].contribution_id,
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
    toggleFooterPosition();
    setPageContentHeight();
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
            validationSentences = sentenceData.data
            const sentence = validationSentences[currentIndex];
            if (sentence) {
                getAudioClip(sentence.contribution_id);
                setSentenceLabel(currentIndex);
                updateValidationCount();
                resetValidation();
                addListeners();
                setAudioPlayer();
                const $canvas = document.getElementById('myCanvas');
                visualizer.drawCanvasLine($canvas);
            }
        }).catch((err) => {
            console.log(err)
        });
});

module.exports = {
    setSentenceLabel,
    setAudioPlayer,
    addListeners,
    startVisualizer
};
