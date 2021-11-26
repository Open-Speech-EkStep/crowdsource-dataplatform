import React, { Fragment, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
import EditTextBlock from 'components/EditTextBlock';
import ErrorPopup from 'components/ErrorPopup';
import FunctionalHeader from 'components/FunctionalHeader';
import ImageBasePath from 'components/ImageBasePath';
import NoDataFound from 'components/NoDataFound';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import { TEXT_INPUT_LENGTH } from 'constants/Keyboard';
import localStorageConstants from 'constants/localStorageConstants';
import nodeConfig from 'constants/nodeConfig';
import routePaths from 'constants/routePaths';
import { useFetchWithInit, useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { ActionStoreInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, getErrorMsg } from 'utils/utils';

import styles from './SunoValidate.module.scss';

interface ResultType {
  data: any;
}

const SunoValidate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [showThankyouMessage, setShowThankyouMessage] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showNeedsChangeButton, setShowNeedsChangeButton] = useState(true);
  const [showCorrectButton, setShowCorrectButton] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [needsChangeDisable, setNeedsChangeDisable] = useState(true);
  const [correctDisable, setCorrectDisable] = useState(true);
  const [showEditTextArea, setShowEditTextArea] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    sentence: '',
    contribution: '',
    dataset_row_id: '0',
    contribution_id: '0',
    auto_validate: false,
  });
  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const { submit, data: storeData, error: submitError } = useSubmit(apiPaths.store);

  const rejectApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/reject`;
  const skipApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/skip`;
  const acceptApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/accept`;

  const { submit: reject, error: rejectError } = useSubmit(rejectApiUrl);
  const { submit: submitSkip, data: skipData, error: skipError } = useSubmit(skipApiUrl);
  const { submit: accept, data: acceptData, error: acceptError } = useSubmit(acceptApiUrl);

  const [formDataStore, setFormDataStore] = useState<ActionStoreInterface>({
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    country: locationInfo?.country ?? '',
    state: locationInfo?.regionName ?? '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.suno,
    sentenceId: 0,
    userInput: '',
    speakerDetails: '',
  });

  const audioEl: any = useRef<HTMLAudioElement>();
  const audio = audioEl.current;

  const { data: result, mutate } = useFetchWithInit<ResultType>(
    `${apiPaths.contributionsAsr}?from=${contributionLanguage}&to=&username=${speakerDetails?.userName}`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    if (skipError || acceptError || rejectError || submitError) {
      setShowErrorModal(true);
    }
  }, [skipError, acceptError, rejectError, submitError]);

  useEffect(() => {
    if (contributionLanguage && speakerDetails) {
      mutate();
    }
  }, [contributionLanguage, mutate, speakerDetails]);

  useEffect(() => {
    if ((storeData || skipData || acceptData) && !(skipError || submitError || acceptError)) {
      if (currentDataIndex === contributionData.length) {
        router.push(`/${currentLocale}${routePaths.sunoIndiaValidateThankYou}`, undefined, {
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
    acceptData,
    acceptError,
  ]);

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

  useEffect(() => {
    audio?.addEventListener('ended', onEnded);
    return () => {
      audio?.removeEventListener('ended', onEnded);
    };
  });

  useEffect(() => {
    audio?.addEventListener('play', onPlayAudio);
    audio?.addEventListener('pause', onPauseAudio);
    return () => {
      audio?.removeEventListener('pause', onPauseAudio);
      audio?.removeEventListener('play', onPlayAudio);
    };
  });

  const onPlayAudio = () => {
    setShowReplayButton(false);
    audio?.play();
    setShowPauseButton(true);
    setShowPlayButton(false);
    setNeedsChangeDisable(false);
  };

  const onPauseAudio = () => {
    setShowPauseButton(false);
    audio?.pause();
    setShowPlayButton(true);
  };

  const onReplayAudio = () => {
    setShowReplayButton(false);
    onPlayAudio();
  };

  const updateFormInput = (text: string) => {
    setFormDataStore({
      ...formDataStore,
      userInput: text,
    });
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
      router.push(`/${currentLocale}${routePaths.sunoIndiaValidateThankYou}`, undefined, {
        locale: currentLocale,
      });
    }
  };

  const resetState = () => {
    setShowUIdata({
      sentence: '',
      contribution: '',
      dataset_row_id: '0',
      contribution_id: '0',
      auto_validate: false,
    });
    onCancelContribution();
    setShowPauseButton(false);
    setShowPlayButton(true);
    setShowReplayButton(false);
    setNeedsChangeDisable(true);
    setCorrectDisable(true);
  };

  const onSubmitContribution = async () => {
    setShowThankyouMessage(true);
    resetState();
    setShowEditTextArea(true);
    if (currentDataIndex === contributionData.length - 1) {
      await submit(
        JSON.stringify({
          ...formDataStore,
          language: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          country: locationInfo?.country,
          state: locationInfo?.regionName,
          speakerDetails: JSON.stringify({
            userName: speakerDetails?.userName,
          }),
        })
      );
    } else {
      submit(
        JSON.stringify({
          ...formDataStore,
          language: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          country: locationInfo?.country,
          state: locationInfo?.regionName,
          speakerDetails: JSON.stringify({
            userName: speakerDetails?.userName,
          }),
        })
      );
    }
    reject(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        country: locationInfo?.country,
        state: locationInfo?.regionName,
        userName: speakerDetails?.userName,
        type: INITIATIVES_MEDIA.asr,
      })
    );
    setDataCurrentIndex(currentDataIndex);
    setTimeout(() => {
      setShowThankyouMessage(false);
      setShowEditTextArea(false);
    }, 1500);
  };

  const onCancelContribution = () => {
    setShowCancelButton(false);
    setShowSubmitButton(false);
    setShowNeedsChangeButton(true);
    setShowCorrectButton(true);
    setShowEditTextArea(false);
    setFormDataStore({
      ...formDataStore,
      userInput: '',
    });
  };

  const onSkipContribution = async () => {
    audio?.pause();
    resetState();
    await submitSkip(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        userName: speakerDetails?.userName,
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.suno,
      })
    );
    setDataCurrentIndex(currentDataIndex);
  };

  const onEnded = () => {
    audio?.pause();
    setShowPlayButton(false);
    setShowPauseButton(false);
    setShowReplayButton(true);
    setCorrectDisable(false);
  };

  const onNeedsChange = () => {
    setShowEditTextArea(true);
    setShowNeedsChangeButton(false);
    setShowCorrectButton(false);
    setShowCancelButton(true);
    setShowSubmitButton(true);
  };

  const onCorrect = async () => {
    resetState();
    await accept(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        userName: speakerDetails?.userName,
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.suno,
      })
    );
    setDataCurrentIndex(currentDataIndex);
  };

  if (!result) {
    return <Spinner data-testid="Loader" animation="border" className="loader" />;
  }

  return (
    <Fragment>
      {contributionData && result?.data?.length !== 0 ? (
        <Fragment>
          <ChromeExtension />
          <div className="pt-4 px-2 px-lg-0 pb-8">
            <FunctionalHeader
              onSuccess={onSkipContribution}
              type="validate"
              initiative={INITIATIVES_MAPPING.suno}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.suno]['validate']}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="SunoValidate" className={`${styles.root}`}>
                <div className="d-flex flex-column align-items-center text-center">
                  <span className="display-3">{t(`sunoValidationHeading`)}</span>
                  <div className="mt-2 mt-md-3">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio
                      data-testid="audioElement"
                      ref={audioEl}
                      controls
                      className="d-flex shadow-grey rounded-24"
                      tabIndex={-1}
                      src={`${nodeConfig.cdnUrl}/${showUIData?.sentence}`}
                      controlsList="nodownload"
                      crossOrigin="anonymous"
                    ></audio>
                  </div>
                </div>
                {showEditTextArea ? (
                  <div className="d-md-flex mt-9 mt-md-12">
                    <EditTextBlock
                      initiative={INITIATIVES_MEDIA_MAPPING.suno}
                      fromLanguage={contributionLanguage}
                      toLanguage={contributionLanguage}
                      text={showUIData?.contribution}
                      leftTextAreaLabel={t('originalText')}
                      rightTextAreaLabel={`${t('yourEdit')}${
                        contributionLanguage && ` (${t(contributionLanguage.toLowerCase())})`
                      }`}
                      setHasError={setHasError}
                      updateText={updateFormInput}
                      validate={showUIData?.auto_validate}
                    />
                  </div>
                ) : (
                  <div
                    className={`${styles.text} d-flex justify-content-center align-items-center mt-9 mt-md-12 text-center display-1`}
                  >
                    {showUIData?.contribution}
                  </div>
                )}
                {showThankyouMessage ? (
                  <div className="d-flex align-items-center justify-content-center mt-9 display-1">
                    <span className="me-2 d-flex">
                      <ImageBasePath src="/images/check_mark.svg" width="40" height="40" alt="check" />
                    </span>
                    {t('thankyouForCorrecting')}
                  </div>
                ) : (
                  <div className="mt-9 mt-md-12">
                    <ButtonControls
                      onPlay={onPlayAudio}
                      onPause={onPauseAudio}
                      onReplay={onReplayAudio}
                      playButton={showPlayButton}
                      pauseButton={showPauseButton}
                      replayButton={showReplayButton}
                      submitButton={showSubmitButton}
                      cancelButton={showCancelButton}
                      needsChangeButton={showNeedsChangeButton}
                      correctBtn={showCorrectButton}
                      cancelDisable={false}
                      submitDisable={
                        !showReplayButton ||
                        !formDataStore.userInput ||
                        formDataStore.userInput.length < TEXT_INPUT_LENGTH.LENGTH ||
                        hasError
                      }
                      needsChangeDisable={needsChangeDisable}
                      correctDisable={correctDisable}
                      onSubmit={onSubmitContribution}
                      onCancel={onCancelContribution}
                      onSkip={onSkipContribution}
                      onNeedsChange={onNeedsChange}
                      onCorrect={onCorrect}
                    />
                  </div>
                )}

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
            url={routePaths.sunoIndiaHome}
            title={t('asrValidateNoDataThankYouMessage')}
            text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
            buttonLabel={t('asrBackToInitiativePrompt')}
          />
        </div>
      )}
      {(skipError || rejectError || acceptError || submitError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(skipError || rejectError || acceptError || submitError)}
          onHide={() => hideErrorModal()}
        />
      )}
    </Fragment>
  );
};

export default SunoValidate;
