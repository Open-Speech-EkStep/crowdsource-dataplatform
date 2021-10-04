import React from 'react';

import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import ContributionStats from 'components/ContributionStats';
import ContributionTracker from 'components/ContributionTracker';
import TargetProgress from 'components/TargetProgress';
import ViewAllDetailButton from 'components/ViewAllDetailButton';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

import styles from './SunoIndiaDetails.module.scss';

const SunoIndiaDetails = () => {
  const { t } = useTranslation();
  const initiativeName = `${t('suno')} ${t('india')}`;
  return (
    <section data-testid="SunoIndiaDetails" className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.suno}
            initiativeType={INITIATIVES_MEDIA_MAPPING.suno}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats
            initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
            initiative={INITIATIVES_MAPPING.suno}
          >
            <header className="d-flex flex-column">
              <h3 className="w-100">{t('contributionStatsHeader', { initiativeName })}</h3>
              <span className={`${styles.subHeader} display-3 mt-4 mb-0`}>
                {t('contributionStatsSubHeader')}
              </span>
            </header>
          </ContributionStats>
        </section>
        <section className="mt-9 mt-md-12">
          <h3>{t('contributionTrackerHeader')}</h3>
          <div className="mt-4">
            <ContributionTracker initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno} />
          </div>
        </section>
        <section className="mt-9 mt-md-12">
          <ViewAllDetailButton initiative="suno" />
        </section>
      </Container>
    </section>
  );
};

export default SunoIndiaDetails;
