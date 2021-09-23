import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import ContributionStats from 'components/ContributionStats';
import ContributionTracker from 'components/ContributionTracker';
import TargetProgress from 'components/TargetProgress';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

import styles from './SunoIndiaDetails.module.scss';

const SunoIndiaDetails = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="SunoIndiaDetails" className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.suno}
            initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}>
            <header className="d-flex flex-column">
              <h1 className={`${styles.header} mb-0 w-100`}>{t('contributionTrackerHeader')}</h1>
              <span className={`${styles.subHeader} mt-4 mb-0`}>{t('contributionTrackerSubHeader')}</span>
            </header>
          </ContributionStats>
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionTracker />
        </section>
      </Container>
    </section>
  );
};

export default SunoIndiaDetails;
