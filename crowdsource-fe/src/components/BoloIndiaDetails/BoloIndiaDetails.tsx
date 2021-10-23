import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import ContributionStats from 'components/ContributionStats';
import ContributionTracker from 'components/ContributionTracker';
import TargetProgress from 'components/TargetProgress';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const BoloIndiaDetails = () => {
  const { t } = useTranslation();
  const initiativeName = `${t(INITIATIVES_MAPPING.bolo)} ${t('india')}`;
  const graphTitle = t('textBarGraphTitle');
  return (
    <section data-testid="BoloIndiaDetails" className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.bolo}
            initiativeType={INITIATIVES_MEDIA_MAPPING.bolo}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats
            initiative={INITIATIVES_MAPPING.bolo}
            header={t('contributionStatsHeader', { initiativeName })}
            subHeader={t('contributionStatsSubHeader')}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionTracker initiative={INITIATIVES_MAPPING.bolo} graphTitle={graphTitle} />
        </section>
      </Container>
    </section>
  );
};

export default BoloIndiaDetails;
