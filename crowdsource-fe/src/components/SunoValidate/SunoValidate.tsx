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
import FunctionalHeader from 'components/FunctionalHeader';
import NoDataFound from 'components/NoDataFound';
import TextEditArea from 'components/TextEditArea';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import { TEXT_INPUT_LENGTH } from 'constants/Keyboard';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useFetch, { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { ActionStoreInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo } from 'utils/utils';

import styles from './SunoValidate.module.scss';

interface ResultType {
  data: any;
}

const SunoValidate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [playAudio, setPlayAudio] = useState(false);
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
  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.localtionInfo);

  const { submit } = useSubmit(apiPaths.store);

  const { submit: reject } = useSubmit(`${apiPaths.validate}/${showUIData?.contribution_id}/reject`);

  const { submit: submitSkip } = useSubmit(apiPaths.skip);

  const { submit: accept } = useSubmit(`${apiPaths.validate}/${showUIData?.contribution_id}/accept`);

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

  const { data: result } = useFetch<ResultType>(
    contributionLanguage && speakerDetails
      ? `${apiPaths.contributionsAsr}?from=${contributionLanguage}&to=&username=${speakerDetails?.userName}`
      : null
  );

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  const onPlayAudio = () => {
    setShowReplayButton(false);
    setPlayAudio(true);
    setShowPauseButton(true);
    setShowPlayButton(false);
    setNeedsChangeDisable(false);
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
    setFormDataStore({
      ...formDataStore,
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
    onCancelContribution();
    setShowPauseButton(false);
    setShowPlayButton(true);
    setShowReplayButton(false);
    setNeedsChangeDisable(true);
    setCorrectDisable(true);
  };

  const onSubmitContribution = () => {
    setShowThankyouMessage(true);
    resetState();
    setShowEditTextArea(true);
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
    setTimeout(() => {
      setDataCurrentIndex(currentDataIndex);
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

  const onSkipContribution = () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    submitSkip(
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
  };

  const onAudioEnd = () => {
    setPlayAudio(false);
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

  const onCorrect = () => {
    setDataCurrentIndex(currentDataIndex);
    resetState();
    accept(
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
  };

  if (!result) {
    return <Spinner data-testid="StatsSpinner" animation="border" variant="light" />;
  }

  return contributionData && result?.data?.length !== 0 ? (
    <Fragment>
      <ChromeExtension />
      <div className="pt-4 px-2 px-lg-0 pb-8">
        <FunctionalHeader
          onSuccess={onSkipContribution}
          initiativeMediaType="sentence"
          initiative={INITIATIVES_MAPPING.suno}
          action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.suno]['validate']}
        />
        <Container fluid="lg" className="mt-5">
          <div data-testid="SunoValidate" className={`${styles.root}`}>
            <AudioController
              audioUrl={showUIData?.sentence}
              playAudio={playAudio}
              onEnded={onAudioEnd}
              onPlay={onPlayAudio}
              onPause={onPauseAudio}
              type="Validate"
            />
            {showEditTextArea ? (
              <div className="d-md-flex mt-9 mt-md-12">
                <div className="flex-fill">
                  <TextEditArea
                    id="originalText"
                    isTextareaDisabled={false}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.suno}
                    setTextValue={() => {}}
                    textValue={showUIData?.contribution}
                    roundedLeft
                    readOnly
                    label={t('originalText')}
                    onError={() => {}}
                  />
                </div>
                <div className="flex-fill">
                  <TextEditArea
                    id="editText"
                    isTextareaDisabled={false}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.suno}
                    setTextValue={onChangeTextInput}
                    textValue={showUIData?.contribution}
                    roundedRight
                    label={`${t('yourEdit')}${
                      contributionLanguage && ` (${t(contributionLanguage.toLowerCase())})`
                    }`}
                    onError={setHasError}
                    showTip
                  />
                </div>
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
                  <Image src="/images/check_mark.svg" width="40" height="40" alt="check" />
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
                {currentDataIndex + 1}/{contributionData.length}
              </span>
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  ) : (
    <NoDataFound
      url={routePaths.sunoIndiaHome}
      initiative={INITIATIVES_MAPPING.suno}
      language={contributionLanguage?.toLowerCase() ?? ''}
    />
  );
};

export default SunoValidate;
