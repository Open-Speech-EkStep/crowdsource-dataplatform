import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import FunctionalHeader from 'components/FunctionalHeader';
import NoDataFound from 'components/NoDataFound';
import apiPaths from 'constants/apiPaths';
import { AUDIO } from 'constants/Audio';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import useFetch from 'hooks/usePostFetch';
import type { ActionStoreBoloInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, visualize } from 'utils/utils';

import styles from './BoloSpeak.module.scss';

interface ResultType {
  data: any;
}

const BoloSpeak = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showPlayButton] = useState(false);

  const [showStartRecording, setShowStartRecording] = useState(true);
  const [showStopRecording, setShowStopRecording] = useState(false);
  const [showReRecording, setShowReRecording] = useState(false);
  const [showWarningmsg, setShowWarningMsg] = useState(false);
  const [showAudioController, setShowAudioController] = useState(false);
  const [audioError, setShowAudioError] = useState(false);
  const [contributionData, setContributionData] = useState([]);
  const [duration, setDuration] = useState(0);

  const [remainingSec, setRemainingSec] = useState(AUDIO.WARNING_COUNT_START);

  const [recordedAudio, setRecordedAudio] = useState<string | undefined>();

  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    media_data: '',
    dataset_row_id: '0',
  });

  const [gumStream, setGumStream] = useState<MediaStream>();

  const [timerTimeoutKey, setTimerTimeoutKey] = useState<any>();

  const [clearTimeoutKey, setClearTimeoutKey] = useState<any>();

  let audioCtx: any;
  let input: any;
  let mediaRecorder: any;
  let chunks: any = [];

  const { submit } = useSubmit(apiPaths.store);
  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;
  const { submit: submitSkip } = useSubmit(apiPaths.skip);

  const [formData, setFormData] = useState<ActionStoreBoloInterface>({
    speakerDetails: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.bolo,
    sentenceId: 0,
    state: '',
    country: '',
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    audioDuration: 0,
    audio_data: null,
  });

  const result = useFetch<ResultType>({
    url: apiPaths.mediaText,
    init: contributionLanguage
      ? {
          body: JSON.stringify({
            language: contributionLanguage,
            userName: speakerDetails?.userName,
          }),
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
        }
      : undefined,
  });

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  useEffect(() => {
    audio?.addEventListener('loadedmetadata', () => {
      getAudioDuration(audio.duration);
    });
    return () => {
      audio?.removeEventListener('loadedmetadata', () => {
        getAudioDuration(audio.duration);
      });
    };
  });

  const setDataCurrentIndex = (index: number) => {
    if (index === contributionData.length - 1) {
      router.push(`/${currentLocale}${routePaths.boloIndiaContributeThankYou}`, undefined, {
        locale: currentLocale,
      });
    } else {
      setCurrentDataIndex(index + 1);
      setShowUIdata(contributionData[index + 1]);
    }
  };

  const resetState = () => {
    setShowStartRecording(true);
    setShowStopRecording(false);
    setShowReRecording(false);
    setShowAudioController(false);
  };

  const setRemainingCount = (value: number) => {
    if (value) {
      const interval = setInterval(() => {
        setRemainingSec(value);
        value--;
        if (value < 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  const startTimer = () => {
    setTimerTimeoutKey(
      setTimeout(() => {
        setShowWarningMsg(true);
        setRemainingCount(AUDIO.WARNING_COUNT_START - 1);
      }, (AUDIO.MAX_DURATION - 6) * 1000)
    );

    setClearTimeoutKey(
      setTimeout(() => {
        setShowWarningMsg(false);
        onStopRecording();
      }, AUDIO.MAX_DURATION * 1000)
    );
  };

  const recordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setGumStream(stream);
      const AudioContext = window.AudioContext;
      if (audioCtx) {
        audioCtx.close();
      }
      audioCtx = new AudioContext();
      const audioAnalyser = audioCtx.createAnalyser();
      //new audio context to help us record
      input = audioCtx.createMediaStreamSource(stream);
      input.connect(audioAnalyser);
      // eslint-disable-next-line no-undef
      const visualizer: any = document.getElementById('visualizer');
      visualize(visualizer, audioAnalyser);
      /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
      mediaRecorder = new MediaRecorder(stream);
      //start the recording process
      mediaRecorder.start();
      //automatically click stop button after 30 seconds
      mediaRecorder.ondataavailable = (e: any) => {
        chunks.push(e.data);
        const blob = new Blob(chunks, { type: 'audio/wav' });
        chunks = [];
        setFormData({
          ...formData,
          audio_data: blob,
        });
        const audioURL = URL.createObjectURL(blob);
        setRecordedAudio(audioURL);
      };
      startTimer();
    } catch (e) {
      console.log(e);
    }
  };

  const getAudioDuration = (duration: number) => {
    if (duration < AUDIO.MIN_DURATION) {
      setShowAudioError(true);
    } else {
      setShowAudioError(false);
    }
    setDuration(duration);
  };

  const stopAudio = () => {
    setShowWarningMsg(false);
    clearTimeout(clearTimeoutKey);
    clearTimeout(timerTimeoutKey);
    mediaRecorder?.stop();
    gumStream?.getAudioTracks()[0].stop();
  };

  const onStartRecording = () => {
    setShowStartRecording(false);
    setShowStopRecording(true);
    recordAudio();
  };

  const onStopRecording = () => {
    setShowReRecording(true);
    setShowStopRecording(false);
    setShowAudioController(true);
    stopAudio();
  };

  const onRerecord = () => {
    setRecordedAudio('');
    setShowStopRecording(true);
    setShowAudioError(false);
    setShowReRecording(false);
    setShowAudioController(false);
    recordAudio();
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
        audioDuration: duration,
        speakerDetails: JSON.stringify({
          userName: speakerDetails?.userName,
        }),
      })
    );
  };

  const onSkipContribution = () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    submitSkip(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        userName: speakerDetails?.userName,
        language: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state_region: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.bolo,
      })
    );
  };

  if (!result) {
    return <Spinner data-testid="StatsSpinner" animation="border" variant="light" />;
  }

  return contributionData && result?.data?.length !== 0 ? (
    <Fragment>
      <div className="pt-4 px-2 px-lg-0 pb-8">
        <FunctionalHeader
          onSuccess={onSkipContribution}
          type="contribute"
          initiative={INITIATIVES_MAPPING.bolo}
          action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.bolo]['contribute']}
          showMic={true}
        />
        <Container fluid="lg" className="mt-5">
          <div data-testid="BoloSpeak" className={`${styles.root}`}>
            <div
              className={`d-flex justify-content-center align-items-center my-9 mt-md-12 mb-md-10 text-center display-1`}
            >
              {showUIData?.media_data}
            </div>
            {showAudioController && (
              <div className="d-flex flex-column align-items-center text-center">
                <div className="mt-2 mt-md-3">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio
                    ref={audioEl}
                    data-testid="boloAudioElement"
                    controls
                    className="d-flex shadow-grey rounded-24"
                    tabIndex={-1}
                    src={recordedAudio}
                  ></audio>
                </div>
              </div>
            )}
            {audioError && (
              <div
                className={`d-flex text-danger justify-content-center align-items-center my-2 mt-md-2 mb-md-10 text-center display-6`}
              >
                <span> {t('audioValidationMessage')} </span>
              </div>
            )}
            {!showAudioController && (
              <div
                className={`d-flex justify-content-center align-items-center my-9 mt-md-12 mb-md-10 text-center display-1`}
              >
                <canvas id="visualizer"></canvas>
              </div>
            )}
            {showWarningmsg && (
              <div
                className={`d-flex justify-content-center align-items-center my-9 mt-md-9 mb-md-5 text-center display-5`}
              >
                <Trans
                  i18nKey="remainingAudioTextDurationWarning"
                  defaults="remainingAudioTextDurationWarning"
                  values={{
                    remainingSec: remainingSec,
                  }}
                />
              </div>
            )}
            <div className="mt-12 mt-md-14">
              <ButtonControls
                playButton={showPlayButton}
                submitDisable={!recordedAudio || duration < 2}
                onSubmit={onSubmitContribution}
                onCancel={() => {}}
                onSkip={onSkipContribution}
                cancelButton={false}
                startRecordingButton={showStartRecording}
                stopRecordingButton={showStopRecording}
                reRecordButton={showReRecording}
                onStart={onStartRecording}
                onStop={onStopRecording}
                onRerecord={onRerecord}
              />
            </div>

            <div className="d-flex align-items-center mt-10 mt-md-14">
              <div className="flex-grow-1">
                <ProgressBar
                  now={(currentDataIndex + 1) * (100 / contributionData.length)}
                  variant="primary"
                  className={styles.progress}
                />
              </div>
              <span className="ms-5">
                {currentDataIndex + 1}/{contributionData.length}
              </span>
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  ) : (
    <div className="d-flex flex-grow-1 align-items-center">
      <NoDataFound
        url={routePaths.boloIndiaHome}
        title={t('textContributeNoDataThankYouMessage')}
        text={t('noDataMessage', { language: t(`${contributionLanguage}`) })}
        buttonLabel={t('textBackToInitiativePrompt')}
      />
    </div>
  );
};

export default BoloSpeak;
