import { Fragment } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Button from 'components/Button';

import styles from './ButtonControls.module.scss';

interface ButtonControlProps {
  onPlay?: () => void;
  onPause?: () => void;
  onReplay?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onSkip: () => void;
  onNeedsChange?: () => void;
  onCorrect?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onRerecord?: () => void;
  onIncorrect?: () => void;
  playButton?: boolean;
  pauseButton?: boolean;
  replayButton?: boolean;
  cancelDisable?: boolean;
  submitDisable?: boolean;
  cancelButton?: boolean;
  submitButton?: boolean;
  needsChangeButton?: boolean;
  needsChangeDisable?: boolean;
  correctBtn?: boolean;
  correctDisable?: boolean;
  startRecordingButton?: boolean;
  stopRecordingButton?: boolean;
  reRecordButton?: boolean;
  incorrectButton?: boolean;
  incorrectDisable?: boolean;
}

const ButtonControls = ({
  onPlay,
  onPause,
  onReplay,
  onSubmit,
  onCancel,
  onSkip,
  onNeedsChange,
  onCorrect,
  onStart,
  onStop,
  onRerecord,
  onIncorrect,
  playButton = true,
  pauseButton = false,
  replayButton = false,
  cancelButton = true,
  submitButton = true,
  cancelDisable = true,
  submitDisable = true,
  needsChangeButton = false,
  needsChangeDisable = true,
  correctBtn = false,
  correctDisable = true,
  startRecordingButton = false,
  stopRecordingButton = false,
  reRecordButton = false,
  incorrectButton = false,
  incorrectDisable = true,
}: ButtonControlProps) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-center">
        {cancelButton && (
          <Button
            onClick={onCancel}
            disabled={cancelDisable}
            variant="secondary"
            className="mx-md-6 order-2 order-md-1 my-2 my-md-0"
          >
            {t('cancel')}
          </Button>
        )}
        {incorrectButton && (
          <Button
            onClick={onIncorrect}
            disabled={incorrectDisable}
            variant="secondary"
            className={`${styles.needsChangeBtn} mx-md-6 order-2 order-md-1 my-2 my-md-0`}
          >
            <span className={classNames(`d-flex me-2`, { [styles.correctDisabled]: correctDisable })}>
              <Image src="/images/correct.svg" width="24" height="24" alt="InCorrect Icon" />
            </span>
            {t('incorrect')}
          </Button>
        )}
        {startRecordingButton && (
          <Button onClick={onStart} variant="secondary" className="mx-md-6 order-2 order-md-1 my-2 my-md-0">
            {t('startRecording')}
          </Button>
        )}
        {stopRecordingButton && (
          <Button onClick={onStop} variant="secondary" className="mx-md-6 order-2 order-md-1 my-2 my-md-0">
            {t('stopRecording')}
          </Button>
        )}
        {reRecordButton && (
          <Button
            onClick={onRerecord}
            variant="secondary"
            className="mx-md-6 order-2 order-md-1 my-2 my-md-0"
          >
            {t('reRecord')}
          </Button>
        )}
        {needsChangeButton && (
          <Button
            onClick={onNeedsChange}
            disabled={needsChangeDisable}
            variant="secondary"
            className={`${styles.needsChangeBtn} mx-md-6 order-2 order-md-1 my-2 my-md-0`}
          >
            <span className={classNames(`d-flex me-2`, { [styles.needsChangeDisabled]: needsChangeDisable })}>
              <Image src="/images/edit.svg" width="24" height="24" alt="Edit Icon" />
            </span>
            {t('needsChange')}
          </Button>
        )}
        {playButton && (
          <Button
            variant="normal"
            onClick={onPlay}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/play.svg" width="60" height="60" alt="Play Icon" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              {t('play')}
            </span>
          </Button>
        )}
        {pauseButton && (
          <Button
            variant="normal"
            onClick={onPause}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/pause.svg" width="60" height="60" alt="Pause Icon" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              {t('pause')}
            </span>
          </Button>
        )}
        {replayButton && (
          <Button
            variant="normal"
            onClick={onReplay}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/replay.svg" width="60" height="60" alt="Replay Icon" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              {t('replay')}
            </span>
          </Button>
        )}
        {correctBtn && (
          <Button
            variant="secondary"
            onClick={onCorrect}
            disabled={correctDisable}
            className={`${styles.correctBtn} mx-md-6 order-3 order-md-3 my-2 my-md-0`}
          >
            <span className={classNames(`d-flex me-2`, { [styles.correctDisabled]: correctDisable })}>
              <Image src="/images/correct.svg" width="24" height="24" alt="Correct Icon" />
            </span>
            {t('correct')}
          </Button>
        )}
        {submitButton && (
          <Button
            onClick={onSubmit}
            disabled={submitDisable}
            className="mx-md-6 order-3 order-md-3 my-2 my-md-0"
          >
            {t('submit')}
          </Button>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4 mt-md-13">
        <Button onClick={onSkip} variant="tertiary">
          {t('skip')}
        </Button>
      </div>
    </Fragment>
  );
};

export default ButtonControls;
