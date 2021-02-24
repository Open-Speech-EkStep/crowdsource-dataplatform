const {setPageContentHeight, toggleFooterPosition} = require('./utils')

const speakerDetailsKey = 'speakerDetails';
const sentencesKey = 'sentences';
const currentIndexKey = 'currentIndex';
const skipCountKey = 'skipCount';
const countKey = 'count';

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

const adjustTimeProgressBarHeight = ($footer) => {
    const $timeProgress = $('#time-progress');
    const footerHeight = $footer.outerHeight();
    const timeProgressBottomInPx = $timeProgress.css('bottom');
    const timeProgressBottomInNumber = Number(
        timeProgressBottomInPx.substring(0, timeProgressBottomInPx.length - 2)
    );
    if (timeProgressBottomInNumber) {
        $timeProgress.css('bottom', footerHeight + 'px');
    }
};


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
    const totalItems = sentences.length;
    let currentIndex =
        getCurrentIndex(totalItems - 1);
    let skipCount =
        getSkipCount(totalItems - 1);
    const $footer = $('footer');
    const progressMessages = [
        'Let’s get started',
        '',
        'We know you can do more! ',
        '',
        '',
        'You are halfway there. Keep going!',
        '',
        'Just few more steps to go!',
        '',
        'Nine dead, one more to go!',
        'Yay! Done & Dusted!',
    ];

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
        $progressBar.width(currentIndex * 10 + '%');
        $progressBar.prop('aria-valuenow', currentIndex);
    };
    const setSentenceText = (index) => {
        const $sentenceLbl = $('#sentenceLbl');
        $sentenceLbl[0].innerText = sentences[index].sentence;
        animateCSS($sentenceLbl, 'lightSpeedIn');
        currentIndex && setProgressBar(currentIndex);
    };

    const setTimeProgress = (index) => {
        const $timeGraphBar = $('#graphbar');
        const $timeValue = $('#time-value');
        //42em is graphforeground height in css
        const graphforegroundHeight = 42;
        // assuming a sentence is of 6 second
        const totalSecondsContributed = (crowdSource.count + index - skipCount) * 6;
        const totalSecondsToContribute = 30 * 60;
        const contriComplete = totalSecondsContributed >= totalSecondsToContribute;
        const remainingSeconds = contriComplete
            ? totalSecondsContributed
            : totalSecondsToContribute - totalSecondsContributed;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        $timeValue.text(`${minutes}m ${seconds}s`);
        contriComplete && $timeValue.siblings('p').text('We are loving it!');
        const perSecondTimeGraphHeight =
            graphforegroundHeight / totalSecondsToContribute;
        const currentTimeGraphHeight =
            perSecondTimeGraphHeight * totalSecondsContributed;
        $timeGraphBar.height(currentTimeGraphHeight + 'em');
    };
    const notyf = new Notyf({
        position: {x: 'center', y: 'top'},
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
        } else {
            $nextBtnToolTip.tooltip('disable');
            $nextBtn.removeAttr('disabled').removeClass('point-none');
            $audioSmallError.addClass('d-none');
        }
    };

    adjustTimeProgressBarHeight($footer);

    setSentenceText(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);
    setTimeProgress(currentIndex);

    let gumStream;
    let rec;
    let input;
    let cleartTimeoutKey;
    let audioCtx;

    $startRecordBtn.add($reRecordBtn).on('click', () => {
        navigator.mediaDevices
            .getUserMedia({audio: true, video: false})
            .then((stream) => {
                $getStarted.hide();
                $startRecordRow.addClass('d-none');
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
                cleartTimeoutKey = setTimeout(() => {
                    $stopRecordBtn.click();
                }, 30 * 1000);
            })
            .catch((err) => {
                console.log(err);
                notyf.error(
                    'Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission'
                );
                $startRecordRow.removeClass('d-none');
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
        clearTimeout(cleartTimeoutKey);
        $startRecordRow.addClass('d-none');
        $stopRecordBtn.addClass('d-none');
        $nextBtn.removeClass('d-none');
        $reRecordBtn.removeClass('d-none');
        $recordingSign.addClass('d-none');
        $recordingRow.addClass('d-none');
        $startRecordRow.addClass('d-none');
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
                const audioDuration = $player[0].duration;
                handleAudioDurationError(audioDuration);
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
            setTimeProgress(currentIndex + 1);
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
            toggleFooterPosition()
            currentIndex++;
            animateCSS($pageContent, 'zoomOut', () =>
                $pageContent.addClass('d-none')
            );
            setProgressBar(currentIndex);
            localStorage.removeItem(sentencesKey);
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

$(document).ready(() => {
    window.crowdSource = {};
    const $instructionModal = $('#instructionsModal');
    const $errorModal = $('#errorModal');
    const $loader = $('#loader');
    const $pageContent = $('#page-content');
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');

    try {
        const localSpeakerData = localStorage.getItem(speakerDetailsKey);
        const localSpeakerDataParsed = JSON.parse(localSpeakerData);
        const localSentences = localStorage.getItem(sentencesKey);
        const localSentencesParsed = JSON.parse(localSentences);
        const localCount = Number(localStorage.getItem(countKey));

        setPageContentHeight();

        $instructionModal.on('hidden.bs.modal', function () {
            $pageContent.removeClass('d-none');
            toggleFooterPosition();
        });

        $errorModal.on('show.bs.modal', function () {
            $instructionModal.modal('hide');
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

        if (
            localSentencesParsed &&
            localSentencesParsed.userName === localSpeakerDataParsed.userName &&
            localSentencesParsed.language === localSpeakerDataParsed.language
        ) {
            crowdSource.sentences = localSentencesParsed.sentences;
            crowdSource.count = localCount;
            $loader.hide();
            $pageContent.removeClass('d-none');
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
                    $instructionModal.modal('show');
                    crowdSource.sentences = sentenceData.data;
                    crowdSource.count = Number(sentenceData.count);
                    $loader.hide();
                    initialize();
                    localStorage.setItem(
                        sentencesKey,
                        JSON.stringify({
                            userName: localSpeakerDataParsed.userName,
                            sentences: sentenceData.data,
                        })
                    );
                    localStorage.setItem(countKey, sentenceData.count);
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

module.exports = {getCurrentIndex, getSkipCount, getValue, setCurrentSentenceIndex, setTotalSentenceIndex}
