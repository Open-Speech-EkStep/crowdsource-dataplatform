const {showInstructions} = require('./validator-instructions');
const {setPageContentHeight } = require('./pageHeight');


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
    const audio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);

    audio.onplay = ()=>{
        context.resume();
    }

    audio.addEventListener("ended",()=>{
        enableButtons();
        pause.addClass('d-none');
        replay.removeClass('d-none');
    });

    play.on('click', () => {
        play.addClass('d-none');
        pause.removeClass('d-none');
        audio.load();
        audio.play();
        renderFrame(analyser);
    });

    pause.on('click', pauseAudio);

    replay.on('click', () => {
        replay.addClass('d-none');
        pause.removeClass('d-none');
        audio.load();
        audio.play();
        renderFrame(analyser);
    });

    function enableButtons(){
        const skipButton = $("#skip_button");
        const likeButton =  $("#like_button");
        const dislikeButton = $("#dislike_button");
        skipButton.children().removeAttr("opacity")
        skipButton.removeAttr("disabled")
        likeButton.children().removeAttr("opacity")
        likeButton.removeAttr("disabled")
        dislikeButton.children().removeAttr("opacity")
        dislikeButton.removeAttr("disabled")
    }

    function pauseAudio() {
        pause.addClass('d-none');
        replay.removeClass('d-none');
        enableButtons();
        audio.pause();
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

const setValidatorNameInHeader = ()=>{
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    $navUser.removeClass('d-none');
    const currentValidator = localStorage.getItem('currentValidator');
    $navUserName.text(currentValidator);
};


function addListeners(){
    $("#instructions-link").on('click', () => showInstructions());

    const $validatorInstructionsModal = $('#validator-instructions-modal');

    $validatorInstructionsModal.on('hidden.bs.modal', function () {
        $("#validator-page-content").removeClass('d-none');
    });

    $validatorInstructionsModal.on('show.bs.modal', function () {
        $("#validator-page-content").addClass('d-none');
    });

    $('#like_button').hover(function(){
            const likeButton =  $("#like_button");
            updateDecisionButton(likeButton, ["#007BFF","white","white"]);
        },
        function(){
            const likeButton =  $("#like_button");
            updateDecisionButton(likeButton, ["white","#007BFF","#343A40"]);
        }

    );

    $('#dislike_button').hover(function(){
            const dislikeButton = $("#dislike_button");
            updateDecisionButton(dislikeButton, ["#007BFF","white","white"]);
        },
        function(){
            const dislikeButton = $("#dislike_button");
            updateDecisionButton(dislikeButton, ["white","#007BFF","#343A40"]);
        }

    );

    $('#dislike_button').on('click', () => {
        updateProgressBar("#ccebff");
        getNextSentence();
    })

    $('#like_button').on('click', () => {
        updateProgressBar("#007BFF");
        getNextSentence();
    })

    $('#skip_button').on('click', ()=> {
        getNextSentence();
    } )

}

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

function renderFrame(analyser) {
    requestAnimationFrame(()=>renderFrame(analyser));
    const canvas = document.getElementById('myCanvas');

    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = 'rgb(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0,123,255)';
    ctx.beginPath();
    const sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x_coordinate = 0;
    for (let count = 0; count < bufferLength; count++) {
        const verticalHeight = dataArray[count] / 128.0; // uint8
        const y_coordinate = (verticalHeight * HEIGHT) / 2; // uint8
        if (count === 0) {
            ctx.moveTo(x_coordinate, y_coordinate);
        } else {
            ctx.lineTo(x_coordinate, y_coordinate);
        }
        x_coordinate += sliceWidth;
    }
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();
}

$(document).ready(() => {
    addListeners();
    decideToShowPopUp();
    setValidatorNameInHeader();
    setPageContentHeight()
    setAudioPlayer();
    setSentenceLabel(currentIndex)
});

module.exports = {addListeners, decideToShowPopUp, setSentenceLabel, setAudioPlayer, setValidatorNameInHeader};
