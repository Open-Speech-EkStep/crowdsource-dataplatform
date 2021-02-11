const {showInstructions} = require('./validator-instructions')
const {visualize} = require('./visualizer')
const {setPageContentHeight, toggleFooterPosition} = require('./utils')

const showInstructionsPopup = () => {
    $("#validator-page-content").addClass('d-none');
    toggleFooterPosition();
    showInstructions();
}

const decideToShowPopUp = () => {
    const currentValidator = document.getElementById('nav-username').innerText
    const validatorDetails = localStorage.getItem('validatorDetails');
    if (!validatorDetails) {
        localStorage.setItem('validatorDetails',JSON.stringify([currentValidator]));
        showInstructionsPopup();
        return;
    }

    const parsedDetails = JSON.parse(validatorDetails);
    if (!(parsedDetails.includes(currentValidator))) {
        parsedDetails.push(currentValidator);
        localStorage.setItem('validatorDetails', JSON.stringify(parsedDetails));
        showInstructionsPopup();
    }
}

const setAudioPlayer = function () {
    const myAudio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');
    const textDiv = $('#audioplayer-text');

    myAudio.addEventListener("ended", () => {
        enableValidation();
        pause.addClass('d-none');
        replay.removeClass('d-none');
        textDiv.text('Replay');
    });

    play.on('click', () => {
        $('#default_line').addClass('d-none')
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
        play.addClass('d-none');
        pause.removeClass('d-none');
        textDiv.text('Pause');
        myAudio.play();
    }

    function pauseAudio() {
        pause.addClass('d-none');
        replay.removeClass('d-none');
        textDiv.text('Replay');
        enableValidation();
        myAudio.pause();
    }

    function replayAudio() {
        myAudio.load();
        replay.addClass('d-none');
        pause.removeClass('d-none');
        textDiv.text('Pause');
        myAudio.play();
    }

    function enableButton(element) {
        element.children().removeAttr("opacity")
        element.removeAttr("disabled")
    }

    function enableValidation() {
        const likeButton = $("#like_button");
        const dislikeButton = $("#dislike_button");
        const skipButton = $("#skip_button");
        enableButton(likeButton)
        enableButton(dislikeButton)
        enableButton(skipButton)
    }
}

const sampleSentences = ['लटक कर पैरों को मुक्त करने की एक नई कसरत बालकों के हाथ लग गई', 'जल्द ही पोलैंड में कोर्चार्क के रेडियो प्रोग्राम बहुत', 'उसने कहा क्योंकि उसमें दिल नहीं होगा जो सारे शरीर में खून भेजता'];
let currentIndex = 0;
let progressCount = 0;

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
    $sentenceLabel[0].innerText = sampleSentences[index];
    animateCSS($sentenceLabel, 'lightSpeedIn');
}

function getNextSentence() {
    if (currentIndex < sampleSentences.length - 1) {
        currentIndex++;
        resetDecisionRow();
        setSentenceLabel(currentIndex);
    }
}

const updateDecisionButton = (button, colors) => {
    const children = button.children().children();
    children[0].setAttribute("fill", colors[0]);
    children[1].setAttribute("fill", colors[1]);
    children[2].setAttribute("fill", colors[2]);
}

const updateProgressBar = () => {
    progressCount++;
    document.getElementById(`rect_${progressCount}`).setAttribute("fill", "#007BFF");
}

function disableButton(button) {
    button.children().attr("opacity", "50%");
    button.attr("disabled", "disabled");
}

function resetDecisionRow() {
    const dislikeButton = $("#dislike_button");
    const likeButton = $("#like_button");
    const skipButton = $("#skip_button");
    const textDiv = $('#audioplayer-text');

    updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
    updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);
    skipButton.removeAttr('style');
    textDiv.text('Play');

    disableButton(likeButton)
    disableButton(dislikeButton)
    disableButton(skipButton)

    $("#replay").addClass('d-none');
    $("#play").removeClass('d-none');
    $('#default_line').removeClass('d-none')
}

let context, src;
const AudioContext = window.AudioContext || window.webkitAudioContext;

function drawCanvasLine() {
    const $canvas = document.getElementById('myCanvas');
    const canvasCtx = $canvas.getContext('2d');
    const WIDTH = $canvas.width;
    const HEIGHT = $canvas.height;

    canvasCtx.fillStyle = 'rgb(255, 255, 255, 0.8)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0,123,255)';
    canvasCtx.moveTo(0, HEIGHT / 2);
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
}

function startVisualizer() {
    const $canvas = document.getElementById('myCanvas');
    const audio = document.querySelector('audio');
    context = context || new AudioContext();
    src = src || context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    visualize($canvas, analyser);
}

function addListeners() {
    $("#instructions-link").on('click', () => {
        showInstructionsPopup();
    });

    const $validatorInstructionsModal = $('#validator-instructions-modal');

    $validatorInstructionsModal.on('hidden.bs.modal', function () {
        $("#validator-page-content").removeClass('d-none');
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
        updateProgressBar();
        getNextSentence();
    })

    likeButton.on('click', () => {
        updateProgressBar();
        getNextSentence();
    })

    $skipButton.on('click', () => {
        updateProgressBar();
        getNextSentence();
    })

    $skipButton.hover(() => {
        $skipButton.css('border-color', '#bfddf5');
    }, () => {
        $skipButton.removeAttr('style');
    },)

    $skipButton.mousedown(()=>{
        $skipButton.css('background-color', '#bfddf5')
    })
}

$(document).ready(() => {
    toggleFooterPosition();
    setPageContentHeight();
    drawCanvasLine();
    resetDecisionRow();
    addListeners();
    decideToShowPopUp();
    setAudioPlayer();
    setSentenceLabel(currentIndex)
});

module.exports = {
    decideToShowPopUp,
    setSentenceLabel,
    setAudioPlayer,
    addListeners
};
