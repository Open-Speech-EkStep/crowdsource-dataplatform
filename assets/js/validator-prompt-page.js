const {showInstructions} = require('./validator-instructions')
const Visualizer = require('./visualizer')
const {setPageContentHeight, toggleFooterPosition} = require('./utils')

const visualizer = new Visualizer();

const ACCEPT_ACTION = 'accept';
const REJECT_ACTION = 'reject';
const SKIP_ACTION = 'skip';

const PLAY_TEXT = 'Play';
const REPLAY_TEXT = 'Replay';
const PAUSE_TEXT = 'Pause';

function showElement(element) {
    element.removeClass('d-none');
}

function hideElement(element) {
    element.addClass('d-none');
}

const showInstructionsPopup = () => {
    hideElement($("#validator-page-content"));
    toggleFooterPosition();
    showInstructions();
}

let context, src;
const AudioContext = window.AudioContext || window.webkitAudioContext;

function startVisualizer() {
    const $canvas = document.getElementById('myCanvas');
    const audio = document.querySelector('audio');
    context = context || new AudioContext();
    src = src || context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    visualizer.visualize($canvas, analyser);
}

const setAudioPlayer = function () {
    const myAudio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');
    const textDiv = $('#audioplayer-text');

    myAudio.addEventListener("ended", () => {
        enableValidation();
        hideElement(pause)
        showElement(replay)
        textDiv.text(REPLAY_TEXT);
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
        textDiv.text(PAUSE_TEXT);
        myAudio.play();
    }

    function pauseAudio() {
        hideElement(pause)
        showElement(replay)
        textDiv.text(REPLAY_TEXT);
        enableValidation();
        myAudio.pause();
    }

    function replayAudio() {
        myAudio.load();
        hideElement(replay)
        showElement(pause)
        textDiv.text(PAUSE_TEXT);
        const dislikeButton = $("#dislike_button");
        const likeButton = $("#like_button");

        updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
        updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);

        disableButton(likeButton)
        disableButton(dislikeButton)
        myAudio.play();
    }

    function enableButton(element) {
        element.children().removeAttr("opacity")
        element.removeAttr("disabled")
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
        getAudioClip(validationSentences[currentIndex].audio_path)
        resetDecisionRow();
        setSentenceLabel(currentIndex);
    } else {
        resetDecisionRow();
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

function resetDecisionRow() {
    const dislikeButton = $("#dislike_button");
    const likeButton = $("#like_button");
    const textDiv = $('#audioplayer-text');

    updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
    updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);
    textDiv.text(PLAY_TEXT);

    disableButton(likeButton)
    disableButton(dislikeButton)

    hideElement($("#replay"))
    showElement($("#play"))
    showElement($('#default_line'))
}

function recordValidation(action) {
    if (action === REJECT_ACTION || action === ACCEPT_ACTION) {
        validationCount++;
    }
    const sentenceId = validationSentences[currentIndex].sentenceId
    const contribution_id = validationSentences[currentIndex].contribution_id
    fetch('/validation/action', {
        method: 'POST',
        body: JSON.stringify({
            sentenceId: sentenceId,
            action: action,
            contributionId: contribution_id
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
        recordValidation(SKIP_ACTION)
        updateProgressBar();
        getNextSentence();
    })

    $skipButton.hover(() => {
        $skipButton.css('border-color', '#bfddf5');
    }, () => {
        $skipButton.removeAttr('style');
    },)

    $skipButton.mousedown(() => {
        $skipButton.css('background-color', '#bfddf5')
    })
}

let validationSentences = [{sentence: ''}]

const loadAudio = function (audioLink) {
    $('#my-audio').attr('src', audioLink)
};

const getAudioClip = function (audioPath) {
    hideAudioRow();
    fetch('/audioClip', {
        method: 'POST',
        body: JSON.stringify({
            file: audioPath
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((stream) => {
        stream.arrayBuffer().then((buffer) => {
            const blob = new Blob([buffer], {type: "audio/wav"});
            // loadAudio(URL.createObjectURL(blob))
            const fileReader = new FileReader();
            fileReader.onload = function (e) {
                loadAudio(e.target.result);
                showAudioRow();
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
}

function showAudioRow() {
    hideElement($('#loader-audio-row'))
    showElement($('#audio-row'));
}

function showThankYou() {
    hideElement($('#instructions-row'));
    hideElement($('#sentences-row'));
    hideElement($('#audio-row'))
    hideElement($('#validation-button-row'))
    showElement($('#thank-you-row'))

    const language = localStorage.getItem('contributionLanguage');
    const stringifyData = localStorage.getItem('aggregateDataCountByLanguage');
    const aggregateDetails = JSON.parse(stringifyData);
    const totalInfo = aggregateDetails.find((element) => element.language === language);
    let totalSentences = 0;
    let totalValidations = 0;
    if (totalInfo) {
        totalSentences = Math.floor(Number(totalInfo.total_contributions) * 3600 / 6);
        totalValidations = Math.floor(Number(totalInfo.total_validations) * 3600 / 6);
        $('#spn-total-hr-contributed').html(totalInfo.total_contributions);
        $('#spn-total-hr-validated').html(totalInfo.total_validations);
    } else {
        $('#spn-total-hr-contributed').html(0);
        $('#spn-total-hr-validated').html(0);
    }
    $('#spn-validation-language-2').html(language);
    $('#spn-validation-count').html(validationCount);
    $('#spn-total-contribution-count').html(totalSentences);
}

function showNoSentencesMessage() {
    $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
    hideElement($('#instructions-row'));
    hideElement($('#sentences-row'));
    hideElement($('#audio-row'))
    hideElement($('#validation-button-row'))
    hideElement($('#progress-row'))
    showElement($('#no-sentences-row'))
}

$(document).ready(() => {
    toggleFooterPosition();
    setPageContentHeight();

    const language = localStorage.getItem('contributionLanguage');
    fetch(`/validation/sentences/${language}`)
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
            getAudioClip(sentence.audio_path);
            setSentenceLabel(currentIndex);
            updateValidationCount();
            resetDecisionRow();
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
    addListeners
};
