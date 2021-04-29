const { LOCALE_STRINGS } = require("./constants");

const { getLocaleString } = require("./utils");
const executeOnReady = function () {
  let audioData = [];
  let recordingLength = 0;
  let context;
  let analyser;
  let mediaElementSrc;
  let speakerAnimationID = null;
  let speakerAudio;
  let speakerCanvas;
  let speakerCanvasCtx;

  const $testSpeakerBtn = $("#play-speaker");
  const $testMicDiv = $("#test-mic-speakers");
  const $testMicSpeakerBtn = $("#test-mic-speakers-button");
  const $testMicSpeakerDetails = $("#test-mic-speakers-details");
  const $testMicCloseBtn = $("#test-mic-close");
  const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));

  const resetSpeakerButton = () => {
    cancelAnimationFrame(speakerAnimationID);
    if (speakerCanvasCtx) {
      speakerCanvasCtx.clearRect(
        0,
        0,
        speakerCanvas.width,
        speakerCanvas.height
      );
    }
    $testSpeakerBtn.attr("data-value", "test-speaker");
    $("#test-speaker-text").text(localeStrings["Test Speakers"]);
    $("#speaker-svg").removeClass("d-none");
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
      speakerCanvasCtx.clearRect(
        0,
        0,
        speakerCanvas.width,
        speakerCanvas.height
      );
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

  $testMicSpeakerBtn.on("click", () => {
    $testMicDiv.addClass("d-none");
    $testMicSpeakerDetails.removeClass("d-none");
  });

  $testMicCloseBtn.on("click", () => {
    $testMicDiv.removeClass("d-none");
    $testMicSpeakerDetails.addClass("d-none");
    audioData = [];
    recordingLength = 0;
    if (speakerAudio) {
      speakerAudio.pause();
      speakerAudio.currentTime = 0;
    }
    resetSpeakerButton();
  });

  $testSpeakerBtn.on("click", () => {
    $testSpeakerBtn.attr("data-value", "playing");
    $("#test-speaker-text").text(localeStrings["Playing"]);
    $("#speaker-svg").addClass("d-none");
    playSpeaker();
  });
};

const writeUTFBytes = function (view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const addOnClickListener = function () {
  const $testMicDiv = $("#test-mic-speakers");
  const $testMicSpeakerBtn = $("#test-mic-speakers-button");
  const $testMicSpeakerDetails = $("#test-mic-speakers-details");

  $testMicSpeakerBtn.on("click", () => {
    $testMicDiv.addClass("d-none");
    $testMicSpeakerDetails.removeClass("d-none");
  });
};

$(document).ready(() => {
  getLocaleString()
    .then(() => {
      executeOnReady();
    })
    .catch(() => {
      executeOnReady();
    });
});

module.exports = { addOnClickListener, writeUTFBytes };

