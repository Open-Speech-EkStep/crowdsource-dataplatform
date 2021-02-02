const {showInstructions} = require('./validator-instructions')

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

    play.on('click', playAudio);
    pause.on('click', pauseAudio);
    replay.on('click', replayAudio);

    function playAudio() {
        play.addClass('d-none');
        pause.removeClass('d-none');
        myAudio.play();
    }

    function pauseAudio() {
        pause.addClass('d-none');
        replay.removeClass('d-none');
        myAudio.pause();
    }

    function replayAudio() {
        replay.addClass('d-none');
        pause.removeClass('d-none');
        myAudio.play();
    }
}

const sampleSentences = ['Sentence 1', 'Sentence 2', 'Sentence 3']
let currentIndex = 0

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
        setSentenceLabel(currentIndex);
    }
}

$('#skip_button').on('click', getNextSentence)

$('#dislike_button').on('click', () => {
    getNextSentence();
})

$('#like_button').on('click', () => {
    getNextSentence();
})

$(document).ready(() => {
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

module.exports = {decideToShowPopUp, setSentenceLabel, setAudioPlayer};
