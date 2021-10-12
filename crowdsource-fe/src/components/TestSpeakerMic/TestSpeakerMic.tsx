import React, { useState } from 'react';

import Image from 'next/image';

import Button from 'components/Button';
import IconTextButton from 'components/IconTextButton';

import styles from './TestSpeakerMic.module.scss';

const TestSpeakerMic = () => {
  const [showMic, showTestMic] = useState(false);

  return (
    <div className="position-relative">
      <IconTextButton
        icon="speaker.svg"
        textMobile="Test"
        textDesktop="Test your speakers"
        onClick={() => showTestMic(true)}
        altText="testYourSpeaker"
      />
      {showMic ? (
        <div className={`${styles.test} rounded-12 position-absolute bg-light p-5`}>
          <Button
            onClick={() => showTestMic(false)}
            variant="normal"
            className={`${styles.close} d-flex position-absolute`}
          >
            <Image src="/images/close.svg" width="20" height="20" alt="Close" />
          </Button>
          <div className={`${styles.heading} d-flex align-items-center mb-3 mt-3 mt-md-0`}>
            <Image src="/images/speaker.svg" width="24" height="24" alt="Speaker Icon" />
            <p className="ms-2">Test your microphone and speakers</p>
          </div>
          <div className="d-md-flex flex-column flex-md-row align-items-center py-3">
            <Button
              variant="normal"
              className={`${styles.testBtn} rounded-20 d-flex align-items-center justify-content-center border border-1 border-primary`}
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
          <div className="d-md-flex flex-column flex-md-row align-items-center py-3">
            <Button
              variant="normal"
              className={`${styles.testBtn} rounded-20 d-flex align-items-center justify-content-center border border-1 border-primary`}
            >
              <Image src="/images/speaker.svg" width="24" height="24" alt="Microphone Icon" />
              <span className="d-flex ms-2">Test Speakers</span>
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
                <div className="d-flex me-1">
                  <Image src="/images/warning.svg" width="16" height="16" alt="Warning Icon" />
                </div>
                Background noise detected
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TestSpeakerMic;
