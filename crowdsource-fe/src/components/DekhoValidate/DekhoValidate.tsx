import { Fragment, useEffect, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
import FunctionalHeader from 'components/FunctionalHeader';
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
import { getBrowserInfo, getDeviceInfo } from 'utils/utils';

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
  const [showEditTextArea, setShowEditTextArea] = useState(false);
  const [closeKeyboard, setCloseKeyboard] = useState(false);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const [showUIData, setShowUIdata] = useState({
    sentence: '',
    contribution: '',
    dataset_row_id: '0',
    contribution_id: '0',
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

  const { submit } = useSubmit(apiPaths.store);
  const { submit: reject } = useSubmit(rejectApiUrl);
  const { submit: submitSkip } = useSubmit(skipApiUrl);
  const { submit: accept } = useSubmit(acceptApiUrl);

  const { data: result, mutate } = useFetchWithInit<ResultType>(
    `${apiPaths.contributionsOCR}?from=${contributionLanguage}&to=&username=${speakerDetails?.userName}`,
    {
      revalidateOnMount: false,
    }
  );

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

  const onChangeTextInput = (text: string) => {
    setFormData({
      ...formData,
      userInput: text,
    });
  };

  const setDataCurrentIndex = (index: number) => {
    if (index === contributionData.length - 1) {
      router.push(`/${currentLocale}${routePaths.dekhoIndiaContributeThankYou}`, undefined, {
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
    setCloseKeyboard(!closeKeyboard);
    setDataCurrentIndex(currentDataIndex);
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
      setShowEditTextArea(false);
    }, 1500);
  };

  const onCancelContribution = () => {
    setShowCancelButton(false);
    setShowSubmitButton(false);
    setShowNeedsChangeButton(true);
    setShowCorrectButton(true);
    setShowEditTextArea(false);
    setFormData({
      ...formData,
      userInput: '',
    });
  };

  const onSkipContribution = () => {
    setDataCurrentIndex(currentDataIndex);
    setCloseKeyboard(!closeKeyboard);
    resetState();
    submitSkip(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        userName: speakerDetails?.userName,
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state_region: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.dekho,
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
        sentenceId: showUIData.dataset_row_id,
        state: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.dekho,
      })
    );
  };

  if (!result) {
    return <Spinner data-testid="PageSpinner" animation="border" variant="light" />;
  }

  return contributionData && result?.data?.length !== 0 ? (
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
            <div className={classNames('mt-4 mt-md-8', { ['d-md-flex']: showEditTextArea })}>
              <div className="flex-fill">
                <TextEditArea
                  id="originalText"
                  isTextareaDisabled={false}
                  language={contributionLanguage ?? ''}
                  initiative={INITIATIVES_MAPPING.dekho}
                  setTextValue={() => {}}
                  textValue={showUIData?.contribution}
                  roundedLeft={showEditTextArea}
                  readOnly
                  readonlyAllBorders={!showEditTextArea}
                  label={t('capturedText')}
                  onError={() => {}}
                />
              </div>
              <div className="flex-fill">
                {showEditTextArea && (
                  <TextEditArea
                    id="editText"
                    isTextareaDisabled={false}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.dekho}
                    setTextValue={onChangeTextInput}
                    textValue={showUIData?.contribution}
                    label={`${t('yourEdit')}${
                      contributionLanguage && ` (${t(contributionLanguage.toLowerCase())})`
                    }`}
                    roundedRight
                    onError={setHasError}
                    showTip
                  />
                )}
              </div>
            </div>
            {showThankyouMessage ? (
              <div className="d-flex align-items-center justify-content-center mt-9 display-1">
                <span className="me-2 d-flex">
                  <Image src="/images/check_mark.svg" width="40" height="40" alt="check" />
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
                    !formData.userInput || formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH || hasError
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
        url={routePaths.dekhoIndiaHome}
        title={t('ocrContributeNoDataThankYouMessage')}
        text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
        buttonLabel={t('ocrBackToInitiativePrompt')}
      />
    </div>
  );
};

export default DekhoValidate;
