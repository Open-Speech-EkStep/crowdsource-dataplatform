const sentences = crowdSource.sentences;
const currentSentenceLbl = document.getElementById("currentSentenceLbl");
const totalSentencesLbl = document.getElementById("totalSentencesLbl");
const sentenceLbl = document.getElementById("sentenceLbl");
const $startRecordBtn = $("#startRecord");
const $stopRecordBtn = $("#stopRecord");
const $visualizer = $("#visualizer");
const $player = $("#player");
const $nextBtn = $("#nextBtn");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const state= document.getElementById("state");
const email= document.getElementById("email");
const speakerName= document.getElementById("speakerName");
const completedBatch= document.getElementById("completedBatch");
const speakerDetailsKey = "speakerDetails";
const completedBatchKey = "completedBatch";
const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
const completedBatchValue = localStorage.getItem(completedBatchKey);
const $recordingSign = $("#recording-sign");
const $progressBar = $(".progress-bar");

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)
    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
}

const setSentenceText = (index) => {
    sentenceLbl.innerText = sentences[index].sentence
    animateCSS('#sentenceLbl', 'lightSpeedIn');
    if(currentIndex){
        $progressBar.width(currentIndex*10+"%");
        $progressBar.text(currentIndex);
        $progressBar.prop("aria-valuenow",currentIndex)
    }
};
const setCurrentSentenceIndex = (index) => currentSentenceLbl.innerText = index;
const setTotalSentenceIndex = (index) => totalSentencesLbl.innerText = index;

let currentIndex = 0;
const totalItems = sentences.length;
setSentenceText(currentIndex);
setCurrentSentenceIndex(currentIndex + 1);
setTotalSentenceIndex(totalItems);

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        {
            type: 'success',
            className: "fnt-1-5"
        },
        {
            type: 'error',
            className: "fnt-1-5"
        }
    ]
});
let gumStream;
//stream from getUserMedia() 
let rec;
//Recorder.js object 
let input;
//MediaStreamAudioSourceNode we'll be recording 

$startRecordBtn.on('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            $startRecordBtn.prop('disabled',true);
            $stopRecordBtn.prop('disabled' , false);
            $recordingSign.removeClass('d-none');
            $player.addClass('d-none');
            $visualizer.removeClass("d-none");

            gumStream = stream;
            // shim for AudioContext when it's not avb. 
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext;
            window.audioAnalyser = audioContext.createAnalyser();
            //new audio context to help us record 
            input = audioContext.createMediaStreamSource(stream);
            input.connect(audioAnalyser);
            visualize(visualizer, audioAnalyser)
            /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
            rec = new Recorder(input, {
                numChannels: 2
            })
            //start the recording process 
            rec.record();
        })
        .catch(err => {
            console.log(err)
            notyf.error("Sorry !!! We could not get access to your audio input device");
            $startRecordBtn.prop('disabled',false);
        })
});

$stopRecordBtn.on('click', () => {
    $stopRecordBtn.prop("disabled", true);
    $nextBtn.prop("disabled", false);
    $recordingSign.addClass('d-none');
    $startRecordBtn.prop("disabled", false);
    $player.removeClass('d-none');
    $visualizer.addClass("d-none");

    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createObjectURL 
    rec.exportWAV((blob) => {
        const URL = window.URL || window.webkitURL;
        var bloburl = URL.createObjectURL(blob);
        crowdSource.audioBlob = blob;
        $player.prop("src",bloburl)
    });
});

$nextBtn.on('click', () => {
    if (currentIndex == totalItems - 1) {
        notyf.success("Congratulations!!! You have completed this batch of sentences");
    }
    if (currentIndex < totalItems - 1) {
        currentIndex++;
        setSentenceText(currentIndex);
        setCurrentSentenceIndex(currentIndex + 1);
        uploadToServer();
    } 
    $player.addClass('d-none');
    $nextBtn.prop("disabled", true);
})

function uploadToServer() {
    var fd = new FormData();
    fd.append("audio_data", crowdSource.audioBlob);
    fd.append("speakerDetails", localStorage.getItem("speakerDetails"));
    fd.append("sentenceId",crowdSource.sentences[currentIndex].id);
    fetch("/upload", {
        method: "POST",
        body: fd
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err)
        })
}
function visualize(visualizer, analyser) {
    var canvasCtx = visualizer.getContext("2d");
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    WIDTH = visualizer.width;
    HEIGHT = visualizer.height;
    // TODO do we need to limit the number of time visualize refreshes per second
    // so that it can run on Android processors without causing audio to drop?
    function draw() {
        // this is more efficient than calling with processor.onaudioprocess
        // and sending floatarray with each call...
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(67, 67, 67)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
        canvasCtx.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0; // uint8
            var y = v * HEIGHT / 2; // uint8
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(visualizer.width, visualizer.height / 2);
        canvasCtx.stroke();
    }
    draw();
}
