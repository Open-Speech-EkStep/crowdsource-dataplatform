import { useEffect, useRef } from 'react';

import styles from './AudioController.module.scss';

interface AudoiControllerProps {
  audioUrl: string;
  doPlay: boolean;
  doPause: boolean;
  onEnded: () => void;
}

const AudioController = ({ audioUrl, doPlay, doPause, onEnded }: AudoiControllerProps) => {
  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;

  useEffect(() => {
    if (doPlay) audio?.play();
  }, [audio, doPlay]);

  useEffect(() => {
    if (doPause) audio?.pause();
  }, [audio, doPause]);

  useEffect(() => {
    audio?.addEventListener('ended', onEnded);
    return () => {
      audio?.removeEventListener('ended', onEnded);
    };
  });

  return (
    <div data-testid="AudioController" className="d-flex flex-column align-items-center text-center">
      <span className={`${styles.label} display-3`}>Type the text as you hear the audio</span>
      <div className={`mt-2 mt-md-3`}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          data-testid="audioElement"
          ref={audioEl}
          controls
          className={styles.audioPlayer}
          tabIndex={-1}
          src={audioUrl}
          controlsList="nodownload"
          crossOrigin="anonymous"
        ></audio>
      </div>
    </div>
  );
};

export default AudioController;
