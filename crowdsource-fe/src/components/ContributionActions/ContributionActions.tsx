import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ActionCard from 'components/ActionCard';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ContributionActions.module.scss';

interface LanguageWithData {
  type: string;
  language: string;
}

interface ContributionActionProps {
  initiative: 'suno' | 'bolo' | 'likho' | 'dekho';
}

const ContributionActions = (props: ContributionActionProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);

  const { data: languageWithData, mutate: languageWithDataMutate } = useFetch<LanguageWithData[]>(
    apiPaths.languagesWithData,
    {
      revalidateOnMount: false,
    }
  );

  const { data: cardState, mutate: cardStateMutate } = useFetch<any>(apiPaths.enableDisableCards, {
    revalidateOnMount: false,
  });

  useEffect(() => {
    if (contributionLanguage) {
      languageWithDataMutate();
      cardStateMutate();
    }
  }, [contributionLanguage, translatedLanguage, languageWithDataMutate, cardStateMutate]);

  const callbacks = {
    asr: (data: LanguageWithData) =>
      data.type === INITIATIVES_MEDIA_MAPPING[props.initiative] && data.language === contributionLanguage,
    parallel: (data: LanguageWithData) =>
      data.type === INITIATIVES_MEDIA_MAPPING[props.initiative] &&
      data.language === `${contributionLanguage}-${translatedLanguage}`,
  };

  const isLanguageAvailable = !!languageWithData?.find(
    data =>
      data.type === INITIATIVES_MEDIA_MAPPING[props.initiative] && data.language === contributionLanguage
  );

  let isAllContributed = true;
  let hasTarget = false;

  if (isLanguageAvailable && cardState) {
    const filteredData: any =
      INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.parallel
        ? cardState?.find(callbacks[INITIATIVES_MEDIA.parallel]) || {}
        : cardState?.find(callbacks[INITIATIVES_MEDIA.asr]) || {};
    hasTarget = filteredData.hastarget ?? false;
    isAllContributed = filteredData.isallcontributed ?? false;
  }

  return (
    <div className={styles.root} data-testid="ContributionActions">
      <Row>
        <Col md="6" className="mt-7 mt-md-9">
          <ActionCard
            type={'contribute'}
            icon={`${props.initiative}_contribute_icon.svg`}
            text={t(`${INITIATIVES_MEDIA_MAPPING[props.initiative]}ContributionTagline`)}
            shadow="Green"
            disabled={isAllContributed}
            warningMsg="contributeWarningMsg"
            initiative={props.initiative}
            altText="Contribute"
          />
        </Col>
        <Col md="6" className="mt-9 mt-md-9">
          <ActionCard
            type={'validate'}
            icon="validate.svg"
            text={t(`${INITIATIVES_MEDIA_MAPPING[props.initiative]}ValidationTagline`)}
            shadow="Blue"
            disabled={!hasTarget}
            warningMsg="validateWarningMsg"
            initiative={props.initiative}
            altText="Validate"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ContributionActions;
