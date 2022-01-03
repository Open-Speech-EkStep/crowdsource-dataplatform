import React from 'react';

import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import ContributionStats from 'components/ContributionStats';
import ContributionTracker from 'components/ContributionTracker';
import TargetProgress from 'components/TargetProgress';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const TtsInitiativeDetails = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="TtsInitiativeDetails" className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.tts}
            initiativeType={INITIATIVES_MEDIA_MAPPING.tts}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats
            initiative={INITIATIVES_MAPPING.tts}
            header={t('ttsContributionStatsHeader')}
            subHeader={t('contributionStatsSubHeader')}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionTracker initiative={INITIATIVES_MAPPING.tts} />
        </section>
      </Container>
    </section>
  );
};

export default TtsInitiativeDetails;
