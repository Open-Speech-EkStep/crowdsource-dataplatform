import React, { Fragment, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ErrorPopup from 'components/ErrorPopup';
import FunctionalHeader from 'components/FunctionalHeader';
import ImageBasePath from 'components/ImageBasePath';
import NoDataFound from 'components/NoDataFound';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
  INITIATIVES_MEDIA,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import nodeConfig from 'constants/nodeConfig';
import routePaths from 'constants/routePaths';
import { useFetchWithInit, useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, getErrorMsg, visualize } from 'utils/utils';

import styles from './BoloValidate.module.scss';

interface ResultType {
  data: any;
}

const BoloValidate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [startAudioPlayer, setStartAudioPlayer] = useState(false);
  const [incorrectDisable, setIncorrectDisable] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [correctDisable, setCorrectDisable] = useState(true);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    sentence: '',
    contribution: '',
    dataset_row_id: '0',
    contribution_id: '0',
  });

  const context: any = useRef<AudioContext>();
  const mediaElementSrc: any = useRef();
  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;
  const waveVisualizer: any = useRef();

  const rejectApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/reject`;
  const skipApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/skip`;
  const acceptApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/accept`;

  const { submit: reject, error: rejectError } = useSubmit(rejectApiUrl);
  const { submit: submitSkip, data: skipData, error: skipError } = useSubmit(skipApiUrl);
  const { submit: accept, data: acceptData, error: acceptError } = useSubmit(acceptApiUrl);

  const { data: result, mutate } = useFetchWithInit<ResultType>(
    `${apiPaths.contributionsText}?from=${contributionLanguage}&to=&username=${speakerDetails?.userName}`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    if (skipError || acceptError || rejectError) {
      setShowErrorModal(true);
    }
  }, [skipError, acceptError, rejectError]);

  /* istanbul ignore next */
  useEffect(() => {
    if ((skipData || acceptData) && !(skipError || acceptError)) {
      if (currentDataIndex === contributionData.length) {
        router.push(`/${currentLocale}${routePaths.boloIndiaValidateThankYou}`, undefined, {
          locale: currentLocale,
        });
      }
    }
  }, [
    skipData,
    currentDataIndex,
    contributionData.length,
    skipError,
    router,
    currentLocale,
    acceptData,
    acceptError,
  ]);

  useEffect(() => {
    if (contributionLanguage && speakerDetails) {
      mutate();
    }
  }, [contributionLanguage, mutate, speakerDetails]);

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  useEffect(() => {
    audio?.addEventListener('ended', onAudioEnd);
    return () => {
      audio?.removeEventListener('ended', onAudioEnd);
    };
  });

  useEffect(() => {
    if (speakerDetails) {
      setCurrentDataIndex(0);
    }
  }, [speakerDetails]);

  const onAudioEnd = () => {
    setShowPlayButton(false);
    setShowPauseButton(false);
    setShowReplayButton(true);
    setCorrectDisable(false);
    setIncorrectDisable(false);
  };

  const setDataCurrentIndex = (index: number) => {
    if (index !== contributionData.length) {
      setCurrentDataIndex(index + 1);
      setShowUIdata(contributionData[index + 1]);
    }
  };

  const hideErrorModal = () => {
    setShowErrorModal(false);
    if (currentDataIndex === contributionData.length) {
      router.push(`/${currentLocale}${routePaths.dekhoIndiaValidateThankYou}`, undefined, {
        locale: currentLocale,
      });
    }
  };

  const startVisualizer = () => {
    const visualizer: any = document.getElementById('visualizer');
    if (!context.current) {
      context.current = new AudioContext();
      mediaElementSrc.current = mediaElementSrc.current || context.current.createMediaElementSource(audio);
      const analyser = context.current.createAnalyser();
      mediaElementSrc.current.connect(analyser);
      analyser.connect(context.current.destination);
      visualize(visualizer, analyser);
    }
  };

  const resetState = () => {
    waveVisualizer?.current?.classList.add('d-none');
    setShowPauseButton(false);
    setStartAudioPlayer(false);
    setShowPlayButton(true);
    setShowReplayButton(false);
    setCorrectDisable(true);
    setIncorrectDisable(true);
  };

  const onPlayAudio = () => {
    waveVisualizer?.current?.classList.remove('d-none');
    setStartAudioPlayer(true);
    setShowReplayButton(false);
    setShowPauseButton(true);
    setShowPlayButton(false);
    audio?.play();
    startVisualizer();
  };

  const onPauseAudio = () => {
    setShowPauseButton(false);
    setShowPlayButton(true);
    audio?.pause();
  };

  const onReplayAudio = () => {
    setShowReplayButton(false);
    onPlayAudio();
  };

  const onIncorrect = async () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    if (currentDataIndex === contributionData.length - 1) {
      await reject(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          country: locationInfo?.country,
          state: locationInfo?.regionName,
          userName: speakerDetails?.userName,
          type: INITIATIVES_MEDIA.text,
        })
      );
    } else {
      reject(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          country: locationInfo?.country,
          state: locationInfo?.regionName,
          userName: speakerDetails?.userName,
          type: INITIATIVES_MEDIA.text,
        })
      );
    }
  };

  const onSkipContribution = async () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    if (currentDataIndex === contributionData.length - 1) {
      await submitSkip(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          language: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.bolo,
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
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.bolo,
        })
      );
    }
  };

  const onCorrect = async () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    if (currentDataIndex === contributionData.length - 1) {
      await accept(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.bolo,
        })
      );
    } else {
      accept(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.bolo,
        })
      );
    }
  };

  if (!result) {
    return <Spinner data-testid="Loader" animation="border" className="loader" />;
  }

  return (
    <Fragment>
      {contributionData && result?.data?.length !== 0 ? (
        <Fragment>
          <div className="pt-4 px-2 px-lg-0 pb-8">
            <FunctionalHeader
              onSuccess={onSkipContribution}
              type="validate"
              initiative={INITIATIVES_MAPPING.bolo}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.bolo]['validate']}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="BoloValidate" className={`${styles.root}`}>
                <div
                  className={`d-flex justify-content-center align-items-center my-9 mt-md-12 mb-md-10 text-center display-1`}
                >
                  {showUIData?.sentence}
                </div>
                <div className={`${styles.audioWrapper} d-flex flex-column justify-content-center`}>
                  <div className="d-none d-flex flex-column align-items-center text-center">
                    <div className="mt-2 mt-md-3">
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <audio
                        ref={audioEl}
                        data-testid="boloValidateAudioElement"
                        controls
                        className="d-flex shadow-grey rounded-24"
                        tabIndex={-1}
                        src={`${nodeConfig.cdnUrl}/${showUIData?.contribution}`}
                        controlsList="nodownload"
                        crossOrigin="anonymous"
                      ></audio>
                    </div>
                  </div>
                  <div ref={waveVisualizer} className={`d-flex d-none align-items-center`}>
                    <div
                      className={`${styles.mic} d-flex justify-content-center align-items-center rounded-50 bg-danger`}
                    >
                      <ImageBasePath src="/images/mic_white.svg" width="40" height="40" alt="Mic Icon" />
                    </div>
                    <canvas id="visualizer" className={`${styles.visualizer} ms-5 flex-fill`} />
                  </div>
                  {!startAudioPlayer && <span className={`${styles.audioLine} d-flex w-100`} />}
                </div>
                <div className="mt-12 mt-md-14">
                  <ButtonControls
                    onPlay={onPlayAudio}
                    onPause={onPauseAudio}
                    onReplay={onReplayAudio}
                    playButton={showPlayButton}
                    pauseButton={showPauseButton}
                    replayButton={showReplayButton}
                    correctBtn={true}
                    submitButton={false}
                    correctDisable={correctDisable}
                    submitDisable={true}
                    onSkip={onSkipContribution}
                    cancelButton={false}
                    incorrectButton={true}
                    incorrectDisable={incorrectDisable}
                    onCorrect={onCorrect}
                    onIncorrect={onIncorrect}
                    skipDisable={currentDataIndex === 5}
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
            title={t('textValidateNoDataThankYouMessage')}
            text={t('noDataMessage', { language: t(`${contributionLanguage}`) })}
            buttonLabel={t('textBackToInitiativePrompt')}
          />
        </div>
      )}
      {(skipError || rejectError || acceptError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(skipError || rejectError || acceptError)}
          onHide={() => hideErrorModal()}
        />
      )}
    </Fragment>
  );
};

export default BoloValidate;
