import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ActionCard from 'components/ActionCard';
import apiPaths from 'constants/apiPaths';
import { INITIATIVE_ACTIONS } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ContributionActions.module.scss';

interface LanguageWithData {
  type: string;
  language: string;
}

interface ContributionActionProps {
  initiative: string;
  initiativeType: string;
}

const ContributionActions = (props: ContributionActionProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

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
  }, [contributionLanguage, languageWithDataMutate, cardStateMutate]);

  const isLanguageAvailable = !!languageWithData?.find(
    data => data.type === props.initiativeType && data.language === contributionLanguage
  );

  let isAllContributed = true;
  let hasTarget = false;

  if (isLanguageAvailable && cardState) {
    const filteredData: any =
      cardState.find(
        (data: any) => data.type === props.initiativeType && data.language === contributionLanguage
      ) || {};
    hasTarget = filteredData.hastarget ?? false;
    isAllContributed = filteredData.isallcontributed ?? false;
  }

  return (
    <div className={styles.root} data-testid="ContributionActions">
      <Row>
        <Col md="6" className="mt-7 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.transcribe}
            icon={`${props.initiative}_contribute_icon.svg`}
            text={t(`${props.initiative}ContributionTagline`)}
            shadow="Green"
            disabled={isAllContributed}
            warningMsg="contributeWarningMsg"
            initiative={props.initiative}
          />
        </Col>
        <Col md="6" className="mt-9 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.validate}
            icon="validate.svg"
            text={t(`${props.initiative}ValidationTagline`)}
            shadow="Blue"
            disabled={!hasTarget}
            warningMsg="validateWarningMsg"
            initiative={props.initiative}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ContributionActions;
