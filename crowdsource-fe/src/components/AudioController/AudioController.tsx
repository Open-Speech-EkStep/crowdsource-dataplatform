import { useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import styles from './AudioController.module.scss';

interface AudoiControllerProps {
  audioUrl: string;
  playAudio: boolean;
  onEnded: () => void;
}

const AudioController = ({ audioUrl, playAudio, onEnded }: AudoiControllerProps) => {
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

  return (
    <div className="d-flex flex-column align-items-center text-center">
      <span className={`${styles.label} display-3`}>{t('audioHeading')}</span>
      <div className="mt-2 mt-md-3">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          data-testid="audioElement"
          ref={audioEl}
          controls
          className="d-flex shadow-grey rounded-24"
          tabIndex={-1}
          src={`https://dev-data-crowdsource.azureedge.net/${audioUrl}`}
          controlsList="nodownload"
          crossOrigin="anonymous"
        ></audio>
      </div>
    </div>
  );
};

export default AudioController;
