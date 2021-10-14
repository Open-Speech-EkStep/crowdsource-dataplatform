import React, { useRef, useState } from 'react';

import Image from 'next/image';

import Button from 'components/Button';
import IconTextButton from 'components/IconTextButton';

import styles from './TestSpeakerMic.module.scss';

interface TestSpeakerProps {
  showSpeaker?: boolean;
  showMic?: boolean;
}

const TestSpeakerMic = ({ showSpeaker, showMic }: TestSpeakerProps) => {
  const [showMicSpeaker, setShowMicSpeaker] = useState(false);
  const audioEl: any = useRef<HTMLAudioElement>();

  let context: any;
  let analyser: any;

  const playSpeaker = () => {
    const speakerAudio: any = document.getElementById('test-speaker');
    speakerAudio?.play();
    if (!context) {
      const AudioContext = window.AudioContext;
      context = new AudioContext();
      const mediaElementSrc = context.createMediaElementSource(speakerAudio);
      analyser = context.createAnalyser();
      mediaElementSrc.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 256;
    }
    const speakerCanvas: any = document.getElementById('speaker-canvas');
    const speakerCanvasCtx = speakerCanvas?.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    let max_level_L = 50;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);
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
    renderFrame();
  };

  const playSpeakerSound = () => {
    playSpeaker();
  };

  return (
    <div className="position-relative">
      <IconTextButton
        icon="speaker.svg"
        textMobile="Test"
        textDesktop="Test your speakers"
        onClick={() => setShowMicSpeaker(true)}
        altText="testYourSpeaker"
      />
      {showMicSpeaker && (
        <div className={`${styles.test} rounded-12 position-absolute bg-light p-5`}>
          <Button
            onClick={() => setShowMicSpeaker(false)}
            variant="normal"
            className={`${styles.close} d-flex position-absolute`}
          >
            <Image src="/images/close.svg" width="20" height="20" alt="Close" />
          </Button>
          <div className={`${styles.heading} d-flex align-items-center mb-3 mt-3 mt-md-0`}>
            <Image src="/images/speaker.svg" width="24" height="24" alt="Speaker Icon" />
            {showMic && <p className="ms-2">Test your microphone and speakers</p>}
            {showSpeaker && <p className="ms-2">Test your speakers</p>}
          </div>
          {showMic && (
            <div className="d-md-flex flex-column flex-md-row align-items-center py-3">
              <Button
                variant="normal"
                className={`${styles.testBtn} d-flex align-items-center justify-content-center border rounded-16 border-1 border-primary`}
              >
                <Image src="/images/mic.svg" width="24" height="24" alt="Microphone Icon" />
                <span className="d-flex ms-2">Test Mic</span>
              </Button>
              <div className="position-relative flex-grow-1 ms-md-3 mt-2 mt-md-0">
                <div
                  className={`${styles.bar} rounded-16 d-flex align-items-center border border-1 border-primary-20 px-1`}
                >
                  <span className={`${styles.progress} rounded-16 bg-success w-50`}>&nbsp;</span>
                </div>
                <div
                  className={`${styles.text} d-flex align-items-center mt-1 mt-md-0 justify-content-center justify-content-md-start`}
                >
                  Please speak clearly
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
                className={`${styles.testBtn} ${styles.active} d-flex align-items-center justify-content-center border border-1 rounded-16 border-primary`}
              >
                <Image src="/images/speaker.svg" width="24" height="24" alt="Microphone Icon" />
                <span className="d-flex ms-2">Test Speakers</span>
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
