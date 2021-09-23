import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ActionCard from 'components/ActionCard';
import apiPaths from 'constants/apiPaths';
import { INITIATIVE_ACTIONS, INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ContributionActions.module.scss';

interface ContributionActionProps {
  initiativeMedia: string;
  contributionLanguage: string;
}

const ContributionActions = (props: ContributionActionProps) => {
  const initiative = INITIATIVES_MAPPING.suno;

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const { data: languageWithData } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.languagesWithData
  );

  // useEffect(() => {
  //   if (contributionLanguage) mutate();
  // }, [contributionLanguage, mutate]);

  const isLanguageAvailable = (languageData: any) => {
    return languageData &&
      languageData.find(
        (data: any) => data.type === props.initiativeMedia && data.language === contributionLanguage
      )
      ? true
      : false;
  };

  const { data: cardState } = useFetch<Array<{ count: string; type: string }>>(
    isLanguageAvailable(languageWithData) ? apiPaths.enableDisableCards : null
  );

  let isContributionEnabled = true;
  let isValidationEnabled = false;

  if (cardState) {
    const filteredData: any =
      cardState.find(
        (data: any) => data.type === props.initiativeMedia && data.language === contributionLanguage
      ) || {};
    isContributionEnabled = filteredData.hastarget || false;
    isValidationEnabled = filteredData.isallcontributed || false;
  }

  return (
    <div className={styles.root} data-testid="ContributionActions">
      <Row>
        <Col md="6" className="mt-7 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.transcribe}
            icon={`${initiative}_contribute_icon.svg`}
            text="Type what you hear"
            shadow="Green"
            disabled={isContributionEnabled}
            warningMsg="contributeWarningMsg"
          />
        </Col>
        <Col md="6" className="mt-9 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.validate}
            icon="validate.svg"
            text="Validate what others have contributed"
            shadow="Blue"
            disabled={!isValidationEnabled}
            warningMsg="validateWarningMsg"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ContributionActions;
