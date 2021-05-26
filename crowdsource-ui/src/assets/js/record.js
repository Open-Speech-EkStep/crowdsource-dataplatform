const fetch = require('./fetch')
const { setPageContentHeight, fetchLocationInfo, updateLocaleLanguagesDropdown, setFooterPosition, getLocaleString, reportSentenceOrRecording } = require('./utils');
const { LOCALE_STRINGS } = require('./constants');

const speakerDetailsKey = 'speakerDetails';
const sentencesKey = 'sentences';
const currentIndexKey = 'currentIndex';
const skipCountKey = 'skipCount';
const countKey = 'count';

let currentIndex;
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

const initialize = () => {
    const sentences = crowdSource.sentences;
    const $startRecordBtn = $('#startRecord');
    const $startRecordRow = $('#startRecordRow');
    const $stopRecordBtn = $('#stopRecord');
    const $reRecordBtn = $('#reRecord');
    const $visualizer = $('#visualizer');
    const $player = $('#player');
    const $audioPlayer = $('#audio-controller');
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
    const totalItems = sentences.length;
    currentIndex = getCurrentIndex(totalItems - 1);
    let skipCount = getSkipCount(totalItems - 1);

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
        $progressBar.width((currentIndex + 1) * 20 + '%');
        $progressBar.prop('aria-valuenow', currentIndex + 1);
    };

    const setSentenceText = (index) => {
        const $sentenceLbl = $('#sentenceLbl');
        $sentenceLbl[0].innerText = sentences[index].media_data;
        animateCSS($sentenceLbl, 'lightSpeedIn');
        setProgressBar(currentIndex);
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
                $skipBtn.prop('disabled', true);
                $nextBtn.prop('disabled', true);
                $startRecordRow.removeClass('d-none');
                $stopRecordBtn.removeClass('d-none');
                $recordingRow.removeClass('d-none');
                $('#straight-line-row').addClass('d-none');

                $recordingSign.removeClass('d-none');
                $reRecordBtn.addClass('d-none');
                $audioPlayer.addClass('d-none');
                $player.trigger('pause');
                $visualizer.removeClass('d-none');
                $nextBtnToolTip.tooltip('disable');
                $audioSmallError.addClass('d-none');

                gumStream = stream;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (audioCtx) {
                    audioCtx.close();
                }
                audioCtx = new AudioContext()
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
                $audioPlayer.addClass('d-none');
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
        // $startRecordRow.addClass('d-none');
        $stopRecordBtn.addClass('d-none');
        // $nextBtn.removeClass('d-none');
        $skipBtn.prop('disabled', false);
        $reRecordBtn.removeClass('d-none');
        $recordingSign.addClass('d-none');
        $recordingRow.addClass('d-none');
        $audioPlayer.removeClass('d-none');
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
        location.href = './thank-you.html';
    };

    $skipBtn.hover(() => {
        $skipBtn.css('border-color', '#bfddf5');
    }, () => {
        $skipBtn.css('border-color', 'transparent');
    })

    $skipBtn.mousedown(() => {
        $skipBtn.css('background-color', 'white')
    })

    const onHover = function (btn){
        btn.css('background-color','rgba(0, 123, 255, 0.3)');
    }

    const afterHover = function (btn){
        btn.css('background-color','white');
    }


    $stopRecordBtn.hover(() => {
          onHover($stopRecordBtn);
      },
      () => {
          afterHover($stopRecordBtn)
      });

    $startRecordBtn.hover(() => {
          onHover($startRecordBtn);
      },
      () => {
          afterHover($startRecordBtn)
      });

    $reRecordBtn.hover(() => {
          onHover($reRecordBtn);
      },
      () => {
          afterHover($reRecordBtn)
      });

    $nextBtn.add($skipBtn).on('click', (event) => {
        if (event.target.id === 'nextBtn' && currentIndex < totalItems - 1) {
            uploadToServer();
        } else if (event.target.id === 'skipBtn') {
            markContributionSkipped();
            incrementSkipCount();
            // $skipBtn.addClass('d-none');
        }
        if (currentIndex === totalItems - 1) {
            if (event.target.id === 'nextBtn') {
                uploadToServer(goToThankYouPage);
            } else {
                setTimeout(goToThankYouPage, 2500);
            }
            $skipBtn.addClass('d-none');
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
            const msg = localeStrings['Congratulations!!! You have completed this batch of sentences'];
            notyf.success(msg);
            $('#loader').show();
        } else if (currentIndex < totalItems - 1) {
            incrementCurrentIndex();
        }

        $audioPlayer.addClass('d-none');
        $player.trigger('pause');
        $nextBtn.prop('disabled', true);
        $reRecordBtn.addClass('d-none');
        $("#straight-line-row").removeClass('d-none');
        $startRecordRow.removeClass('d-none');
        $startRecordBtn.removeClass('d-none');
    });

    function incrementCurrentIndex() {
        currentIndex++;
        setSentenceText(currentIndex);
        setCurrentSentenceIndex(currentIndex + 1);
        $getStarted.text(progressMessages[currentIndex]);
        localStorage.setItem(currentIndexKey, currentIndex);
        // $skipBtn.removeClass('d-none');
    }

    function incrementSkipCount() {
        skipCount++;
        localStorage.setItem(skipCountKey, skipCount);
    }

    function markContributionSkipped() {
        const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

        const reqObj = {
            sentenceId: crowdSource.sentences[currentIndex].dataset_row_id,
            userName: speakerDetails.userName
        };
        fetch('/skip', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqObj),
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

    function uploadToServer(cb) {
        const fd = new FormData();
        const localSpeakerDataParsed = JSON.parse(localStorage.getItem(speakerDetailsKey));
        const speakerDetails = JSON.stringify({
            userName: localSpeakerDataParsed.userName,
            age: localSpeakerDataParsed.age,
            motherTongue: localSpeakerDataParsed.motherTongue,
            gender: localSpeakerDataParsed.gender
        })
        fd.append('audio_data', crowdSource.audioBlob);
        fd.append('speakerDetails', speakerDetails);
        fd.append('language', localSpeakerDataParsed.language);
        fd.append('sentenceId', crowdSource.sentences[currentIndex].dataset_row_id);
        fd.append('state', localStorage.getItem('state_region') || "");
        fd.append('country', localStorage.getItem('country') || "");
        fd.append('audioDuration', crowdSource.audioDuration);
        fetch('/store', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
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

const handleSubmitFeedback = function () {
    const contributionLanguage = localStorage.getItem("contributionLanguage");
    const otherText = $("#other_text").val();
    const speakerDetails = JSON.parse(localStorage.getItem(speakerDetailsKey));

    const reqObj = {
        sentenceId: crowdSource.sentences[currentIndex].dataset_row_id,
        reportText: (otherText !== "" && otherText !== undefined) ? `${selectedReportVal} - ${otherText}` : selectedReportVal,
        language: contributionLanguage,
        userName: speakerDetails.userName,
        source: "contribution"
    };
    reportSentenceOrRecording(reqObj).then(function (resp) {
        if (resp.statusCode === 200) {
            $('#skipBtn').click();
            $("#report_sentence_modal").modal('hide');
            $("#report_sentence_thanks_modal").modal('show');
            $("#report_submit_id").attr("disabled", true);
            $("input[type=radio][name=reportRadio]").each(function () {
                $(this).prop("checked", false);
            });
            $("#other_text").val("");
        }
    });
}

let selectedReportVal = '';

function executeOnLoad() {
    $('footer').removeClass('bottom').addClass('fixed-bottom');
    setPageContentHeight();
    window.crowdSource = {};
    const $validationInstructionModal = $("#validation-instruction-modal");
    const $errorModal = $('#errorModal');
    const $reportModal = $("#report_sentence_modal");
    const $loader = $('#loader');
    const $pageContent = $('#page-content');
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }

    $("#report_submit_id").on('click', handleSubmitFeedback);

    $("#report_btn").on('click', function () {
        $reportModal.modal('show');
    });

    $("#report_close_btn").on("click", function () {
        $reportModal.modal('hide');
    });

    $("#report_sentence_thanks_close_id").on("click", function () {
        $("#report_sentence_thanks_modal").modal('hide');
    });

    $("input[type=radio][name=reportRadio]").on("change", function () {
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
        $("#instructions_close_btn").on("click", function () {
            $validationInstructionModal.addClass("d-none");
            setFooterPosition();
        })

        $errorModal.on('show.bs.modal', function () {
            $validationInstructionModal.addClass("d-none");
            setFooterPosition();

        });
        $errorModal.on('hidden.bs.modal', function () {
            location.href = './home.html#speaker-details';
        });

        if (!localSpeakerDataParsed) {
            location.href = './home.html#speaker-details';
            return;
        }

        if(localSpeakerDataParsed.userName && localSpeakerDataParsed.userName.length > 0){
            $navUser.removeClass('d-none');
            $('#nav-login').addClass('d-none');
            $navUserName.text(localSpeakerDataParsed.userName);
        }
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
            const type = 'text';
            fetch(`/media/${type}`, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({
                    userName: localSpeakerDataParsed.userName,
                    language: localSpeakerDataParsed.language,
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
}

$(document).ready(() => {
    localStorage.setItem('module','bolo');
    getLocaleString().then(() => {
        executeOnLoad();
    }).catch(() => {
        executeOnLoad();
    });
});


$(window).resize(() => {
    setFooterPosition();
});

module.exports = { getCurrentIndex, getSkipCount, getValue, setCurrentSentenceIndex, setTotalSentenceIndex }
