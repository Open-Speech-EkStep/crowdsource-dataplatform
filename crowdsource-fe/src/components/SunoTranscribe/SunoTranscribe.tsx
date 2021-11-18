import React, { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import AudioController from 'components/AudioController';
import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
import ErrorPopup from 'components/ErrorPopup';
import FunctionalHeader from 'components/FunctionalHeader';
import NoDataFound from 'components/NoDataFound';
import TextEditArea from 'components/TextEditArea';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import { TEXT_INPUT_LENGTH } from 'constants/Keyboard';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import useFetch from 'hooks/usePostFetch';
import type { ActionStoreInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, getErrorMsg } from 'utils/utils';

import styles from './SunoTranscribe.module.scss';

const SunoTranscribe = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [isDisabled, setIsDisabled] = useState(true);
  const [playAudio, setPlayAudio] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [showThankyouMessage, setShowThankyouMessage] = useState(false);

  const [closeKeyboard, setCloseKeyboard] = useState(false);

  const [showPlayButton, setShowPlayButton] = useState(true);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    media_data: '',
    dataset_row_id: '0',
  });

  const { submit, error: submitError } = useSubmit(apiPaths.store);

  const { submit: submitSkip, error: skipError } = useSubmit(apiPaths.skip);

  const [formData, setFormData] = useState<ActionStoreInterface>({
    userInput: '',
    speakerDetails: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.suno,
    sentenceId: 0,
    state: '',
    country: '',
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
  });

  const { data: result, error } = useFetch<any>({
    url: apiPaths.mediaAsr,
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
    if (error || submitError || skipError) {
      setShowErrorModal(true);
    }
  }, [error, skipError, submitError]);

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

  const onPlayAudio = () => {
    setShowReplayButton(false);
    setIsDisabled(false);
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
      router.push(`/${currentLocale}${routePaths.sunoIndiaContributeThankYou}`, undefined, {
        locale: currentLocale,
      });
    } else {
      setCurrentDataIndex(index + 1);
      setShowUIdata(contributionData[index + 1]);
    }
  };

  const resetState = () => {
    setIsDisabled(true);
    onCancelContribution();
    setShowPauseButton(false);
    setShowPlayButton(true);
    setShowReplayButton(false);
  };

  const onSubmitContribution = () => {
    setShowThankyouMessage(true);
    setCloseKeyboard(!closeKeyboard);
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
    setTimeout(() => {
      setShowThankyouMessage(false);
    }, 1500);
  };

  const onCancelContribution = () => {
    setFormData({
      ...formData,
      userInput: '',
    });
  };

  const onSkipContribution = () => {
    setPlayAudio(false);
    setDataCurrentIndex(currentDataIndex);
    setCloseKeyboard(!closeKeyboard);
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
        type: INITIATIVES_MEDIA_MAPPING.suno,
      })
    );
  };

  const onAudioEnd = () => {
    setPlayAudio(false);
    setShowPlayButton(false);
    setShowPauseButton(false);
    setShowReplayButton(true);
  };

  if (!result && !error) {
    return <Spinner data-testid="StatsSpinner" animation="border" variant="light" />;
  }

  return (
    <Fragment>
      {contributionData && result?.data?.length !== 0 ? (
        <Fragment>
          <ChromeExtension />
          <div className="pt-4 px-2 px-lg-0 pb-8">
            <FunctionalHeader
              onSuccess={onSkipContribution}
              type="contribute"
              initiative={INITIATIVES_MAPPING.suno}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.suno]['contribute']}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="SunoTranscribe" className={`${styles.root}`}>
                <AudioController
                  audioUrl={showUIData?.media_data}
                  playAudio={playAudio}
                  onEnded={onAudioEnd}
                  onPlay={onPlayAudio}
                  onPause={onPauseAudio}
                  type="Contribution"
                />
                <div className="mt-4 mt-md-8">
                  <TextEditArea
                    id="addText"
                    isTextareaDisabled={isDisabled}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.suno}
                    setTextValue={onChangeTextInput}
                    textValue={formData.userInput}
                    label={`${t('addText')}${
                      contributionLanguage && ` (${t(contributionLanguage.toLowerCase())})`
                    }`}
                    onError={setHasError}
                    closeKeyboard={closeKeyboard}
                  />
                </div>
                {showThankyouMessage ? (
                  <div className="d-flex align-items-center justify-content-center mt-9 display-1">
                    <span className="me-2 d-flex">
                      <Image src="/images/check_mark.svg" width="40" height="40" alt="check" />
                    </span>
                    {t('thankyouForContributing')}
                  </div>
                ) : (
                  <div className="mt-2 mt-md-6">
                    <ButtonControls
                      onPlay={onPlayAudio}
                      onPause={onPauseAudio}
                      onReplay={onReplayAudio}
                      playButton={showPlayButton}
                      pauseButton={showPauseButton}
                      replayButton={showReplayButton}
                      cancelDisable={!formData.userInput}
                      submitDisable={
                        !showReplayButton ||
                        !formData.userInput ||
                        formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH ||
                        hasError
                      }
                      onSubmit={onSubmitContribution}
                      onCancel={onCancelContribution}
                      onSkip={onSkipContribution}
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
            url={routePaths.sunoIndiaHome}
            title={t('asrContributeNoDataThankYouMessage')}
            text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
            buttonLabel={t('asrBackToInitiativePrompt')}
          />
        </div>
      )}
      {(error || skipError || submitError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(error || skipError || submitError)}
          onHide={() => setShowErrorModal(false)}
        />
      )}
    </Fragment>
  );
};

export default SunoTranscribe;
