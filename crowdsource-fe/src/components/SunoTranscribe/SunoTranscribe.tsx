import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import ProgressBar from 'react-bootstrap/ProgressBar';

import AudioController from 'components/AudioController';
import ButtonControls from 'components/ButtonControls';
import TextEditArea from 'components/TextEditArea';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { TEXT_INPUT_LENGTH } from 'constants/Keyboard';
import localStorageConstants from 'constants/localStorageConstants';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import useFetch from 'hooks/usePostFetch';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import type { SunoIndiaTranscibe, SunoIndiaTranscibeSkip } from 'types/Transcribe';
import { fetchLocationInfo } from 'utils/utils';

import styles from './SunoTranscribe.module.scss';

interface ResultType {
  data: any;
}

const SunoTranscribe = () => {
  const [playAudio, setPlayAudio] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    media_data: '',
    dataset_row_id: '0',
  });
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const { data, submit } = useSubmit(apiPaths.store);

  const result = useFetch<ResultType>({
    url: apiPaths.mediaAsr,
    init: {
      body: JSON.stringify({ language: 'English', userName: 'BadgeTest' }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  });

  const { submit: submitSkip } = useSubmit(apiPaths.skip);

  const [formData, setFormData] = useState<SunoIndiaTranscibe>({
    userInput: '',
    speakerDetails: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.suno,
    sentenceId: 0,
    state: '',
    country: '',
    device: '',
    browser: '',
  });

  const [skipFormData] = useState<SunoIndiaTranscibeSkip>({
    userName: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.suno,
    sentenceId: 0,
    state_region: '',
    country: '',
    device: '',
    browser: '',
  });

  useEffect(() => {
    const getLocationInfo = async () => {
      setLocationInfo(await fetchLocationInfo());
    };
    getLocationInfo();
  }, []);

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  const onPlayAudio = () => {
    setPlayAudio(true);
    setShowPauseButton(true);
    setShowPlayButton(false);
  };

  const onPauseAudio = () => {
    setShowPauseButton(false);
    setPlayAudio(false);
    setShowPlayButton(true);
  };

  const onReplayAudio = () => {
    setShowReplayButton(false);
    onPlayAudio();
  };

  const onChangeTextInput = (text: string) => {
    setFormData({
      ...formData,
      userInput: text,
    });
  };

  const setDataCurrentIndex = (index: number) => {
    if (index === contributionData.length - 1) {
      router.push(`/${currentLocale}/sunoIndia/thank-you.html`, undefined, { locale: currentLocale });
    }
    setCurrentDataIndex(index + 1);
    setShowUIdata(contributionData[index + 1]);
  };

  const resetState = () => {
    setShowPauseButton(false);
    setShowPlayButton(true);
    setShowReplayButton(false);
    onCancelContribution();
  };

  const onSubmitContribution = () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    submit(
      JSON.stringify({
        ...formData,
        language: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        country: locationInfo?.country,
        state: locationInfo?.regionName,
        speakerDetails: JSON.stringify({
          userName: speakerDetails?.userName,
        }),
      })
    );
  };

  const onCancelContribution = () => {
    setFormData({
      ...formData,
      userInput: '',
    });
  };

  const onSkipContribution = () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    submitSkip(
      JSON.stringify({
        ...skipFormData,
        userName: speakerDetails?.userName,
        language: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state_region: locationInfo?.regionName,
        country: locationInfo?.country,
      })
    );
  };

  const onAudioEnd = () => {
    setPlayAudio(false);
    setShowPlayButton(false);
    setShowPauseButton(false);
    setShowReplayButton(true);
  };

  const showThankyouMessage = data && data.success;

  return (
    <div data-testid="SunoTranscribe" className={`${styles.root} position-relative`}>
      <AudioController audioUrl={showUIData?.media_data} playAudio={playAudio} onEnded={onAudioEnd} />
      <div className="mt-4 mt-md-8">
        <TextEditArea
          language={contributionLanguage ?? ''}
          initiative={INITIATIVES_MAPPING.suno}
          setTextValue={onChangeTextInput}
          textValue={formData.userInput}
        />
      </div>
      {showThankyouMessage && <div> Thank you for contributing</div>}
      <ButtonControls
        onPlay={onPlayAudio}
        onPause={onPauseAudio}
        onReplay={onReplayAudio}
        playButton={showPlayButton}
        pauseButton={showPauseButton}
        replayButton={showReplayButton}
        cancelDisable={!formData.userInput}
        submitDisable={
          !showReplayButton || !formData.userInput || formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH
        }
        onSubmit={onSubmitContribution}
        onCancel={onCancelContribution}
        onSkip={onSkipContribution}
      />
      <div className="d-flex align-items-center mt-10 mt-md-14">
        <div className="flex-grow-1">
          <ProgressBar now={(currentDataIndex + 1) * 20} variant="primary" className={styles.progress} />
        </div>
        <span className="ms-5">
          {currentDataIndex + 1}/{contributionData.length}
        </span>
      </div>
    </div>
  );
};

export default SunoTranscribe;
