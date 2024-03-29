import React, { Fragment, useEffect, useRef, useState } from 'react';

import getBlobDuration from 'get-blob-duration';
import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ErrorPopup from 'components/ErrorPopup';
import FunctionalHeader from 'components/FunctionalHeader';
import ImageBasePath from 'components/ImageBasePath';
import Modal from 'components/Modal';
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
import type { ActionStoreAsrInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, getErrorMsg, visualize } from 'utils/utils';

import QuickTips from '../QuickTips';

import styles from './AsrSpeak.module.scss';

interface ResultType {
  data: any;
}

const AsrSpeak = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);
  const [lastSpeakerDetail, setLastSpeakerDetails] = useLocalStorage<SpeakerDetails | null>(
    localStorageConstants.lastSpeakerDetails
  );
  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showPlayButton] = useState(false);

  const [audioPermissionDenied, setAudioPermissionDenied] = useState(false);

  const [showAudioPermissionModal, setShowAudioPermissionModal] = useState(false);

  const [showStartRecording, setShowStartRecording] = useState(true);
  const [showStopRecording, setShowStopRecording] = useState(false);
  const [showReRecording, setShowReRecording] = useState(false);
  const [showWarningmsg, setShowWarningMsg] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
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

  const audioController = useRef<any>();
  const mediaRecorder = useRef<any>();
  const audioCtx = useRef<any>();

  let input: any;
  let chunks: any = [];

  const { submit, data: storeData, error: submitError } = useSubmit(apiPaths.store, false);
  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;
  const { submit: submitSkip, data: skipData, error: skipError } = useSubmit(apiPaths.skip);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState<ActionStoreAsrInterface>({
    speakerDetails: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.asr,
    sentenceId: 0,
    state: '',
    country: '',
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    audioDuration: 0,
    audio_data: null,
  });

  const { data: result, error } = useFetch<ResultType>({
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
    if (skipError || submitError || error) {
      setShowErrorModal(true);
    }
  }, [skipError, submitError, error]);

  /* istanbul ignore next */
  useEffect(() => {
    const reportRef = document.getElementById('report');
    const testSpeakerRef = document.getElementById('testSpeaker');
    const userOptionRef = document.getElementById('userOptions');
    const languageSwitcherRef = document.getElementById('languageSwitcher');
    const tipsButton = document.getElementById('tips');
    const feedbackRef = document.getElementById('feedback');
    function handleDocumentClick(event: Event) {
      if (!showReRecording) {
        if (
          (showStopRecording && reportRef?.contains(event.target as Node)) ||
          testSpeakerRef?.contains(event.target as Node) ||
          userOptionRef?.contains(event.target as Node) ||
          languageSwitcherRef?.contains(event.target as Node) ||
          feedbackRef?.contains(event.target as Node) ||
          tipsButton?.contains(event.target as Node)
        ) {
          resetState();
        }
      }
    }
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  });

  /* istanbul ignore next */
  useEffect(() => {
    if ((storeData || skipData) && !(skipError || submitError)) {
      if (currentDataIndex === contributionData.length) {
        router.push(`/${currentLocale}${routePaths.asrInitiativeContributeThankYou}`, undefined, {
          locale: currentLocale,
        });
      }
    }
  }, [
    storeData,
    skipData,
    currentDataIndex,
    contributionData.length,
    skipError,
    submitError,
    router,
    currentLocale,
  ]);

  useEffect(() => {
    if (result && result.data) {
      if (lastSpeakerDetail?.userName !== speakerDetails?.userName) {
        setShowQuickTips(true);
      }
      setLastSpeakerDetails(speakerDetails);
    }
  }, [result, lastSpeakerDetail, speakerDetails, setLastSpeakerDetails]);

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  useEffect(() => {
    if (speakerDetails) {
      setCurrentDataIndex(0);
    }
  }, [speakerDetails]);

  /* istanbul ignore next */
  const setDataCurrentIndex = (index: number) => {
    if (index !== contributionData.length) {
      setCurrentDataIndex(index + 1);
      setShowUIdata(contributionData[index + 1]);
    }
  };

  /* istanbul ignore next */
  const hideErrorModal = () => {
    setShowErrorModal(false);
    if (contributionData.length && currentDataIndex === contributionData.length) {
      router.push(`/${currentLocale}${routePaths.asrInitiativeContributeThankYou}`, undefined, {
        locale: currentLocale,
      });
    }
  };

  const resetState = () => {
    setRecordedAudio('');
    setRemainingSec(AUDIO.WARNING_COUNT_START);
    setShowWarningMsg(false);
    setDuration(0);
    clearTimeout(clearTimeoutKey);
    clearTimeout(timerTimeoutKey);
    setShowStartRecording(true);
    setShowStopRecording(false);
    setShowReRecording(false);
    setShowAudioController(false);
    audioController?.current?.classList.add('d-none');
  };

  /* istanbul ignore next */
  const setRemainingCount = (value: number) => {
    if (value) {
      const interval = setInterval(() => {
        setRemainingSec(value);
        value--;
        if (value < 0) {
          setRemainingSec(AUDIO.WARNING_COUNT_START);
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  /* istanbul ignore next */
  const startTimer = () => {
    setTimerTimeoutKey(
      setTimeout(() => {
        setShowWarningMsg(true);
        setRemainingCount(AUDIO.WARNING_COUNT_START - 1);
      }, (AUDIO.MAX_DURATION - 5) * 1000)
    );

    setClearTimeoutKey(
      setTimeout(() => {
        setShowWarningMsg(false);
        onStopRecording();
      }, AUDIO.MAX_DURATION * 1000)
    );
  };

  /* istanbul ignore next */
  const onRecordingStop = async () => {
    audioController?.current?.classList.remove('d-none');
    setShowAudioController(true);
    const blob = new Blob(chunks, { type: 'audio/wav' });
    chunks = [];
    setFormData({
      ...formData,
      audio_data: blob,
    });
    const audioURL = URL.createObjectURL(blob);
    setRecordedAudio(audioURL);
    audio.onloadedmetadata = async () => {
      // it should already be available here
      // handle chrome's bug
      if (audio.duration === Infinity) {
        // set it to bigger than the actual duration
        audio.currentTime = 1e101;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = () => {};
          // setting player currentTime back to 0 can be buggy too, set it first to .1 sec
          audio.currentTime = 0.1;
          audio.currentTime = 0;
        };
      }
      const duration = await getBlobDuration(blob);
      validateAudioDuration(duration);
    };
  };

  /* istanbul ignore next */
  const recordAudio = async () => {
    try {
      setAudioPermissionDenied(false);
      setShowAudioPermissionModal(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setGumStream(stream);
      const AudioContext = window.AudioContext;
      if (audioCtx && audioCtx.current) {
        audioCtx.current.close();
      }
      audioCtx.current = new AudioContext();
      const audioAnalyser = audioCtx.current.createAnalyser();
      //new audio context to help us record
      input = audioCtx.current.createMediaStreamSource(stream);
      input.connect(audioAnalyser);
      // eslint-disable-next-line no-undef
      const visualizer: any = document.getElementById('visualizer');
      visualize(visualizer, audioAnalyser);
      /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
      mediaRecorder.current = new MediaRecorder(stream);

      //start the recording process
      mediaRecorder.current.start();

      //automatically click stop button after 20 seconds
      mediaRecorder.current.ondataavailable = (e: any) => {
        chunks.push(e?.data);
      };

      mediaRecorder.current.onstop = () => {
        onRecordingStop();
      };
      startTimer();
    } catch (e) {
      setAudioPermissionDenied(true);
      setShowAudioPermissionModal(true);
      resetState();
    }
  };

  /* istanbul ignore next */
  const validateAudioDuration = (duration: number) => {
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
    mediaRecorder?.current?.stop();
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
    setShowStartRecording(false);
    stopAudio();
  };

  const onRerecord = () => {
    setRecordedAudio('');
    audioController?.current?.classList.add('d-none');
    setShowStopRecording(true);
    setShowAudioError(false);
    setShowReRecording(false);
    setShowAudioController(false);
    recordAudio();
  };

  /* istanbul ignore next */
  const onSubmitContribution = async () => {
    resetState();
    const fd = new FormData();
    fd.append('language', `${contributionLanguage}`);
    fd.append('sentenceId', showUIData.dataset_row_id);
    fd.append('country', `${locationInfo?.country}`);
    fd.append('state', `${locationInfo?.regionName}`);
    fd.append('audioDuration', `${duration}`);
    fd.append(
      'speakerDetails',
      JSON.stringify({
        userName: speakerDetails?.userName,
        age: speakerDetails?.age,
        motherTongue: speakerDetails?.motherTongue,
        gender: speakerDetails?.gender,
      })
    );
    fd.append('audio_data', formData.audio_data);
    fd.append('device', getDeviceInfo());
    fd.append('browser', getBrowserInfo());
    fd.append('type', INITIATIVES_MEDIA_MAPPING.asr);
    if (currentDataIndex === contributionData.length - 1) {
      await submit(fd);
    } else {
      submit(fd);
    }

    setDataCurrentIndex(currentDataIndex);
  };

  const onSkipContribution = async () => {
    resetState();
    if (currentDataIndex === contributionData.length - 1) {
      await submitSkip(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          language: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state_region: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.asr,
        })
      );
    } else {
      submitSkip(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          language: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state_region: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.asr,
        })
      );
    }
    setDataCurrentIndex(currentDataIndex);
  };

  if (!result && !error) {
    return <Spinner data-testid="Loader" animation="border" className="loader" />;
  }

  return (
    <Fragment>
      {contributionData && result?.data?.length !== 0 ? (
        <Fragment>
          <QuickTips showQuickTips={showQuickTips} setQuickTips={() => setShowQuickTips(false)} />
          <div className="pt-4 px-2 px-lg-0 pb-8">
            <FunctionalHeader
              onSuccess={onSkipContribution}
              type="contribute"
              initiative={INITIATIVES_MAPPING.asr}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.asr]['contribute']}
              showMic={true}
              showTipButton={true}
              toggleQuickTips={() => setShowQuickTips(!showQuickTips)}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="AsrSpeak" className={`${styles.root}`}>
                <div
                  className={`d-flex justify-content-center align-items-center my-9 mt-md-12 mb-md-10 text-center display-1`}
                >
                  {showUIData?.media_data}
                </div>
                <div className={`${styles.audioWrapper} d-flex flex-column justify-content-center`}>
                  <div
                    ref={audioController}
                    className="position-relative d-flex d-none flex-column align-items-center text-center pb-8"
                  >
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio
                      ref={audioEl}
                      data-testid="asrAudioElement"
                      controls
                      className="d-flex shadow-grey rounded-24"
                      tabIndex={-1}
                      src={recordedAudio}
                    ></audio>
                    {audioError && (
                      <div
                        className={`${styles.erroMsg} position-absolute d-flex text-danger justify-content-center align-items-center mt-md-2 text-center display-6`}
                      >
                        <span> {t('audioValidationMessage')} </span>
                      </div>
                    )}
                  </div>
                  {!showAudioController && !showStartRecording && (
                    <div className="d-flex align-items-center">
                      <div
                        className={`${styles.mic} d-flex justify-content-center align-items-center rounded-50 bg-danger`}
                      >
                        <ImageBasePath src="/images/mic_white.svg" width="40" height="40" alt="Mic Icon" />
                      </div>
                      <canvas id="visualizer" className={`${styles.visualizer} ms-5 flex-fill`} />
                    </div>
                  )}
                  {showStartRecording && <span className={`${styles.audioLine} d-flex w-100`} />}
                </div>
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
                    onSkip={onSkipContribution}
                    cancelButton={false}
                    startRecordingButton={showStartRecording}
                    stopRecordingButton={showStopRecording}
                    reRecordButton={showReRecording}
                    onStart={onStartRecording}
                    onStop={onStopRecording}
                    onRerecord={onRerecord}
                    skipDisable={currentDataIndex === contributionData.length}
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
                    {currentDataIndex + 1 > contributionData.length
                      ? contributionData.length
                      : currentDataIndex + 1}
                    /{contributionData.length}
                  </span>
                </div>
              </div>
            </Container>
          </div>
        </Fragment>
      ) : (
        <div className="d-flex flex-grow-1 align-items-center">
          <NoDataFound
            url={routePaths.asrInitiativeHome}
            title={t('asrContributeNoDataThankYouMessage')}
            text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
            buttonLabel={t('asrBackToInitiativePrompt')}
          />
        </div>
      )}
      {(skipError || error || submitError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(skipError || error || submitError)}
          onHide={() => hideErrorModal()}
        />
      )}
      {audioPermissionDenied && (
        <Modal
          className={`${styles.audioPermissionDeniedHeader}`}
          footer={<> </>}
          onHide={() => setShowAudioPermissionModal(false)}
          show={showAudioPermissionModal}
        >
          <div className="px-5 px-md-9 justify-content-center d-flex text-center mb-4">
            {t('warningAudioPermissionMsg')}
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default AsrSpeak;
