import React, { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
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

import styles from './DekhoContribute.module.scss';

interface ResultType {
  data: any;
}

const DekhoContribute = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showThankyouMessage, setShowThankyouMessage] = useState(false);

  const [closeKeyboard, setCloseKeyboard] = useState(false);

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

  const { submit, data: storeData, error: submitError } = useSubmit(apiPaths.store);

  const { submit: submitSkip, data: skipData, error: skipError } = useSubmit(apiPaths.skip);

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

  const { data: result, error } = useFetch<ResultType>({
    url: apiPaths.mediaOCR,
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

  /* istanbul ignore next */
  useEffect(() => {
    if ((storeData || skipData) && !(skipError || submitError)) {
      if (currentDataIndex === contributionData.length) {
        router.push(`/${currentLocale}${routePaths.dekhoIndiaContributeThankYou}`, undefined, {
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
      setContributionData(result.data);
      setShowUIdata(result.data[currentDataIndex]);
    }
  }, [currentDataIndex, result]);

  useEffect(() => {
    if (speakerDetails) {
      setCurrentDataIndex(0);
    }
  }, [speakerDetails]);

  const onChangeTextInput = (text: string) => {
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
      router.push(`/${currentLocale}${routePaths.dekhoIndiaContributeThankYou}`, undefined, {
        locale: currentLocale,
      });
    }
  };

  const resetState = () => {
    onCancelContribution();
  };

  const onSubmitContribution = async () => {
    setShowThankyouMessage(true);
    setCloseKeyboard(!closeKeyboard);
    resetState();
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

  const onSkipContribution = async () => {
    setCloseKeyboard(!closeKeyboard);
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
          type: INITIATIVES_MEDIA_MAPPING.dekho,
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
          type: INITIATIVES_MEDIA_MAPPING.dekho,
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
          <ChromeExtension />
          <div className="pt-4 px-2 px-lg-0 pb-8">
            <FunctionalHeader
              onSuccess={onSkipContribution}
              type="contribute"
              initiative={INITIATIVES_MAPPING.dekho}
              action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.dekho]['contribute']}
              showSpeaker={false}
            />
            <Container fluid="lg" className="mt-5">
              <div data-testid="DekhoContribute" className={`${styles.root}`}>
                <div className="align-items-center text-center">
                  <span className="display-3">{t(`${INITIATIVES_MAPPING.dekho}ContributionHeading`)}</span>
                </div>
                <div className="mt-2 mt-md-4">
                  {showUIData?.media_data && (
                    <ImageView imageUrl={encodeURIComponent(showUIData?.media_data)} />
                  )}
                </div>
                <div className="mt-4 mt-md-8">
                  <TextEditArea
                    id="addText"
                    isTextareaDisabled={false}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MEDIA_MAPPING.dekho}
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
                      <ImageBasePath src="/images/check_mark.svg" width="40" height="40" alt="check" />
                    </span>
                    {t('thankyouForContributing')}
                  </div>
                ) : (
                  <div className="mt-9 mt-md-12">
                    <ButtonControls
                      cancelDisable={!formData.userInput}
                      submitDisable={formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH || hasError}
                      onSubmit={onSubmitContribution}
                      onCancel={onCancelContribution}
                      onSkip={onSkipContribution}
                      playButton={false}
                      skipDisable={currentDataIndex === contributionData.length}
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
      {(error || submitError || skipError) && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(error || submitError || skipError)}
          onHide={() => hideErrorModal()}
        />
      )}
    </Fragment>
  );
};

export default DekhoContribute;
