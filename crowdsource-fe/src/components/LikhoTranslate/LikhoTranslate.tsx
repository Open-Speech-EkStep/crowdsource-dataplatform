import React, { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import ButtonControls from 'components/ButtonControls';
import ChromeExtension from 'components/ChromeExtension';
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
import { getBrowserInfo, getDeviceInfo } from 'utils/utils';

import styles from './LikhoTranslate.module.scss';

interface ResultType {
  data: any;
}

const LikhoTranslate = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const [locationInfo] = useLocalStorage<LocationInfo>(localStorageConstants.locationInfo);

  const [showThankyouMessage, setShowThankyouMessage] = useState(false);
  const [closeKeyboard, setCloseKeyboard] = useState(false);
  const [contributionData, setContributionData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const [showUIData, setShowUIdata] = useState({
    media_data: '',
    dataset_row_id: '0',
  });

  const { submit } = useSubmit(apiPaths.store);

  const { submit: submitSkip } = useSubmit(apiPaths.skip);

  const [formData, setFormData] = useState<ActionStoreInterface>({
    userInput: '',
    speakerDetails: '',
    language: translatedLanguage ?? '',
    fromLanguage: contributionLanguage ?? '',
    type: INITIATIVES_MEDIA_MAPPING.likho,
    sentenceId: 0,
    state: '',
    country: '',
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
  });

  const result = useFetch<ResultType>({
    url: apiPaths.mediaParallel,
    init: contributionLanguage
      ? {
          body: JSON.stringify({
            language: contributionLanguage,
            toLanguage: translatedLanguage,
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
    if (index === contributionData.length - 1) {
      router.push(`/${currentLocale}${routePaths.likhoIndiaContributeThankYou}`, undefined, {
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
    setCloseKeyboard(!closeKeyboard);
    setDataCurrentIndex(currentDataIndex);
    resetState();
    submit(
      JSON.stringify({
        ...formData,
        language: translatedLanguage,
        fromLanguage: contributionLanguage,
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
    setDataCurrentIndex(currentDataIndex);
    setCloseKeyboard(!closeKeyboard);
    resetState();
    submitSkip(
      JSON.stringify({
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        userName: speakerDetails?.userName,
        language: translatedLanguage,
        fromLanguage: contributionLanguage,
        sentenceId: showUIData.dataset_row_id,
        state_region: locationInfo?.regionName,
        country: locationInfo?.country,
        type: INITIATIVES_MEDIA_MAPPING.likho,
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
          initiative={INITIATIVES_MAPPING.likho}
          action={INITIATIVE_ACTIONS[INITIATIVES_MAPPING.likho]['contribute']}
          showSpeaker={false}
        />
        <Container fluid="lg" className="mt-5">
          <div data-testid="LikhoTranslate" className={`${styles.root}`}>
            <div className="mt-4 mt-md-8 ">
              <div className="align-items-center text-center">
                <span className={`${styles.label} display-3`}>
                  {t(`${INITIATIVES_MAPPING.likho}ContributionHeading`)}
                </span>
              </div>
              <div className="d-md-flex mt-9 mt-md-12">
                <div className="flex-fill">
                  <TextEditArea
                    id="originalText"
                    isTextareaDisabled={false}
                    language={contributionLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.suno}
                    setTextValue={() => {}}
                    textValue={showUIData?.media_data}
                    roundedLeft
                    readOnly
                    label={t(`${contributionLanguage?.toLowerCase()}`)}
                    onError={() => {}}
                  />
                </div>
                <div className="flex-fill">
                  <TextEditArea
                    id="editText"
                    isTextareaDisabled={false}
                    language={translatedLanguage ?? ''}
                    initiative={INITIATIVES_MAPPING.suno}
                    setTextValue={onChangeTextInput}
                    closeKeyboard={closeKeyboard}
                    textValue={formData.userInput}
                    roundedRight
                    label={t(`${translatedLanguage?.toLowerCase()}`)}
                    onError={setHasError}
                    showTip
                  />
                </div>
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
                  cancelDisable={!formData.userInput}
                  submitDisable={
                    !formData.userInput || formData.userInput.length < TEXT_INPUT_LENGTH.LENGTH || hasError
                  }
                  onSubmit={onSubmitContribution}
                  onCancel={onCancelContribution}
                  onSkip={onSkipContribution}
                  playButton={false}
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
        title={t('parallelContributeNoDataThankYouMessage')}
        text={t('noDataMessage', { language: t(`${contributionLanguage?.toLowerCase()}`) })}
        buttonLabel={t('backToInitiativePrompt', {
          initiativeName: `${t(INITIATIVES_MAPPING.likho)} ${t('india')}`,
        })}
      />
    </div>
  );
};

export default LikhoTranslate;
