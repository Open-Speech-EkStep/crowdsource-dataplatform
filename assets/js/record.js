const { setPageContentHeight, toggleFooterPosition, fetchLocationInfo, updateLocaleLanguagesDropdown, setFooterPosition } = require('./utils');
const { LOCALE_STRINGS } = require('./constants');

const speakerDetailsKey = 'speakerDetails';
const sentencesKey = 'sentences';
const currentIndexKey = 'currentIndex';
const skipCountKey = 'skipCount';
const countKey = 'count';

let currentIndex;
let cnvs;
let cnvs_cntxt;
const $testMicBtn = $('#test-mic-button');
const $testSpeakerBtn = $('#play-speaker');
let localeStrings;

function getValue(number, maxValue) {
    return number < 0
        ? 0
        : number > maxValue
            ? maxValue
            : number;
}

function getCurrentIndex(lastIndex) {
    const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
    return getValue(currentIndexInStorage, lastIndex);
}

function getSkipCount(totalItems) {
    const skipCountInStorage = Number(localStorage.getItem(skipCountKey));
    return getValue(skipCountInStorage, totalItems)
}

const setCurrentSentenceIndex = (index) => {
    const currentSentenceLbl = document.getElementById('currentSentenceLbl');
    currentSentenceLbl.innerText = index;
}

const setTotalSentenceIndex = (index) => {
    const totalSentencesLbl = document.getElementById('totalSentencesLbl');
    totalSentencesLbl.innerText = index;
}

const startTimer = (seconds, display) => {
    const counterSpan = document.getElementById('counter')
    counterSpan.innerHTML = `0${seconds}`
    display.classList.remove('d-none');
    let interval = setInterval(function () {

        counterSpan.innerText = `0${seconds}`
        seconds--
        if (seconds < 0) {
            clearInterval(interval)
            display.classList.add('d-none');
        }
    }, 1000);
}

function flattenArray(channelBuffer, recordingLength) {
    let result = new Float32Array(recordingLength);
    let offset = 0;
    for (let i = 0; i < channelBuffer.length; i++) {
        let buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}
function writeUTFBytes(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
function generateWavBlob(finalBuffer, defaultSampleRate) {
    let buffer = new ArrayBuffer(44 + finalBuffer.length * 2);
    let view = new DataView(buffer);
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + finalBuffer.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // chunkSize
    view.setUint16(20, 1, true); // wFormatTag
    view.setUint16(22, 1, true); // wChannels:mono(1 channel) / stereo (2 channels)
    view.setUint32(24, defaultSampleRate, true); // dwSamplesPerSec
    view.setUint32(28, defaultSampleRate * 2, true); // dwAvgBytesPerSec
    view.setUint16(32, 4, true); // wBlockAlign
    view.setUint16(34, 16, true); // wBitsPerSample
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, finalBuffer.length * 2, true);
    // write the PCM samples
    let index = 44;
    let volume = 1;
    for (var i = 0; i < finalBuffer.length; i++) {
        view.setInt16(index, finalBuffer[i] * (0x7FFF * volume), true);
        index += 2;
    }
    // our final blob
    let blob = new Blob([view], {
        type: 'audio/wav'
    });
    return blob;
}
const resetMicButton = () => {
    const $testMicText = $('#test-mic-text');
    if (audioContext) { audioContext.close(); audioContext = undefined };
    $testMicText.text(localeStrings['Test mic']);
    $('#mic-svg').removeClass('d-none');
    $testMicBtn.attr('data-value', 'test-mic');
    cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
    secondsDown = 5;
    clearInterval(timeIntervalUp);
}
let audioData = [];
let recordingLength = 0;
let audioContext;
let micAudio;
let timeIntervalUp;
let secondsDown = 5;

const startRecordingTimer = () => {
    $('#mic-svg').addClass('d-none');
    $('#test-mic-text').text(localeStrings[`Recording for ${secondsDown} seconds`]);
    $testMicBtn.attr('data-value', 'recording');
    secondsDown--;
    timeIntervalUp = setInterval(function () {
        countTimer();
    }, 1000);
}

const countTimer = () => {
    const $testMicText = $('#test-mic-text');
    $testMicText.text(localeStrings[`Recording for ${secondsDown} seconds`]);
    secondsDown--;
    if (secondsDown === 0) {
        clearInterval(timeIntervalUp);
        $testMicBtn.attr('data-value', 'stop-recording');
        testMic('stop-recording');
    }
}
const getMediaRecorder = () => {
    let stream = null,
        microphone = null,
        javascriptNode = null,
        sampleRate = 44100;
    let max_level_L = 0;
    let old_level_L = 0;
    const start = () => {
        let constraints = {
            audio: true,
            video: false
        };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (stream) {
                startRecordingTimer();
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                sampleRate = audioContext.sampleRate;
                microphone = audioContext.createMediaStreamSource(stream);
                javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
                microphone.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                javascriptNode.onaudioprocess = function (event) {
                    let inpt_L = event.inputBuffer.getChannelData(0);
                    recordingLength += 1024;
                    audioData.push(new Float32Array(inpt_L));
                    let instant_L = 0.0;
                    let sum_L = 0.0;
                    for (let i = 0; i < inpt_L.length; ++i) {
                        sum_L += inpt_L[i] * inpt_L[i];
                    }
                    instant_L = Math.sqrt(sum_L / inpt_L.length);
                    max_level_L = Math.max(max_level_L, instant_L);
                    instant_L = Math.max(instant_L, old_level_L - 0.008);
                    old_level_L = instant_L;
                    cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
                    cnvs_cntxt.fillStyle = "#83E561";
                    cnvs_cntxt.fillRect(
                        0,
                        0,
                        cnvs.width * (instant_L / max_level_L),
                        cnvs.height
                    );
                };
            })
            .catch(function (err) {
                console.log(err);
                resetMicButton();
            });
    }
    const stop = () => {
        if (microphone !== null)
            microphone.disconnect();
        if (javascriptNode !== null)
            javascriptNode.disconnect();
        let finalBuffer = flattenArray(audioData, recordingLength);
        let audioBlob = generateWavBlob(finalBuffer, sampleRate);
        if (audioBlob !== null) {
            const audioUrl = URL.createObjectURL(audioBlob);
            micAudio = new Audio(audioUrl);
            micAudio.onloadedmetadata = function() {
                const audioDuration = Math.ceil(micAudio.duration*1000);
                setTimeout(() => {
                    resetMicButton();
                }, audioDuration);
            };
            const play = () => {
                micAudio.play();
            };
            return ({
                audioBlob,
                audioUrl,
                play
            });
        } else {
            console.log("No blob present")
            return null;
        }
    }
    return {
        start,
        stop
    };
}
const testMic = (btnDataAttr) => {
    const $testMicText = $('#test-mic-text');
    const recorder = getMediaRecorder();
    if (btnDataAttr === 'test-mic') {
        audioData = [];
        recordingLength = 0;
        recorder.start();
    } else if (btnDataAttr === 'stop-recording') {
        const audio = recorder.stop();
        audio.play();
        $testMicBtn.attr('data-value', 'playing');
        $testMicText.text(localeStrings['Playingback Audio']);
    }
}

const initialize = () => {
    const sentences = crowdSource.sentences;
    const $startRecordBtn = $('#startRecord');
    const $startRecordRow = $('#startRecordRow');
    const $stopRecordBtn = $('#stopRecord');
    const $reRecordBtn = $('#reRecord');
    const $visualizer = $('#visualizer');
    const $player = $('#player');
    const $nextBtn = $('#nextBtn');
    const $nextBtnToolTip = $nextBtn.parent();
    const $getStarted = $('#get-started');
    const $skipBtn = $('#skipBtn');
    const $recordingRow = $('#recording-row');
    const $recordingSign = $('#recording-sign');
    const $progressBar = $('.progress-bar');
    const $pageContent = $('#page-content');
    const $audioSmallError = $('#audio-small-error');
    const $autoStopWarning = document.getElementById("count-down");
    const $testMicDiv = $('#test-mic-speakers');
    const $testMicSpeakerBtn = $('#test-mic-speakers-button')
    const $testMicSpeakerDetails = $('#test-mic-speakers-details');
    const $testMicCloseBtn = $('#test-mic-close');
    const totalItems = sentences.length;
    currentIndex = getCurrentIndex(totalItems - 1);
    let skipCount =
        getSkipCount(totalItems - 1);
    const $footer = $('footer');
    // const progressMessages = [
    //     'Let’s get started',
    //     '',
    //     'We know you can do more! ',
    //     '',
    //     '',
    //     'You are halfway there. Keep going!',
    //     '',
    //     'Just few more steps to go!',
    //     '',
    //     'Nine dead, one more to go!',
    //     'Yay! Done & Dusted!',
    // ];

    $testMicSpeakerBtn.on('click', (e) => {
        $testMicDiv.addClass('d-none');
        $testMicSpeakerDetails.removeClass('d-none');
    });
    $testMicCloseBtn.on('click', (e) => {
        $testMicDiv.removeClass('d-none');
        $testMicSpeakerDetails.addClass('d-none');
        audioData = [];
        recordingLength = 0;
        if (micAudio) {
            micAudio.pause();
            micAudio.currentTime = 0;
        }
        if (speakerAudio) {
            speakerAudio.pause();
            speakerAudio.currentTime = 0;
        }
        resetMicButton();
        resetSpeakerButton();
    });
    $testMicBtn.on('click', (e) => {
        const btnDataAttr = $('#test-mic-button').attr('data-value');
        testMic(btnDataAttr);
    });
    $testSpeakerBtn.on('click', (e) => {
        $testSpeakerBtn.attr('data-value', 'playing');
        $('#test-speaker-text').text(localeStrings['Playing']);
        $('#speaker-svg').addClass('d-none');
        playSpeaker();
    });

    let progressMessages = [
        'Let’s get started',
        'We know you can do more! ',
        'You are halfway there. Keep going!',
        'Just few more steps to go!',
        'Four dead, one more to go!',
        'Yay! Done & Dusted!',
    ];

    if (sentences.length == 4) {
        progressMessages = [
            'Let’s get started',
            'We know you can do more! ',
            'You are halfway there. Keep going!',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    }
    else if (sentences.length == 3) {
        progressMessages = [
            'Let’s get started',
            'We know you can do more! ',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    }
    else if (sentences.length == 2) {
        progressMessages = [
            'Let’s get started',
            'Just few more steps to go!',
            'Yay! Done & Dusted!'
        ];
    }
    else if (sentences.length == 1) {
        progressMessages = [
            'Let’s get started',
            'Yay! Done & Dusted!'
        ];
    }

    $nextBtnToolTip.tooltip({
        container: 'body',
        placement: screen.availWidth > 900 ? 'right' : 'bottom',
    });

    const animateCSS = ($element, animationName, callback) => {
        $element.addClass(`animated ${animationName}`);

        function handleAnimationEnd() {
            $element.removeClass(`animated ${animationName}`);
            $element.off('animationend');
            if (typeof callback === 'function') callback();
        }

        $element.on('animationend', handleAnimationEnd);
    };

    const setProgressBar = (currentIndex) => {
        $progressBar.width(currentIndex * 20 + '%');
        $progressBar.prop('aria-valuenow', currentIndex);
    };

    const setSentenceText = (index) => {
        const $sentenceLbl = $('#sentenceLbl');
        $sentenceLbl[0].innerText = sentences[index].sentence;
        animateCSS($sentenceLbl, 'lightSpeedIn');
        currentIndex && setProgressBar(currentIndex);
    };

    const notyf = new Notyf({
        position: { x: 'center', y: 'top' },
        types: [
            {
                type: 'success',
                className: 'fnt-1-5',
            },
            {
                type: 'error',
                duration: 3500,
                className: 'fnt-1-5',
            },
        ],
    });

    const handleAudioDurationError = (duration) => {
        if (duration < 2) {
            $nextBtnToolTip.tooltip('enable');
            $nextBtn.prop('disabled', true).addClass('point-none');
            $audioSmallError.removeClass('d-none');
            return false;
        } else {
            $nextBtnToolTip.tooltip('disable');
            $nextBtn.removeAttr('disabled').removeClass('point-none');
            $audioSmallError.addClass('d-none');
            return true;
        }
    };

    setSentenceText(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);

    let gumStream;
    let rec;
    let input;
    let cleartTimeoutKey;
    let timerTimeoutKey;
    let audioCtx;

    $startRecordBtn.add($reRecordBtn).on('click', () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((stream) => {
                $getStarted.hide();
                $startRecordBtn.addClass('d-none');
                $skipBtn.prop('disabled',true);
                $startRecordRow.removeClass('d-none');
                $stopRecordBtn.removeClass('d-none');
                $recordingRow.removeClass('d-none');
                $recordingSign.removeClass('d-none');
                $reRecordBtn.addClass('d-none');
                $nextBtn.addClass('d-none');
                $player.addClass('d-none');
                $player.trigger('pause');
                $visualizer.removeClass('d-none');
                $nextBtnToolTip.tooltip('disable');
                $audioSmallError.addClass('d-none');

                gumStream = stream;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (audioCtx) {
                    audioCtx.close();
                }
                audioCtx = new AudioContext();
                const audioAnalyser = audioCtx.createAnalyser();
                //new audio context to help us record
                input = audioCtx.createMediaStreamSource(stream);
                input.connect(audioAnalyser);
                visualize(visualizer, audioAnalyser);
                /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
                rec = new Recorder(input, {
                    numChannels: 2,
                });
                //start the recording process
                rec.record();
                //automatically click stop button after 30 seconds

                timerTimeoutKey = setTimeout(() => {
                    $autoStopWarning.classList.remove('d-none');
                    startTimer(5, $autoStopWarning)
                }, 15 * 1000);

                cleartTimeoutKey = setTimeout(() => {
                    $stopRecordBtn.click();
                }, 21 * 1000);
            })
            .catch((err) => {
                console.log(err);
                notyf.error(
                    'Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission'
                );
                // $startRecordRow.removeClass('d-none');
                $stopRecordBtn.addClass('d-none');
                $nextBtn.addClass('d-none');
                $reRecordBtn.addClass('d-none');
                $recordingSign.addClass('d-none');
                $recordingRow.addClass('d-none');
                $player.addClass('d-none');
                $player.trigger('pause');
                $visualizer.addClass('d-none');
                $audioSmallError.addClass('d-none');
            });
    });

    $stopRecordBtn.on('click', () => {
        const $startRecordRow = $('#startRecordRow');
        clearTimeout(cleartTimeoutKey);
        clearTimeout(timerTimeoutKey)
        $autoStopWarning.classList.add('d-none');
        $startRecordRow.addClass('d-none');
        $stopRecordBtn.addClass('d-none');
        $nextBtn.removeClass('d-none');
        $skipBtn.prop('disabled',false);
        $reRecordBtn.removeClass('d-none');
        $recordingSign.addClass('d-none');
        $recordingRow.addClass('d-none');
        $player.removeClass('d-none');
        $visualizer.addClass('d-none');

        rec.stop(); //stop microphone access
        gumStream.getAudioTracks()[0].stop();
        //create the wav blob and pass it on to createObjectURL
        rec.exportWAV((blob) => {
            const URL = window.URL || window.webkitURL;
            const bloburl = URL.createObjectURL(blob);
            crowdSource.audioBlob = blob;
            $player.prop('src', bloburl);
            $player.on('loadedmetadata', () => {
                const duration = $player[0].duration;
                const isValidAudio = handleAudioDurationError(duration);
                if (isValidAudio) {
                    crowdSource.audioDuration = duration
                }
            });
        });
        if (currentIndex === totalItems - 1) {
            $getStarted.text(progressMessages[totalItems]).show();
        }
    });

    const goToThankYouPage = () => {
        location.href = '/thank-you';
    };

    $nextBtn.add($skipBtn).on('click', (event) => {
        if (event.target.id === 'nextBtn' && currentIndex < totalItems - 1) {
            uploadToServer();
        } else if (event.target.id === 'skipBtn') {
            incrementSkipCount();
            $skipBtn.addClass('d-none');
        }
        if (currentIndex === totalItems - 1) {
            if (event.target.id === 'nextBtn') {
                uploadToServer(goToThankYouPage);
            } else {
                setTimeout(goToThankYouPage, 2500);
            }
            $skipBtn.addClass('d-none');
            // toggleFooterPosition()
            currentIndex++;
            animateCSS($pageContent, 'zoomOut', () => {
                $pageContent.addClass('d-none');
                $('footer').removeClass('bottom').addClass('fixed-bottom');
            });
            setProgressBar(currentIndex);
            const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
            Object.assign(sentencesObj, { sentences: [] });
            localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
            localStorage.setItem(currentIndexKey, currentIndex);
            notyf.success(
                'Congratulations!!! You have completed this batch of sentences'
            );
            $('#loader').show();
        } else if (currentIndex < totalItems - 1) {
            incrementCurrentIndex();
        }

        $player.addClass('d-none');
        $player.trigger('pause');
        $nextBtn.addClass('d-none');

        $reRecordBtn.addClass('d-none');
        $startRecordRow.removeClass('d-none');
        $startRecordBtn.removeClass('d-none');
    });

    function incrementCurrentIndex() {
        currentIndex++;
        setSentenceText(currentIndex);
        setCurrentSentenceIndex(currentIndex + 1);
        $getStarted.text(progressMessages[currentIndex]);
        localStorage.setItem(currentIndexKey, currentIndex);
        $skipBtn.removeClass('d-none');
    }

    function incrementSkipCount() {
        skipCount++;
        localStorage.setItem(skipCountKey, skipCount);
    }

    function uploadToServer(cb) {
        const fd = new FormData();
        const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
        const speakerDetails = JSON.stringify({
            userName: localSpeakerDataParsed.userName,
            language: localSpeakerDataParsed.language,
        })
        fd.append('audio_data', crowdSource.audioBlob);
        fd.append('speakerDetails', speakerDetails);
        fd.append('sentenceId', crowdSource.sentences[currentIndex].sentenceId);
        fd.append('state', localStorage.getItem('state_region') || "");
        fd.append('country', localStorage.getItem('country') || "");
        fd.append('audioDuration', crowdSource.audioDuration);
        fetch('/upload', {
            method: 'POST',
            body: fd,
        })
            .then((res) => res.json())
            .then((result) => {
            })
            .catch((err) => {
                console.log(err);
            })
            .then((finalRes) => {
                if (cb && typeof cb === 'function') {
                    cb();
                }
            });
    }

    function visualize(visualizer, analyser) {
        const canvasCtx = visualizer.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const WIDTH = visualizer.width;
        const HEIGHT = visualizer.height;
        // TODO do we need to limit the number of time visualize refreshes per second
        // so that it can run on Android processors without causing audio to drop?
        function draw() {
            // this is more efficient than calling with processor.onaudioprocess
            // and sending floatarray with each call...
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.fillStyle = 'rgb(255, 255, 255, 0.8)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0,123,255)';
            canvasCtx.beginPath();
            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0; // uint8
                let y = (v * HEIGHT) / 2; // uint8
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
};

const resetSpeakerButton = () => {
    cancelAnimationFrame(speakerAnimationID);
    if (speakerCanvasCtx) {speakerCanvasCtx.clearRect(0, 0, speakerCanvas.width, speakerCanvas.height)};
    $testSpeakerBtn.attr('data-value', 'test-speaker');
    $('#test-speaker-text').text(localeStrings['Test Speakers']);
    $('#speaker-svg').removeClass('d-none');
}

let context;
let analyser;
let mediaElementSrc;
let speakerAnimationID = null;
let speakerAudio;
let speakerCanvas;
let speakerCanvasCtx;
function playSpeaker() {
    speakerAudio = document.getElementById("test-speaker-hidden");
    speakerAudio.play();
    if (!context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        mediaElementSrc = context.createMediaElementSource(speakerAudio);
        analyser = context.createAnalyser();
        mediaElementSrc.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;
    }
    speakerCanvas = document.getElementById("speaker-canvas");
    speakerCanvasCtx = speakerCanvas.getContext("2d");
    let bufferLength = analyser.frequencyBinCount;
    let max_level_L = 50;
    let dataArray = new Uint8Array(bufferLength);
    function renderFrame() {
        speakerAnimationID = requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(dataArray);
        let instant_L = 0.0;
        let sum_L = 0.0;
        for (let i = 0; i < dataArray.length; ++i) {
            sum_L += dataArray[i] * dataArray[i];
        }
        instant_L = Math.sqrt(sum_L / dataArray.length);
        max_level_L = Math.max(max_level_L, instant_L);
        speakerCanvasCtx.clearRect(0, 0, speakerCanvas.width, speakerCanvas.height);
        speakerCanvasCtx.fillStyle = "#83E561";
        speakerCanvasCtx.fillRect(
            0,
            0,
            speakerCanvas.width * (instant_L / max_level_L),
            speakerCanvas.height
        );
    }
    renderFrame();
    speakerAudio.onended = function() {
        resetSpeakerButton();
    };
}

const handleSubmitFeedback = function () {
    const contributionLanguage = localStorage.getItem("contributionLanguage");
    const otherText = $("other_text").val();
    const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));
        
    const reqObj = {
        sentenceId: crowdSource.sentences[currentIndex].sentenceId,
        reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
        language: contributionLanguage,
        userName: speakerDetails.userName
    };
    fetch('/report', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
        })
        .then((res) => res.json())
        .then((resp) => {
            if (resp.statusCode === 200) {
                $("#report_sentence_modal").modal('hide');
                $("#report_sentence_thanks_modal").modal('show');
                $("#report_submit_id").attr("disabled", true);
                $("input[type=radio][name=reportRadio]").each(function(){
                      $(this).prop("checked",false);
                });
                $("#other_text").val("");
            }
        })
}

let selectedReportVal = '';
$(document).ready(() => {
    $('footer').removeClass('bottom').addClass('fixed-bottom');
    setPageContentHeight();
    window.crowdSource = {};
    //const $instructionModal = $('#instructionsModal');
    const $validationInstructionModal = $("#validation-instruction-modal");
    const $errorModal = $('#errorModal');
    const $reportModal = $("#report_sentence_modal");
    const $loader = $('#loader');
    const $pageContent = $('#page-content');
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    cnvs = document.getElementById("mic-canvas");
    cnvs_cntxt = cnvs.getContext("2d");
    localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    if(contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }

    $("#report_submit_id").on('click', handleSubmitFeedback);

    $("#report_btn").on('click', function() {
        $reportModal.modal('show');
    });

    $("#report_close_btn").on("click", function() {
        $reportModal.modal('hide');
    });

    $("#report_sentence_thanks_close_id").on("click", function() {
        $("#report_sentence_thanks_modal").modal('hide');
    });

    $("input[type=radio][name=reportRadio]").on("change", function() {
        selectedReportVal = this.value;
        $("#report_submit_id").attr("disabled", false);
    });

    fetchLocationInfo().then(res => {
        return res.json()
    }).then(response => {
        localStorage.setItem("state_region", response.regionName);
        localStorage.setItem("country", response.country);
    }).catch(console.log);
    try {
        const localSpeakerData = localStorage.getItem(speakerDetailsKey);
        const localSpeakerDataParsed = JSON.parse(localSpeakerData);
        const localSentences = localStorage.getItem(sentencesKey);
        const localSentencesParsed = JSON.parse(localSentences);
        const localCount = Number(localStorage.getItem(countKey));

        setPageContentHeight();

        //$instructionModal.on('hidden.bs.modal', function () {
          //  $pageContent.removeClass('d-none');
            // toggleFooterPosition();
        //});
    
            $("#instructions_close_btn").on("click", function() {
                $validationInstructionModal.addClass("d-none");
                setFooterPosition();
            })

        $errorModal.on('show.bs.modal', function () {
            //$instructionModal.modal('hide');
            $validationInstructionModal.addClass("d-none");
            setFooterPosition();

        });
        $errorModal.on('hidden.bs.modal', function () {
            location.href = '/#speaker-details';
        });

        if (!localSpeakerDataParsed) {
            location.href = '/#speaker-details';
            return;
        }

        $navUser.removeClass('d-none');
        $('#nav-login').addClass('d-none');
        $navUserName.text(localSpeakerDataParsed.userName);
        const isExistingUser = localSentencesParsed &&
            localSentencesParsed.userName === localSpeakerDataParsed.userName
            &&
            localSentencesParsed.language === localSpeakerDataParsed.language;

        if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === contributionLanguage) {
            crowdSource.sentences = localSentencesParsed.sentences;
            crowdSource.count = localCount;
            $loader.hide();
            $pageContent.removeClass('d-none');
            setFooterPosition();
            initialize();
        } else {
            localStorage.removeItem(currentIndexKey);
            localStorage.removeItem(skipCountKey);
            fetch('/sentences', {
                method: 'POST',
                body: JSON.stringify({
                    userName: localSpeakerDataParsed.userName,
                    age: localSpeakerDataParsed.age,
                    language: localSpeakerDataParsed.language,
                    motherTongue: localSpeakerDataParsed.motherTongue,
                    gender: localSpeakerDataParsed.gender,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((data) => {
                    if (!data.ok) {
                        throw Error(data.statusText || 'HTTP error');
                    } else {
                        return data.json();
                    }
                })
                .then((sentenceData) => {
                    if (!isExistingUser) {
                        //$instructionModal.modal('show');
                        $validationInstructionModal.removeClass("d-none");
                        setFooterPosition();
                        // toggleFooterPosition();
                    } 
                    $pageContent.removeClass('d-none');
                    // toggleFooterPosition();
                    
                    crowdSource.sentences = sentenceData.data;
                    crowdSource.count = Number(sentenceData.count);
                    $loader.hide();
                    localStorage.setItem(
                        sentencesKey,
                        JSON.stringify({
                            userName: localSpeakerDataParsed.userName,
                            sentences: sentenceData.data,
                            language: localSpeakerDataParsed.language,
                        })
                    );
                    localStorage.setItem(countKey, sentenceData.count);
                    setFooterPosition();
                    initialize();
                })
                .catch((err) => {
                    console.log(err);
                    $errorModal.modal('show');
                })
                .then(() => {
                    $loader.hide();
                });
        }
    } catch (err) {
        console.log(err);
        $errorModal.modal('show');
    }
});


$(window).resize(() => {
    setFooterPosition();
});

module.exports = { getCurrentIndex, getSkipCount, getValue, setCurrentSentenceIndex, setTotalSentenceIndex }
