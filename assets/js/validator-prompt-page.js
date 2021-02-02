const {showInstructions} = require('./validator-instructions')

const decideToShowPopUp = () => {
    const currentValidator = localStorage.getItem('currentValidator');
    const validatorDetails = localStorage.getItem('validatorDetails');

    if(!validatorDetails){
        localStorage.setItem('validatorDetails',JSON.stringify({[currentValidator]: currentValidator}));
        showInstructions();
        return;
    }
    const parsedDetails = JSON.parse(validatorDetails);
    if (!(parsedDetails.hasOwnProperty(currentValidator))) {
        localStorage.setItem('validatorDetails', JSON.stringify(Object.assign(parsedDetails, {[currentValidator]: currentValidator})));
        showInstructions()
    }
}

const setAudioPlayer = function(){
    const myAudio = document.getElementById('my-audio');
    const play = $('#play');
    const pause = $('#pause');
    const replay = $('#replay');

    play.on('click',playAudio);
    pause.on('click',pauseAudio);
    replay.on('click',replayAudio);

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

$(document).ready(()=>{
    decideToShowPopUp();
    setAudioPlayer();
});

$("#instructions-link").on('click', ()=>showInstructions());

$('#validator-instructions-modal').on('hidden.bs.modal', function () {
    $("#validator-page-content").removeClass('d-none');
});

$('#validator-instructions-modal').on('show.bs.modal', function () {
    $("#validator-page-content").addClass('d-none');
});


module.exports = {decideToShowPopUp, setAudioPlayer};
