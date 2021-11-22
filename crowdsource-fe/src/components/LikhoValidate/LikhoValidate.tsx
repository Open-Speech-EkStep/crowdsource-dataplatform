import React, { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
import ErrorPopup from 'components/ErrorPopup';
import FunctionalHeader from 'components/FunctionalHeader';
import LikhoValidateTextArea from 'components/LikhoValidateTextArea';
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
import { useFetchWithInit, useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { ActionStoreInterface } from 'types/ActionRequestData';
import type { LocationInfo } from 'types/LocationInfo';
import type SpeakerDetails from 'types/SpeakerDetails';
import { getBrowserInfo, getDeviceInfo, getErrorMsg } from 'utils/utils';

import styles from './LikhoValidate.module.scss';

interface ResultType {
  data: any;
}

const LikhoValidate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [showThankyouMessage, setShowThankyouMessage] = useState(false);
  const [showNeedsChangeButton, setShowNeedsChangeButton] = useState(true);
  const [showCorrectButton, setShowCorrectButton] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
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
    auto_validate: false,
  });
  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const { submit, error: submitError } = useSubmit(apiPaths.store);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const rejectApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/reject`;
  const skipApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/skip`;
  const acceptApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/accept`;

  const { submit: reject, error: rejectError } = useSubmit(rejectApiUrl);
  const { submit: submitSkip, error: skipError } = useSubmit(skipApiUrl);
  const { submit: accept, error: acceptError } = useSubmit(acceptApiUrl);

  const [formDataStore, setFormDataStore] = useState<ActionStoreInterface>({
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    country: locationInfo?.country ?? '',
    state: locationInfo?.regionName ?? '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.likho,
    sentenceId: 0,
    userInput: '',
    speakerDetails: '',
  });

  const { data: result, mutate } = useFetchWithInit<ResultType>(
    `${apiPaths.contributionsParallel}?from=${contributionLanguage}&to=${translatedLanguage}&username=${speakerDetails?.userName}`,
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
    if (speakerDetails) {
      setCurrentDataIndex(0);
    }
  }, [speakerDetails]);

  useEffect(() => {
    if (result && result.data) {
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  const updateFormInput = (text: string) => {
    setFormDataStore({
      ...formDataStore,
      userInput: text,
    });
  };

  const setDataCurrentIndex = (index: number) => {
    if (index === contributionData.length - 1) {
      router.push(`/${currentLocale}${routePaths.likhoIndiaValidateThankYou}`, undefined, {
        locale: currentLocale,
      });
    } else {
      setCurrentDataIndex(index + 1);
      setShowUIdata(contributionData[index + 1]);
    }
  };

  const resetState = () => {
    onCancelContribution();
  };

  const onSubmitContribution = () => {
    setShowThankyouMessage(true);
    resetState();
    setShowEditTextArea(true);
    submit(
      JSON.stringify({
        ...formDataStore,
        fromLanguage: contributionLanguage,
        language: translatedLanguage,
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
        language: translatedLanguage,
        state: locationInfo?.regionName,
        userName: speakerDetails?.userName,
        type: INITIATIVES_MEDIA.parallel,
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
        language: translatedLanguage,
        sentenceId: showUIData.dataset_row_id,
        state: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.likho,
      })
    );
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
        language: translatedLanguage,
        sentenceId: showUIData.dataset_row_id,
        state: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.likho,
      })
    );
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
              initiative={INITIATIVES_MAPPING.likho}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.likho]['validate']}
              showSpeaker={false}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="LikhoValidate" className={`${styles.root}`}>
                <div className="align-items-center text-center">
                  <span className="display-3">{t(`${INITIATIVES_MAPPING.likho}ValidationHeading`)}</span>
                </div>
                <div className="d-md-flex mt-2 mt-md-4">
                  <div className="flex-fill">
                    <TextEditArea
                      id="originalText"
                      isTextareaDisabled={false}
                      language={contributionLanguage ?? ''}
                      initiative={INITIATIVES_MEDIA_MAPPING.likho}
                      setTextValue={() => {}}
                      textValue={showUIData?.sentence}
                      roundedLeft
                      readOnly
                      label={t(`${contributionLanguage?.toLowerCase()}`)}
                      onError={() => {}}
                    />
                  </div>
                  <div className="flex-fill">
                    <TextEditArea
                      id="translatedText"
                      isTextareaDisabled={false}
                      language={translatedLanguage ?? ''}
                      initiative={INITIATIVES_MEDIA_MAPPING.likho}
                      setTextValue={() => {}}
                      textValue={showUIData?.contribution}
                      roundedRight
                      label={t(`${translatedLanguage?.toLowerCase()}`)}
                      onError={() => {}}
                      showTip
                      readOnlyActive
                      readOnly
                    />
                  </div>
                </div>
                {showEditTextArea && (
                  <div className="mt-4 mt-md-8">
                    <LikhoValidateTextArea
                      initiative={INITIATIVES_MEDIA_MAPPING.likho}
                      fromLanguage={contributionLanguage}
                      toLanguage={translatedLanguage ?? ''}
                      text={showUIData?.contribution}
                      textAreaLabel={`${t('yourEdit')}${
                        translatedLanguage && ` (${t(translatedLanguage.toLowerCase())})`
                      }`}
                      setHasError={setHasError}
                      updateText={updateFormInput}
                      validate={showUIData?.auto_validate}
                    />
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
                      playButton={false}
                      submitButton={showSubmitButton}
                      cancelButton={showCancelButton}
                      needsChangeButton={showNeedsChangeButton}
                      correctBtn={showCorrectButton}
                      correctDisable={false}
                      cancelDisable={false}
                      submitDisable={
                        !formDataStore.userInput ||
                        formDataStore.userInput.length < TEXT_INPUT_LENGTH.LENGTH ||
                        hasError
                      }
                      needsChangeDisable={false}
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
        <div className="d-flex flex-grow-1 align-items-center">
          <NoDataFound
            url={routePaths.likhoIndiaHome}
            title={t('parallelValidateNoDataThankYouMessage')}
            text={t('noDataMessage', { language: contributionLanguage?.toLowerCase() })}
            buttonLabel={t('parallelBackToInitiativePrompt')}
          />
        </div>
      )}
      {(skipError || rejectError || acceptError || submitError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(skipError || rejectError || acceptError || submitError)}
          onHide={() => setShowErrorModal(false)}
        />
      )}
    </Fragment>
  );
};

export default LikhoValidate;
