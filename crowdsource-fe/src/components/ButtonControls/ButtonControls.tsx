import { useEffect, useState } from 'react';

import Image from 'next/image';

import Button from 'components/Button';

import styles from './ButtonControls.module.scss';

interface ButtonControlProps {
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  playButton: boolean;
  pauseButton: boolean;
  replayButton: boolean;
  cancelDisable?: boolean;
  submitDisable?: boolean;
}

const ButtonControls = ({
  onPlay,
  onPause,
  onReplay,
  onSubmit,
  onCancel,
  playButton = true,
  pauseButton = false,
  replayButton = false,
  cancelDisable = true,
  submitDisable = true,
}: ButtonControlProps) => {
  const [showPlay, setShowPlay] = useState(true);
  const [showPause, setShowPause] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    setShowPlay(playButton);
  }, [playButton]);

  useEffect(() => {
    setShowPause(pauseButton);
  }, [pauseButton]);

  useEffect(() => {
    setShowReplay(replayButton);
  }, [replayButton]);

  return (
    <div data-testid="ButtonControls">
      <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-center py-2 py-md-6">
        <Button
          onClick={onCancel}
          disabled={cancelDisable}
          variant="secondary"
          className="mx-md-6 order-2 order-md-1 my-2 my-md-0"
        >
          Cancel
        </Button>
        {showPlay && (
          <Button
            data-testid="playBtn"
            variant="normal"
            onClick={onPlay}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/play.svg" width="60" height="60" alt="Play Audio" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              Play
            </span>
          </Button>
        )}
        {showPause && (
          <Button
            data-testid="pauseBtn"
            variant="normal"
            onClick={onPause}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/pause.svg" width="60" height="60" alt="Pause Audio" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              Pause
            </span>
          </Button>
        )}
        {showReplay && (
          <Button
            data-testid="replayBtn"
            variant="normal"
            onClick={onReplay}
            className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
          >
            <Image src="/images/replay.svg" width="60" height="60" alt="Replay Audio" />
            <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>
              Replay
            </span>
          </Button>
        )}

        <Button
          onClick={onSubmit}
          disabled={submitDisable}
          className="mx-md-6 order-3 order-md-3 my-2 my-md-0"
        >
          Submit
        </Button>
      </div>
      <div className="d-flex justify-content-center mt-2 mt-md-11">
        <Button variant="tertiary">Skip</Button>
      </div>
    </div>
  );
};

export default ButtonControls;
