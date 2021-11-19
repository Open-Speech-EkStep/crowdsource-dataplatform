import React, { useEffect, useRef, useState } from 'react';

import { useTranslation, Trans } from 'next-i18next';
import Image from 'next/image';

import Button from 'components/Button';
import IconTextButton from 'components/IconTextButton';

import apiPaths from '../../constants/apiPaths';

import styles from './TestSpeakerMic.module.scss';

interface TestSpeakerProps {
  showSpeaker?: boolean;
  showMic?: boolean;
}

const TestSpeakerMic = ({ showSpeaker, showMic }: TestSpeakerProps) => {
  const { t } = useTranslation();
  const [showMicSpeaker, setShowMicSpeaker] = useState(false);
  const [showTestMicText, setShowTestMicText] = useState(true);

  const [remainingSec, setRemainingSec] = useState(5);

  const [testMicSpeakerInterval, setTestMicSpeakerInterval] = useState<any>();

  const [speakerText, setSpeakerText] = useState('testSpeakers');
  const [showPlayingbackAudio, setShowPlayingbackAudio] = useState(false);
  const [noiseMessage, setNoiseMessage] = useState(false);

  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;
  const context: any = useRef<AudioContext>();
  const mediaElementSrc: any = useRef();
  const analyser: any = useRef();
  const media: any = useRef();
  const mediaAudio: any = useRef();
  const micAudio: any = useRef();

  let microphone: any = null;
  let javascriptNode: any = null;
  let audioData: any = [];
  let recordingLength = 0;
  let sampleRate = 44100;

  const playSpeaker = () => {
    const speakerAudio: any = document.getElementById('test-speaker');
    speakerAudio?.play();
    setSpeakerText('playing');
    if (!context.current) {
      const AudioContext = window.AudioContext;
      context.current = new AudioContext();
      mediaElementSrc.current = context.current.createMediaElementSource(speakerAudio);
      analyser.current = context.current.createAnalyser();
      mediaElementSrc.current.connect(analyser.current);
      analyser.current.connect(context.current.destination);
      analyser.current.fftSize = 256;
    }
    const speakerCanvas: any = document.getElementById('speaker-canvas');
    const speakerCanvasCtx = speakerCanvas?.getContext('2d');
    const bufferLength = analyser.current.frequencyBinCount;
    let max_level_L = 50;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      if (analyser.current) {
        requestAnimationFrame(renderFrame);
        analyser.current.getByteFrequencyData(dataArray);
        let sum_L = 0.0;
        for (let i = 0; i < dataArray.length; ++i) {
          sum_L += dataArray[i] * dataArray[i];
        }
        const instant_L = Math.sqrt(sum_L / dataArray.length);
        max_level_L = Math.max(max_level_L, instant_L);
        speakerCanvasCtx.clearRect(0, 0, speakerCanvas?.width, speakerCanvas?.height);
        speakerCanvasCtx.fillStyle = '#83E561';
        speakerCanvasCtx.fillRect(
          0,
          0,
          speakerCanvas?.width * (instant_L / max_level_L),
          speakerCanvas?.height
        );
      }
    }
    renderFrame();
  };

  const onEnded = () => {
    setSpeakerText('testSpeakers');
  };

  useEffect(() => {
    audio?.addEventListener('ended', onEnded);
    return () => {
      audio?.removeEventListener('ended', onEnded);
    };
  });

  const playSpeakerSound = () => {
    playSpeaker();
  };

  /* istanbul ignore next */
  const writeUTFBytes = function (view: any, offset: any, string: any) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  /* istanbul ignore next */
  const generateWavBlob = (finalBuffer: any, defaultSampleRate: any) => {
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
      view.setInt16(index, finalBuffer[i] * (0x7fff * volume), true);
      index += 2;
    }
    // our final blob
    return new Blob([view], {
      type: 'audio/wav',
    });
  };
  /* istanbul ignore next */
  const flattenArray = (channelBuffer: any, recordingLength: any) => {
    const result = new Float32Array(recordingLength);
    let offset = 0;
    for (let i = 0; i < channelBuffer.length; i++) {
      const buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };
  /* istanbul ignore next */
  const showAmbientNoise = (noiseData: any) => {
    setNoiseMessage(noiseData.ambient_noise);
  };
  /* istanbul ignore next */
  const ambienceNoiseCheck = async (audioBlob: any) => {
    const fd = new FormData();
    fd.append('audio_data', audioBlob);
    const init = {
      body: fd,
      method: 'POST',
    };
    const response = await fetch(apiPaths.audioSnr, init);
    // Extract json
    const rawData: any = await response.json();
    showAmbientNoise(rawData);
  };

  /* istanbul ignore next */
  const getMediaRecorder = () => {
    let max_level_L = 0;
    let old_level_L = 0;
    let audioContext: any;
    let cnvs_cntxt: any;
    let cnvs: any;
    let instant_L: any;
    const start = () => {
      let constraints = {
        audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // startRecordingTimer();
          const AudioContext = window.AudioContext;
          audioContext = new AudioContext();
          sampleRate = audioContext.sampleRate;
          microphone = audioContext.createMediaStreamSource(stream);
          javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
          microphone.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);
          cnvs = document.getElementById('audio-canvas');
          cnvs_cntxt = cnvs?.getContext('2d');
          javascriptNode.onaudioprocess = function (event: any) {
            let inpt_L = event.inputBuffer.getChannelData(0);
            recordingLength += 1024;
            audioData.push(new Float32Array(inpt_L));
            let sum_L = 0.0;
            for (let i = 0; i < inpt_L.length; ++i) {
              sum_L += inpt_L[i] * inpt_L[i];
            }
            instant_L = Math.sqrt(sum_L / inpt_L.length);
            max_level_L = Math.max(max_level_L, instant_L);
            instant_L = Math.max(instant_L, old_level_L - 0.008);
            old_level_L = instant_L;
            cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
            cnvs_cntxt.fillStyle = '#83E561';
            cnvs_cntxt.fillRect(0, 0, cnvs.width * (instant_L / max_level_L), cnvs.height);
          };
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    const stop = () => {
      if (microphone !== null) microphone.disconnect();
      if (javascriptNode !== null) javascriptNode.disconnect();
      const finalBuffer = flattenArray(audioData, recordingLength);
      const audioBlob = generateWavBlob(finalBuffer, sampleRate);
      if (audioBlob !== null) {
        ambienceNoiseCheck(audioBlob);

        const audioUrl = URL.createObjectURL(audioBlob);
        micAudio.current = new Audio(audioUrl);
        micAudio.current.onloadedmetadata = function () {
          const audioDuration = Math.ceil(micAudio.current?.duration * 1000);
          setTimeout(() => {
            setShowTestMicText(true);
            setShowPlayingbackAudio(false);
            if (audioContext) {
              audioContext.close();
              audioContext = undefined;
            }
            cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
          }, audioDuration);
        };
        const play = () => {
          micAudio.current?.play();
        };
        return {
          audioBlob,
          audioUrl,
          play,
        };
      } else {
        console.log('No blob present');
        return null;
      }
    };
    return {
      start,
      stop,
    };
  };

  /* istanbul ignore next */
  const setRecordingCount = (value: number) => {
    if (value) {
      const interval = setInterval(() => {
        setRemainingSec(value);
        value--;
        if (value < 0) {
          setRemainingSec(5);
          clearInterval(interval);
          mediaAudio.current = media.current?.stop();
          mediaAudio.current?.play();
        }
      }, 1000);
    }
  };

  /* istanbul ignore next */
  const onAudioTest = () => {
    audioData = [];
    recordingLength = 0;
    media.current = getMediaRecorder();
    media.current.start();
    setShowTestMicText(false);
    setRecordingCount(4);
    setTestMicSpeakerInterval(
      setTimeout(() => {
        setShowPlayingbackAudio(true);
      }, 5000)
    );
  };

  return (
    <div className="position-relative">
      <IconTextButton
        icon="speaker.svg"
        textMobile={t('test')}
        textDesktop={t('testYourSpeaker')}
        onClick={() => setShowMicSpeaker(!showMicSpeaker)}
        altText="testYourSpeaker"
        active={showMicSpeaker}
      />
      {showMicSpeaker && (
        <div className={`${styles.test} rounded-12 position-absolute bg-light p-5`}>
          <Button
            onClick={() => {
              clearTimeout(testMicSpeakerInterval);
              setSpeakerText('testSpeakers');
              setShowMicSpeaker(false);
              setShowTestMicText(true);
              setShowPlayingbackAudio(false);
              context.current = null;
              mediaElementSrc.current = null;
              analyser.current = null;
              media.current = null;
              mediaAudio.current = null;
              micAudio.current = null;
            }}
            variant="normal"
            className={`${styles.close} d-flex position-absolute`}
          >
            <Image src="/images/close.svg" width="20" height="20" alt="Close" />
          </Button>
          <div className={`${styles.heading} d-flex align-items-center mb-3 mt-3 mt-md-0`}>
            <Image src="/images/speaker.svg" width="24" height="24" alt="Speaker Icon" />
            {showMic && <p className="ms-2">{t('testYourMicrophoneAndSpeakers')}</p>}
            {showSpeaker && !showMic && <p className="ms-2">{t('testYourSpeaker')}</p>}
          </div>
          {showMic && (
            <div className="d-md-flex flex-column flex-md-row align-items-center py-3">
              {showTestMicText && (
                <Button
                  variant="normal"
                  onClick={onAudioTest}
                  className={`${styles.testBtn} d-flex align-items-center justify-content-center border rounded-16 border-1 border-primary`}
                >
                  <Image src="/images/mic.svg" width="24" height="24" alt="Microphone Icon" />
                  <span className="d-flex ms-2">{t('testMic')}</span>
                </Button>
              )}
              {!showTestMicText && !showPlayingbackAudio && (
                <Button
                  variant="normal"
                  className={`${styles.testBtn} d-flex align-items-center justify-content-center border rounded-16 border-1 border-primary`}
                >
                  <Image src="/images/mic.svg" width="24" height="24" alt="Microphone Icon" />
                  <span className="d-flex ms-2">
                    <Trans
                      i18nKey="recordingCountValidationMsg"
                      defaults="recordingCountValidationMsg"
                      values={{
                        remainingSec: remainingSec,
                      }}
                    />
                  </span>
                </Button>
              )}
              {!showTestMicText && showPlayingbackAudio && (
                <Button
                  variant="normal"
                  className={`${styles.testBtn} d-flex align-items-center justify-content-center border rounded-16 border-1 border-primary`}
                >
                  <Image src="/images/mic.svg" width="24" height="24" alt="Microphone Icon" />
                  <span className="d-flex ms-2">{t('playingBackAudio')}</span>
                </Button>
              )}
              <div className="position-relative flex-grow-1 ms-md-3 mt-2 mt-md-0">
                <div
                  className={`${styles.bar} rounded-16 d-flex align-items-center border border-1 border-primary-20 px-1`}
                >
                  <canvas
                    id="audio-canvas"
                    data-testid="audioCanvas"
                    className={`${styles.progress} rounded-16 w-100`}
                  ></canvas>
                </div>
                <div
                  className={`${styles.text} d-flex align-items-center mt-1 mt-md-0 justify-content-center justify-content-md-start`}
                >
                  {showPlayingbackAudio && (
                    <span>
                      {noiseMessage && showPlayingbackAudio ? t('backgroundNoise') : t('lowBackgroundNoise')}
                    </span>
                  )}
                  <span>{!showTestMicText && !showPlayingbackAudio && t('speakClearly')}</span>
                </div>
              </div>
            </div>
          )}
          {showSpeaker && (
            <div className="d-md-flex flex-column flex-md-row align-items-center py-3">
              <Button
                onClick={playSpeakerSound}
                variant="normal"
                data-testid="speakerbtn"
                className={`${styles.testBtn} ${
                  speakerText === 'playing' ? `${styles.active}` : ``
                } d-flex align-items-center justify-content-center border border-1 rounded-16 border-primary`}
              >
                {speakerText !== 'playing' && (
                  <Image src="/images/speaker.svg" width="24" height="24" alt="Microphone Icon" />
                )}

                <span id="speakerText" className="d-flex ms-2">
                  {t(speakerText)}
                </span>
              </Button>
              <div className="mt-2 mt-md-3 d-none">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                  id="test-speaker"
                  data-testid="speakerAudio"
                  ref={audioEl}
                  src="/audio/sample_audio_file.mp3"
                ></audio>
              </div>
              <div className="position-relative flex-grow-1 ms-md-3 mt-2 mt-md-0">
                <div
                  className={`${styles.bar} rounded-16 d-flex align-items-center border border-1 border-primary-20 px-1`}
                >
                  <canvas
                    className={`${styles.progress} rounded-16 w-100`}
                    id="speaker-canvas"
                    data-testid="speakerCanvas"
                  ></canvas>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestSpeakerMic;
