import React, { Fragment, useEffect, useState } from 'react';

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
import ImageView from 'components/ImageView';
import NoDataFound from 'components/NoDataFound';
import TextEditArea from 'components/TextEditArea';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_ACTIONS,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
  INITIATIVES_MEDIA,
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

import styles from './DekhoValidate.module.scss';

interface ResultType {
  data: any;
}

const DekhoValidate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);
  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showThankyouMessage, setShowThankyouMessage] = useState(false);
  const [showNeedsChangeButton, setShowNeedsChangeButton] = useState(true);
  const [showCorrectButton, setShowCorrectButton] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showEditTextBlock, setShowEditTextBlock] = useState(false);
  const [closeKeyboard, setCloseKeyboard] = useState(false);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showUIData, setShowUIdata] = useState({
    sentence: '',
    contribution: '',
    dataset_row_id: '0',
    contribution_id: '0',
    auto_validate: false,
  });
  const [formData, setFormData] = useState<ActionStoreInterface>({
    userInput: '',
    speakerDetails: '',
    language: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.dekho,
    sentenceId: 0,
    state: '',
    country: '',
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
  });

  const router = useRouter();
  const { locale: currentLocale } = useRouter();

  const rejectApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/reject`;
  const skipApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/skip`;
  const acceptApiUrl = `${apiPaths.validate}/${showUIData?.contribution_id}/accept`;

  const { submit, data: storeData, error: submitError } = useSubmit(apiPaths.store);
  const { submit: reject, error: rejectError } = useSubmit(rejectApiUrl);
  const { submit: submitSkip, data: skipData, error: skipError } = useSubmit(skipApiUrl);
  const { submit: accept, data: acceptData, error: acceptError } = useSubmit(acceptApiUrl);

  const { data: result, mutate } = useFetchWithInit<ResultType>(
    `${apiPaths.contributionsOCR}?from=${contributionLanguage}&to=&username=${speakerDetails?.userName}`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    if (skipError || acceptError || rejectError || submitError) {
      setShowErrorModal(true);
    }
  }, [skipError, acceptError, rejectError, submitError]);

  /* istanbul ignore next */
  useEffect(() => {
    if ((storeData || skipData || acceptData) && !(skipError || submitError || acceptError)) {
      if (currentDataIndex === contributionData.length) {
        router.push(`/${currentLocale}${routePaths.dekhoIndiaValidateThankYou}`, undefined, {
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
    setFormData({
      ...formData,
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
      router.push(`/${currentLocale}${routePaths.dekhoIndiaValidateThankYou}`, undefined, {
        locale: currentLocale,
      });
    }
  };

  const resetState = () => {
    onCancelContribution();
  };

  const onSubmitContribution = async () => {
    setShowThankyouMessage(true);
    resetState();
    setCloseKeyboard(!closeKeyboard);

    if (currentDataIndex === contributionData.length - 1) {
      await submit(
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
    } else {
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
    }
    setDataCurrentIndex(currentDataIndex);
    reject(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        country: locationInfo?.country,
        state: locationInfo?.regionName,
        userName: speakerDetails?.userName,
        type: INITIATIVES_MEDIA.ocr,
      })
    );
    setTimeout(() => {
      setDataCurrentIndex(currentDataIndex);
      setShowThankyouMessage(false);
      setShowEditTextBlock(false);
    }, 1500);
  };

  const onCancelContribution = () => {
    setShowCancelButton(false);
    setShowSubmitButton(false);
    setShowNeedsChangeButton(true);
    setShowCorrectButton(true);
    setShowEditTextBlock(false);
    setFormData({
      ...formData,
      userInput: '',
    });
  };

  const onSkipContribution = async () => {
    setCloseKeyboard(!closeKeyboard);
    resetState();
    if (currentDataIndex === contributionData.length - 1) {
      await submitSkip(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.dekho,
        })
      );
    } else {
      submitSkip(
        JSON.stringify({
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          userName: speakerDetails?.userName,
          fromLanguage: contributionLanguage,
          sentenceId: showUIData.dataset_row_id,
          state: locationInfo?.regionName,
          country: locationInfo?.country,
          type: INITIATIVES_MEDIA_MAPPING.dekho,
        })
      );
    }
    setDataCurrentIndex(currentDataIndex);
  };

  const onNeedsChange = () => {
    setShowEditTextBlock(true);
    setShowNeedsChangeButton(false);
    setShowCorrectButton(false);
    setShowCancelButton(true);
    setShowSubmitButton(true);
  };

  const onCorrect = async () => {
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
          type: INITIATIVES_MEDIA_MAPPING.dekho,
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
          type: INITIATIVES_MEDIA_MAPPING.dekho,
        })
      );
    }
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
              initiative={INITIATIVES_MAPPING.dekho}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.dekho]['validate']}
              showSpeaker={false}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="DekhoValidate" className={`${styles.root}`}>
                <div className="align-items-center text-center">
                  <span className="display-3">{t(`${INITIATIVES_MAPPING.dekho}ValidationHeading`)}</span>
                </div>
                <div className="mt-2 mt-md-4">
                  <ImageView imageUrl={showUIData?.sentence} />
                </div>
                {showEditTextBlock ? (
                  <div className="d-md-flex mt-4 mt-md-8">
                    <EditTextBlock
                      initiative={INITIATIVES_MEDIA_MAPPING.dekho}
                      fromLanguage={contributionLanguage}
                      toLanguage={contributionLanguage}
                      text={showUIData?.contribution}
                      leftTextAreaLabel={t('capturedText')}
                      rightTextAreaLabel={`${t('yourEdit')}${
                        contributionLanguage && ` (${t(contributionLanguage.toLowerCase())})`
                      }`}
                      setHasError={setHasError}
                      updateText={updateFormInput}
                      validate={showUIData?.auto_validate}
                    />
                  </div>
                ) : (
                  <div className="mt-4 mt-md-8">
                    <TextEditArea
                      id="originalText"
                      isTextareaDisabled={false}
                      language={contributionLanguage ?? ''}
                      initiative={INITIATIVES_MEDIA_MAPPING.dekho}
                      setTextValue={() => {}}
                      textValue={showUIData?.contribution}
                      roundedLeft={showEditTextBlock}
                      readOnly
                      readonlyAllBorders={!showEditTextBlock}
                      label={t('capturedText')}
                      onError={() => {}}
                    />
                  </div>
                )}
                {showThankyouMessage ? (
                  <div className="d-flex align-items-center justify-content-center mt-9 display-1">
                    <span className="me-2 d-flex">
                      <ImageBasePath src="/images/check_mark.svg" width="40" height="40" alt="check" />
                    </span>
                    {t('thankyouForContributing')}
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
                        !formData.userInput ||
                        formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH ||
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
            url={routePaths.dekhoIndiaHome}
            title={t('ocrContributeNoDataThankYouMessage')}
            text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
            buttonLabel={t('ocrBackToInitiativePrompt')}
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

export default DekhoValidate;
