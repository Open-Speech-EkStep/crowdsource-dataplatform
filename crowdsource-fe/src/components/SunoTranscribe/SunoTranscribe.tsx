import { useState } from 'react';

import ProgressBar from 'react-bootstrap/ProgressBar';

import AudioController from 'components/AudioController';
import ButtonControls from 'components/ButtonControls';
import TextEditArea from 'components/TextEditArea';
import type { SunoIndiaTranscibe } from 'types/Transcribe';

import styles from './SunoTranscribe.module.scss';

const SunoTranscribe = () => {
  const [playAudio, setPlayAudio] = useState(false);
  const [pauseVideo, setPauseAudio] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const [formData, setFormData] = useState<SunoIndiaTranscibe>({
    userInput: '',
  });

  const onPlayAudio = () => {
    setPlayAudio(true);
    setShowPauseButton(true);
    setPauseAudio(false);
    setShowPlayButton(false);
  };

  const onPauseAudio = () => {
    setShowPauseButton(false);
    setPlayAudio(false);
    setPauseAudio(true);
    setShowPlayButton(true);
  };

  const onReplayAudio = () => {
    setShowReplayButton(false);
    setShowPauseButton(true);
    setPlayAudio(true);
    setPauseAudio(false);
    setShowPlayButton(false);
  };

  const onChangeTextInput = (text: string) => {
    setFormData({
      userInput: text,
    });
  };

  const onSubmitContribution = () => {};

  const onCancelContribution = () => {
    setFormData({
      userInput: '',
    });
  };

  const onAudioEnd = () => {
    setPlayAudio(false);
    setShowPlayButton(false);
    setShowPauseButton(false);
    setShowReplayButton(true);
  };

  return (
    <div data-testid="SunoTranscribe" className={`${styles.root} position-relative`}>
      <AudioController
        audioUrl="https://uat-data-crowdsource.azureedge.net/inbound%2Fasr%2FEnglish%2Fnewsonair.nic.in_09-08-2021_03-37%2F2_3_Regional-Kohima-English-0725-201951674824.wav"
        doPlay={playAudio}
        doPause={pauseVideo}
        onEnded={onAudioEnd}
      />
      <div className="mt-4 mt-md-8">
        <TextEditArea
          language="Hindi"
          initiative="suno"
          setTextValue={onChangeTextInput}
          textValue={formData.userInput}
        />
      </div>
      <ButtonControls
        onPlay={onPlayAudio}
        onPause={onPauseAudio}
        onReplay={onReplayAudio}
        playButton={showPlayButton}
        pauseButton={showPauseButton}
        replayButton={showReplayButton}
        cancelDisable={!formData.userInput}
        submitDisable={!showReplayButton || !formData.userInput}
        onSubmit={onSubmitContribution}
        onCancel={onCancelContribution}
      />
      <div className="d-flex align-items-center mt-10 mt-md-14">
        <div className="flex-grow-1">
          <ProgressBar now={60} variant="primary" className={styles.progress} />
        </div>
        <span className="ms-5">1/5</span>
      </div>
    </div>
  );
};

export default SunoTranscribe;
