const {showInstructions} = require('./validator-instructions')
const {visualize} = require('./visualizer')

function convertPXToVH(px) {
    return px * (100 / document.documentElement.clientHeight);
}

function setPageContentHeight() {
    const $footer = $('footer');
    const $nav = $('.navbar');
    const edgeHeightInPixel = $footer.outerHeight() + $nav.outerHeight()
    const contentHeightInVH = 100 - convertPXToVH(edgeHeightInPixel)
    $('#content-wrapper').css('min-height', contentHeightInVH + 'vh');
}

const decideToShowPopUp = () => {
    const currentValidator = localStorage.getItem('currentValidator');
    const validatorDetails = localStorage.getItem('validatorDetails');

    if (!validatorDetails) {
        localStorage.setItem('validatorDetails', JSON.stringify({[currentValidator]: currentValidator}));
        showInstructions();
        return;
    }
    const parsedDetails = JSON.parse(validatorDetails);
    if (!(parsedDetails.hasOwnProperty(currentValidator))) {
        localStorage.setItem('validatorDetails', JSON.stringify(Object.assign(parsedDetails, {[currentValidator]: currentValidator})));
        showInstructions()
    }
}

const setAudioPlayer = function () {
    const myAudio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');

    myAudio.addEventListener("ended", () => {
        enableValidation();
        pause.addClass('d-none');
        replay.removeClass('d-none');
    });

    play.on('click', () => {
        playAudio();
        setUpVisualizer();
    });

    pause.on('click', pauseAudio);

    replay.on('click', () => {
        replayAudio();
        setUpVisualizer();
    });

    function playAudio() {
        myAudio.load();
        play.addClass('d-none');
        pause.removeClass('d-none');
        myAudio.play();
    }

    function pauseAudio() {
        pause.addClass('d-none');
        replay.removeClass('d-none');
        enableValidation();
        myAudio.pause();
    }

    function replayAudio() {
        myAudio.load();
        replay.addClass('d-none');
        pause.removeClass('d-none');
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

const sampleSentences = ['Sentence 1', 'Sentence 2', 'Sentence 3'];
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
        setTimeout(() => {
            resetDecisionRow();
            setSentenceLabel(currentIndex);
        }, 500);
    }
}

$('#skip_button').on('click', () => {
    getNextSentence();
})

const updateDecisionButton = (button, colors) => {
    const children = button.children().children();
    children[0].setAttribute("fill", colors[0]);
    children[1].setAttribute("fill", colors[1]);
    children[2].setAttribute("fill", colors[2]);
}

const updateProgressBar = (color) => {
    progressCount++;
    document.getElementById(`rect_${progressCount}`).setAttribute("fill", color);
}

$('#dislike_button').on('click', () => {
    const dislikeButton = $("#dislike_button");
    updateDecisionButton(dislikeButton, ["#007BFF", "white", "white"]);
    updateProgressBar("#ccebff");
    getNextSentence();
})

$('#like_button').on('click', () => {
    const likeButton = $("#like_button");
    updateDecisionButton(likeButton, ["#007BFF", "white", "white"]);
    updateProgressBar("#007BFF");
    getNextSentence();
})

const setValidatorNameInHeader = () => {
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    $navUser.removeClass('d-none');
    const currentValidator = localStorage.getItem('currentValidator');
    $navUserName.text(currentValidator);
};

$(document).ready(() => {
    setPageContentHeight()
    setValidatorNameInHeader();
    decideToShowPopUp();
    setAudioPlayer();
    setSentenceLabel(currentIndex)
});

$("#instructions-link").on('click', () => showInstructions());

$('#validator-instructions-modal').on('hidden.bs.modal', function () {
    $("#validator-page-content").removeClass('d-none');
});

$('#validator-instructions-modal').on('show.bs.modal', function () {
    $("#validator-page-content").addClass('d-none');
});

function resetDecisionRow() {
    const dislikeButton = $("#dislike_button");
    const likeButton = $("#like_button");

    updateDecisionButton(dislikeButton, ["white", "#007BFF", "#343A40"]);
    updateDecisionButton(likeButton, ["white", "#007BFF", "#343A40"]);

    likeButton.children().attr("opacity", "50%");
    likeButton.attr("disabled", "disabled");
    dislikeButton.children().attr("opacity", "50%");
    dislikeButton.attr("disabled", "disabled");

    $("#replay").addClass('d-none');
    $("#play").removeClass('d-none');
}

let context, src;

function setUpVisualizer() {
    const canvas = document.getElementById('myCanvas');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = document.querySelector('audio');

    context = context || new AudioContext();
    src = src || context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    visualize(canvas, analyser);
}

module.exports = {decideToShowPopUp, setSentenceLabel, setAudioPlayer, setValidatorNameInHeader};
