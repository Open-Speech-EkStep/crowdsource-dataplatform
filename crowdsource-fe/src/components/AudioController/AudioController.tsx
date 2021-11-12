import { useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import nodeConfig from 'constants/nodeConfig';

import styles from './AudioController.module.scss';

interface AudoiControllerProps {
  audioUrl: string;
  playAudio: boolean;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
  type: string;
}

const AudioController = ({ audioUrl, playAudio, onEnded, onPlay, onPause, type }: AudoiControllerProps) => {
  const { t } = useTranslation();
  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;

  useEffect(() => {
    if (playAudio) audio?.play();
    else audio?.pause();
  }, [audio, playAudio]);

  useEffect(() => {
    audio?.addEventListener('ended', onEnded);
    return () => {
      audio?.removeEventListener('ended', onEnded);
    };
  });

  useEffect(() => {
    audio?.addEventListener('play', onPlay);
    audio?.addEventListener('pause', onPause);
    return () => {
      audio?.removeEventListener('pause', onPause);
      audio?.removeEventListener('play', onPlay);
    };
  });

  return (
    <div className="d-flex flex-column align-items-center text-center">
      <span className={`${styles.label} display-3`}>{t(`suno${type}Heading`)}</span>
      <div className="mt-2 mt-md-3">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          data-testid="audioElement"
          ref={audioEl}
          controls
          className="d-flex shadow-grey rounded-24"
          tabIndex={-1}
          src={`${nodeConfig.cdnUrl}/${audioUrl}`}
          controlsList="nodownload"
          crossOrigin="anonymous"
        ></audio>
      </div>
    </div>
  );
};

export default AudioController;
