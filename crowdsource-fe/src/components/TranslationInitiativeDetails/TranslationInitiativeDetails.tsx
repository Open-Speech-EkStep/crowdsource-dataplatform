import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Container from 'react-bootstrap/Container';

import ContributionStats from 'components/ContributionStats';
import TargetProgress from 'components/TargetProgress';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const ContributionTracker = dynamic(() => import('components/ContributionTracker'));

const TranslationInitiativeDetails = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="TranslationInitiativeDetails" className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.translation}
            initiativeType={INITIATIVES_MEDIA_MAPPING.translation}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats
            initiative={INITIATIVES_MAPPING.translation}
            header={t('translationContributionStatsHeader')}
            subHeader={t('contributionStatsSubHeader')}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionTracker initiative={INITIATIVES_MAPPING.translation} />
        </section>
      </Container>
    </section>
  );
};

export default TranslationInitiativeDetails;
