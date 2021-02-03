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

    const skipButton = $("#skip_button");
    const likeButton =  $("#like_button");
    const dislikeButton = $("#dislike_button");

    play.on('click', playAudio);
    pause.on('click', pauseAudio);
    replay.on('click', replayAudio);

    function playAudio() {
        play.addClass('d-none');
        pause.removeClass('d-none');
        skipButton.children().removeAttr("opacity")
        skipButton.removeAttr("disabled")
        likeButton.children().removeAttr("opacity")
        likeButton.removeAttr("disabled")
        dislikeButton.children().removeAttr("opacity")
        dislikeButton.removeAttr("disabled")
        myAudio.play();
    }

    function pauseAudio() {
        pause.addClass('d-none');
        replay.removeClass('d-none');
        myAudio.pause();
    }

    function replayAudio() {
        myAudio.load();
        replay.addClass('d-none');
        pause.removeClass('d-none');
        myAudio.play();
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
        resetDecisionRow();
        setSentenceLabel(currentIndex);
    }
}

$('#skip_button').on('click', ()=> {
    getNextSentence();
} )

const updateDecisionButton = (button, colors)=>{
    const children = button.children().children();
    children[0].setAttribute("fill",colors[0]);
    children[1].setAttribute("fill",colors[1]);
    children[2].setAttribute("fill",colors[2]);
}

const updateProgressBar = (color)=>{
    progressCount++;
    document.getElementById(`rect_${progressCount}`).setAttribute("fill", color);
}

$('#dislike_button').on('click', () => {
    const dislikeButton = $("#dislike_button");
    updateDecisionButton(dislikeButton, ["#007BFF","white","white"]);
    updateProgressBar("#ccebff");
    getNextSentence();
})

$('#like_button').on('click', () => {
    const likeButton =  $("#like_button");
    updateDecisionButton(likeButton, ["#007BFF","white","white"]);
    updateProgressBar("#007BFF");
    getNextSentence();
})

$(document).ready(() => {
    decideToShowPopUp();
    setAudioPlayer();
    setSentenceLabel(currentIndex)
    drawStraightLine();
});

$("#instructions-link").on('click', () => showInstructions());

$('#validator-instructions-modal').on('hidden.bs.modal', function () {
    $("#validator-page-content").removeClass('d-none');
});

$('#validator-instructions-modal').on('show.bs.modal', function () {
    $("#validator-page-content").addClass('d-none');
});

function resetDecisionRow(){
    const dislikeButton = $("#dislike_button");
    const likeButton =  $("#like_button");

    updateDecisionButton(dislikeButton, ["white","#007BFF","#343A40"]);
    updateDecisionButton(likeButton, ["white","#007BFF","#343A40"]);

    const skipButton = $("#skip_button");
    skipButton.children().attr("opacity","50%");
    skipButton.attr("disabled","disabled");
    likeButton.children().attr("opacity","50%");
    likeButton.attr("disabled","disabled");
    dislikeButton.children().attr("opacity","50%");
    dislikeButton.attr("disabled","disabled");

    $("#replay").addClass('d-none');
    $("#play").removeClass('d-none');

}


// function drawVisualizer() {
//     const canvas = document.getElementById("myCanvas");
//     const canvasCtx = canvas.getContext('2d');
//     const WIDTH = canvas.width;
//     const HEIGHT = canvas.height;
//     const audioCtx = new AudioContext();
//     const analyser = audioCtx.createAnalyser();
//
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);
//     canvasCtx.fillStyle = 'rgb(255, 255, 255, 0.8)';
//     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
//     canvasCtx.lineWidth = 2;
//     canvasCtx.strokeStyle = 'rgb(0,123,255)';
//     canvasCtx.beginPath();
//     const sliceWidth = (WIDTH * 1.0) / bufferLength;
//     let x_coordinate = 0;
//     for (let count = 0; count < bufferLength; count++) {
//         const verticalHeight = dataArray[count] / 128.0; // uint8
//         const y_coordinate = (verticalHeight * HEIGHT) / 2; // uint8
//         if (count === 0) {
//             canvasCtx.moveTo(x_coordinate, y_coordinate);
//         } else {
//             canvasCtx.lineTo(x_coordinate, y_coordinate);
//         }
//         x_coordinate += sliceWidth;
//     }
//     canvasCtx.lineTo(WIDTH, HEIGHT / 2);
//     canvasCtx.stroke();
// }

const drawStraightLine = () => {
    const canvas = document.getElementById("myCanvas");
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.moveTo(0, canvas.height/2);
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.strokeStyle = 'rgb(0,123,255)';
    canvasCtx.stroke();
}

module.exports = {decideToShowPopUp, setSentenceLabel, setAudioPlayer, drawStraightLine};
