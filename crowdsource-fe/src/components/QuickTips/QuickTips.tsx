import React, { useEffect, useState } from 'react';

import { Trans, useTranslation } from 'next-i18next';

import ImageBasePath from 'components/ImageBasePath';

import Button from '../Button/Button';

import styles from './QuickTips.module.scss';

interface QuickTipsProps {
  showQuickTips: boolean;
}

const QuickTips = ({ showQuickTips }: QuickTipsProps) => {
  const { t } = useTranslation();

  const [quickTips, setShowQuickTips] = useState(false);

  useEffect(() => {
    setShowQuickTips(showQuickTips);
  }, [showQuickTips]);

  return quickTips ? (
    <div
      data-testid="QuickTips"
      className={`${styles.root} position-relative d-flex flex-column flex-xl-row px-5 py-2 text-light mx-3 mx-md-6 mt-3 mt-md-6`}
    >
      <Button
        onClick={() => setShowQuickTips(false)}
        variant="normal"
        className={`${styles.close} d-flex position-absolute bg-dark rounded-50 p-1 border border-1 border-primary-40`}
      >
        <ImageBasePath src="/images/close_white.svg" width="20" height="20" alt="Close" />
      </Button>
      <div
        className={`${styles.label} rounded-4 d-flex flex-xl-column justify-content-center align-items-center display-6 flex-shrink-0 my-3 py-3 py-xl-0`}
      >
        <ImageBasePath
          src="/images/bulb.svg"
          width="24"
          height="24"
          alt="Microphone Icon"
          className={`${styles.labelIcon} flex-shrink-0`}
        />
        <span className="mt-lg-2 ms-3 ms-xl-0">{t('quickTips')}</span>
      </div>
      <div className="d-flex display-6 flex-fill flex-wrap px-xl-9 justify-content-start">
        <div className={`${styles.tip} d-flex flex-shrink-0 flex-column align-items-center text-center my-3`}>
          <div className={`${styles.icon} d-flex justify-content-center align-items-center rounded-50`}>
            <ImageBasePath src="/images/microphone.svg" width="24" height="24" alt="Microphone Icon" />
          </div>
          <span className="mt-2">
            <Trans i18nKey="tipOne" defaults="tipOne" components={{ b: <b /> }} />
          </span>
        </div>
        <span className={`${styles.sep} flex-fill mt-9`} />
        <div className={`${styles.tip} d-flex flex-shrink-0 flex-column align-items-center text-center my-3`}>
          <div className={`${styles.icon} d-flex justify-content-center align-items-center rounded-50`}>
            <ImageBasePath src="/images/speaker_voice.svg" width="24" height="24" alt="Speaker Icon" />
          </div>
          <span className="mt-2">
            <Trans i18nKey="tipTwo" defaults="tipTwo" components={{ b: <b /> }} />
          </span>
        </div>
        <span className={`${styles.sep} flex-fill mt-9`} />
        <div className={`${styles.tip} d-flex flex-shrink-0 flex-column align-items-center text-center my-3`}>
          <div className={`${styles.icon} d-flex justify-content-center align-items-center rounded-50`}>
            <ImageBasePath src="/images/equalizer.svg" width="24" height="24" alt="Equalizer Icon" />
          </div>
          <span className="mt-2">
            <Trans i18nKey="tipThree" defaults="tipThree" components={{ b: <b /> }} />
          </span>
        </div>
        <span className={`${styles.sep} flex-fill mt-9`} />
        <div className={`${styles.tip} d-flex flex-shrink-0 flex-column align-items-center text-center my-3`}>
          <div className={`${styles.icon} d-flex justify-content-center align-items-center rounded-50`}>
            <ImageBasePath
              src="/images/record_voice_over.svg"
              width="24"
              height="24"
              alt="Record Voice Icon"
            />
          </div>
          <span className="mt-2">
            <Trans i18nKey="tipFour" defaults="tipFour" components={{ b: <b /> }} />
          </span>
        </div>
        <span className={`${styles.sep} flex-fill mt-9`} />
        <div className={`${styles.tip} d-flex flex-shrink-0 flex-column align-items-center text-center my-3`}>
          <div className={`${styles.icon} d-flex justify-content-center align-items-center rounded-50`}>
            <ImageBasePath src="/images/play_circle_filled.svg" width="24" height="24" alt="Play Icon" />
          </div>
          <span className="mt-2">
            <Trans i18nKey="tipFive" defaults="tipFive" components={{ b: <b /> }} />
          </span>
        </div>
      </div>
    </div>
  ) : null;
};

export default QuickTips;
