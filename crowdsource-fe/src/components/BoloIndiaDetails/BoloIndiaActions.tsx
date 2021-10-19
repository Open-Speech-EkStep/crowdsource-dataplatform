import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const BoloIndiaActions = () => {
  return (
    <section data-testid="BoloIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.bolo} />
      <ContributionActions initiative={INITIATIVES_MAPPING.bolo} />
    </section>
  );
};

export default BoloIndiaActions;
