import { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Breadcrumbs from 'components/Breadcrumbs';
import ChangeUserModal from 'components/ChangeUserModal';
import ContributionStats from 'components/ContributionStats';
import ContributionStatsByLanguage from 'components/ContributionStatsByLanguage';
import DashboardNotification from 'components/DashboardNotification';
import LanguageSelector from 'components/LanguageSelector';
import Portal from 'components/Portal';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';

const IndiaMapChart = dynamic(() => import('components/IndiaMapChart'));
const ProgressChart = dynamic(() => import('components/ProgressChart'));

const TtsDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [language, setLanguage] = useState<string | undefined>(undefined);

  const [previousSelectedLanguage, setPreviousSelectedLanguage] = useState<string | undefined>(undefined);

  const [noData, setNoData] = useState(false);
  const [contributeLanguage, setContributeLanguage] = useState<string | undefined>();
  const [modalShow, setModalShow] = useState(false);

  const [speakerDetails] = useLocalStorage<string>(localStorageConstants.speakerDetails);
  const [, setContributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const contributePageUrl = `/${router.locale}${routePaths[`ttsInitiativeContribute`]}`;

  const contribute = (language: string) => {
    setContributionLanguage(language);
    if (!speakerDetails) {
      setModalShow(true);
    } else {
      router.push(contributePageUrl);
    }
  };

  useEffect(() => {
    let timer: any;
    if (noData && contributeLanguage) {
      timer = setTimeout(() => {
        setNoData(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [contributeLanguage, noData]);

  return (
    <div className="pt-4 px-2 px-lg-0 pb-8">
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative={INITIATIVES_MAPPING.tts} path="dashboard" />
      </header>
      <Container fluid="lg" className="mt-5">
        <LanguageSelector
          selectedLanguage={language}
          updateSelectedLanguage={(selectedLanguage: string | undefined) => {
            setPreviousSelectedLanguage(language);
            setLanguage(selectedLanguage);
            setNoData(false);
          }}
        />
        {noData && contributeLanguage && (
          <Portal>
            <DashboardNotification
              text={t('noDataMessageDashboard')}
              buttonLabel={t('contributeNow')}
              onClick={() => contribute(contributeLanguage)}
            />
          </Portal>
        )}
        <Fragment>
          <div className="mt-8">
            {(!language && <ContributionStats showComponent={true} initiative={INITIATIVES_MAPPING.tts} />) ||
              (language && (
                <ContributionStatsByLanguage
                  initiative={INITIATIVES_MAPPING.tts}
                  language={language}
                  handleNoData={() => {
                    setContributeLanguage(language);
                    setLanguage(previousSelectedLanguage);
                    setNoData(true);
                  }}
                />
              ))}
          </div>
          <Row className="mt-10">
            <Col lg="6" data-testid="GeographicalChart">
              <IndiaMapChart type={INITIATIVES_MEDIA_MAPPING.tts} language={language} />
            </Col>
            <Col lg="6" data-testid="ProgressChart" className="mt-8 mt-lg-0">
              <ProgressChart type={INITIATIVES_MEDIA_MAPPING.tts} language={language} />
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

export default TtsDashboard;
