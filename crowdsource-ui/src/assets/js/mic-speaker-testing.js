const { LOCALE_STRINGS } = require('../js/constants');
const fetch = require('./fetch');

const { getLocaleString } = require('./utils');
const executeOnReady = function () {

  let audioData = [];
  let recordingLength = 0;
  let audioContext;
  let micAudio;
  let timeIntervalUp;
  let secondsDown = 5;
  let sampleRate = 44100;
  let context;
  let analyser;
  let mediaElementSrc;
  let speakerAnimationID = null;
  let speakerAudio;
  let speakerCanvas;
  let speakerCanvasCtx;

  const cnvs = document.getElementById("mic-canvas");
  const cnvs_cntxt = cnvs.getContext("2d");
  const $testMicBtn = $('#test-mic-button');
  const $testSpeakerBtn = $('#play-speaker');
  const $testMicDiv = $('#test-mic-speakers');
  const $testMicSpeakerBtn = $('#test-mic-speakers-button');
  const $testMicSpeakerDetails = $('#test-mic-speakers-details');
  const $testMicCloseBtn = $('#test-mic-close');
  const $noNoise = $('#no-noise');
  const $noise = $('#noise')
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));

  function generateWavBlob(finalBuffer, defaultSampleRate) {
    const buffer = new ArrayBuffer(44 + finalBuffer.length * 2);
    const view = new DataView(buffer);
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
    const volume = 1;
    for (let i = 0; i < finalBuffer.length; i++) {
      view.setInt16(index, finalBuffer[i] * (0x7FFF * volume), true);
      index += 2;
    }
    // our final blob
    return new Blob([view], {
      type: 'audio/wav'
    });
  }

  function flattenArray(channelBuffer, recordingLength) {
    const result = new Float32Array(recordingLength);
    let offset = 0;
    for (let i = 0; i < channelBuffer.length; i++) {
      const buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  const getMediaRecorder = () => {
    let microphone = null,
      javascriptNode = null;
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
            let sum_L = 0.0;
            for (let i = 0; i < inpt_L.length; ++i) {
              sum_L += inpt_L[i] * inpt_L[i];
            }
            let instant_L = Math.sqrt(sum_L / inpt_L.length);
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
      const finalBuffer = flattenArray(audioData, recordingLength);
      const audioBlob = generateWavBlob(finalBuffer, sampleRate);
      if (audioBlob !== null) {
        ambienceNoiseCheck(audioBlob);

        const audioUrl = URL.createObjectURL(audioBlob);
        micAudio = new Audio(audioUrl);
        micAudio.onloadedmetadata = function () {
          const audioDuration = Math.ceil(micAudio.duration * 1000);
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

  const resetMicButton = () => {
    const $testMicText = $('#test-mic-text');
    if (audioContext) {
      audioContext.close();
      audioContext = undefined;
    }
    $testMicText.text(localeStrings['Test Mic']);
    $('#mic-svg').removeClass('d-none');
    $testMicBtn.attr('data-value', 'test-mic');
    cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
    secondsDown = 5;
    clearInterval(timeIntervalUp);
  }

  const resetSpeakerButton = () => {
    cancelAnimationFrame(speakerAnimationID);
    if (speakerCanvasCtx) {
      speakerCanvasCtx.clearRect(0, 0, speakerCanvas.width, speakerCanvas.height);
    }
    $testSpeakerBtn.attr('data-value', 'test-speaker');
    $('#test-speaker-text').text(localeStrings['Test Speakers']);
    $('#speaker-svg').removeClass('d-none');
  }

  const startRecordingTimer = () => {
    $('#mic-msg').removeClass('invisible');
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

  const testMic = (btnDataAttr) => {
    $('#mic-msg').addClass('invisible').removeClass('d-none');
    $('#no-noise').addClass('d-none');
    $('#noise').addClass('d-none');
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
    const bufferLength = analyser.frequencyBinCount;
    let max_level_L = 50;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      speakerAnimationID = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);
      let sum_L = 0.0;
      for (let i = 0; i < dataArray.length; ++i) {
        sum_L += dataArray[i] * dataArray[i];
      }
      const instant_L = Math.sqrt(sum_L / dataArray.length);
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
    speakerAudio.onended = function () {
      resetSpeakerButton();
    };
  }

  $testMicSpeakerBtn.on('click', () => {
    $testMicDiv.addClass('d-none');
    $testMicSpeakerDetails.removeClass('d-none');
  });

  $testMicCloseBtn.on('click', () => {
    $testMicDiv.removeClass('d-none');
    $testMicSpeakerDetails.addClass('d-none');
    $('#mic-msg').addClass('invisible').removeClass('d-none');
    $noNoise.addClass('d-none');
    $noise.addClass('d-none');
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

  $testMicBtn.on('click', () => {
    const btnDataAttr = $('#test-mic-button').attr('data-value');
    // $noNoise.addClass('invisible').removeClass('d-none');
    // $noise.addClass('d-none');
    testMic(btnDataAttr);
  });

  $testSpeakerBtn.on('click', () => {
    $testSpeakerBtn.attr('data-value', 'playing');
    $('#test-speaker-text').text(localeStrings['Playing']);
    $('#speaker-svg').addClass('d-none');
    playSpeaker();
  });
}

const writeUTFBytes = function (view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

const addOnClickListener = function () {
  const $testMicDiv = $('#test-mic-speakers');
  const $testMicSpeakerBtn = $('#test-mic-speakers-button');
  const $testMicSpeakerDetails = $('#test-mic-speakers-details');

  $testMicSpeakerBtn.on('click', () => {
    $testMicDiv.addClass('d-none');
    $testMicSpeakerDetails.removeClass('d-none');
  });
}

const showAmbientNoise = (noiseData) => {
  const $noNoise = $('#no-noise');
  const $noise = $('#noise');
  $('#mic-msg').addClass('d-none');
  if (noiseData.ambient_noise) {
    $noise.removeClass('d-none');
  } else {
    $noNoise.removeClass('d-none');
  }
}

$(document).ready(() => {
  getLocaleString().then(() => {
    executeOnReady();
  }).catch(() => {
    executeOnReady();
  });
}

module.exports = { addOnClickListener, showAmbientNoise, writeUTFBytes }
