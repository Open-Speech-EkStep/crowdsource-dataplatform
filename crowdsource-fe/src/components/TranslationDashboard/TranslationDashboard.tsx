import { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Breadcrumbs from 'components/Breadcrumbs';
import ChangeUserModal from 'components/ChangeUserModal';
import ContributionStats from 'components/ContributionStats';
import ContributionStatsByLanguage from 'components/ContributionStatsByLanguage';
import DashboardNotification from 'components/DashboardNotification';
import IndiaMapChart from 'components/IndiaMapChart';
import LanguagePairSelector from 'components/LanguagePairSelector';
import Portal from 'components/Portal';
import ProgressChart from 'components/ProgressChart';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';

const TranslationDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [fromLanguage, setFromLanguage] = useState<string | undefined>(undefined);
  const [toLanguage, setToLanguage] = useState<string | undefined>(undefined);

  const [previousSelectedFromLanguage, setPreviousSelectedFromLanguage] = useState<string | undefined>(
    undefined
  );
  const [previousSelectedToLanguage, setPreviousSelectedToLanguage] = useState<string | undefined>(undefined);

  const [noData, setNoData] = useState(false);
  const [contributeFromLanguage, setContributeFromLanguage] = useState<string | undefined>();
  const [contributeToLanguage, setContributeToLanguage] = useState<string | undefined>();
  const [modalShow, setModalShow] = useState(false);

  const [speakerDetails] = useLocalStorage<string>(localStorageConstants.speakerDetails);
  const [, setContributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [, setTranslationLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);
  const contributePageUrl = `/${router.locale}${routePaths[`translationInitiativeContribute`]}`;

  const languagePair = fromLanguage && toLanguage ? `${fromLanguage}-${toLanguage}` : undefined;

  const contribute = (fromLanguage: string, toLanguage: string) => {
    setContributionLanguage(fromLanguage);
    setTranslationLanguage(toLanguage);
    if (!speakerDetails) {
      setModalShow(true);
    } else {
      router.push(contributePageUrl);
    }
  };

  useEffect(() => {
    let timer: any;
    if (noData && contributeFromLanguage && contributeToLanguage) {
      timer = setTimeout(() => {
        setNoData(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [contributeFromLanguage, contributeToLanguage, noData]);

  return (
    <div className="pt-4 px-2 px-lg-0 pb-8">
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative={INITIATIVES_MAPPING.translation} path="dashboard" />
      </header>
      <Container fluid="lg" className="mt-5">
        <LanguagePairSelector
          fromLanguage={fromLanguage}
          toLanguage={toLanguage}
          updateSelectedLanguages={(
            selectedFromLanguage: string | undefined,
            selectedToLanguage: string | undefined
          ) => {
            setPreviousSelectedFromLanguage(fromLanguage);
            setPreviousSelectedToLanguage(toLanguage);
            setFromLanguage(selectedFromLanguage);
            setToLanguage(selectedToLanguage);
            setNoData(false);
          }}
        />
        {noData && contributeFromLanguage && contributeToLanguage && (
          <Portal>
            <DashboardNotification
              text={t('noDataMessageDashboard')}
              buttonLabel={t('contributeNow')}
              onClick={() => contribute(contributeFromLanguage, contributeToLanguage)}
            />
          </Portal>
        )}
        <Fragment>
          <div className="mt-8">
            {(!(fromLanguage && toLanguage) && (
              <ContributionStats showComponent={true} initiative={INITIATIVES_MAPPING.translation} />
            )) ||
              (fromLanguage && toLanguage && (
                <ContributionStatsByLanguage
                  initiative={INITIATIVES_MAPPING.translation}
                  language={languagePair || ''}
                  handleNoData={() => {
                    setContributeFromLanguage(fromLanguage);
                    setContributeToLanguage(toLanguage);
                    setFromLanguage(previousSelectedFromLanguage);
                    setToLanguage(previousSelectedToLanguage);
                    setNoData(true);
                  }}
                />
              ))}
          </div>
          <Row className="mt-10">
            <Col lg="6" data-testid="GeographicalChart">
              <IndiaMapChart type={INITIATIVES_MEDIA_MAPPING.translation} language={languagePair} />
            </Col>
            <Col lg="6" className="mt-8 mt-lg-0" data-testid="ProgressChart">
              <ProgressChart type={INITIATIVES_MEDIA_MAPPING.translation} language={languagePair} />
            </Col>
          </Row>
        </Fragment>
      </Container>
      <ChangeUserModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        doRedirection={true}
        redirectionUrl={contributePageUrl}
      />
    </div>
  );
};

export default TranslationDashboard;
