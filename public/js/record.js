const sentences = crowdSource.sentences;

const currentSentenceLbl = document.getElementById("currentSentenceLbl");
const totalSentencesLbl = document.getElementById("totalSentencesLbl");
const sentenceLbl = document.getElementById("sentenceLbl");

const setSentenceText = (index) => sentenceLbl.innerText = sentences[index];
const setCurrentSentenceIndex = (index) => currentSentenceLbl.innerText = index;
const setTotalSentenceIndex = (index) => totalSentencesLbl.innerText = index;

let currentIndex = 0;
const totalItems = sentences.length;
setSentenceText(currentIndex);
setCurrentSentenceIndex(currentIndex + 1);
setTotalSentenceIndex(totalItems);


// const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// prevBtn.addEventListener('click', () => {
//     if (currentIndex > 0) {
//         currentIndex--;
//         setSentenceText(currentIndex);
//         setCurrentSentenceIndex(currentIndex + 1);
//         nextBtn.disabled = false;
//     }
//     if (currentIndex == 0) {
//         prevBtn.disabled = true;
//     }
//     setElementVisibilityById("player", "hidden");
// })
nextBtn.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
        currentIndex++;
        setSentenceText(currentIndex);
        setCurrentSentenceIndex(currentIndex + 1);
        // prevBtn.disabled = false;
        uploadToServer();
    }
    if (currentIndex == totalItems - 1) {
        nextBtn.disabled = true;
    }
    setElementVisibilityById("player", "hidden");
    nextBtn.disabled = true;
})
const setElementVisibilityById = (id, visibility) => {
    document.getElementById(id).style.visibility = visibility;
}
const setElementDisplayById = (id, display) => {
    document.getElementById(id).style.display = display;
}
setElementVisibilityById("player", "hidden");
setElementDisplayById("recording-sign", "none")

const startRecordBtn = document.getElementById("startRecord");
const stopRecordBtn = document.getElementById("stopRecord");

var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

startRecordBtn.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            stopRecordBtn.disabled = false;
            setElementDisplayById("recording-sign", "inline-block");
            setElementDisplayById("startRecord", "none");
            setElementVisibilityById("player", "hidden");


            gumStream = stream;
            // shim for AudioContext when it's not avb. 
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var audioContext = new AudioContext;
            //new audio context to help us record 
            input = audioContext.createMediaStreamSource(stream);
            /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
            rec = new Recorder(input, {
                numChannels: 1
            })
            //start the recording process 
            rec.record()
        })
        .catch(err => {
            alert("Sorry !!! We could not get access to your audio input device");
        });
});

stopRecordBtn.addEventListener('click', () => {
    stopRecordBtn.disabled = true;
    nextBtn.disabled = false;
    setElementDisplayById("recording-sign", "none");
    setElementDisplayById("startRecord", "inline-block");
    setElementVisibilityById("player", "visible");

    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV((blob) => {
        const URL = window.URL || window.webkitURL;
        var bloburl = URL.createObjectURL(blob);
        crowdSource.audioBlob = blob;
        const player = document.getElementById('player');
        player.src = bloburl;
    });
});

function uploadToServer() {
    var fd = new FormData();
    fd.append("audio_data", crowdSource.audioBlob);
    fd.append("speakerDetails", localStorage.getItem("speakerDetails"));
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
