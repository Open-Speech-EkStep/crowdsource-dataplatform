import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const BoloIndiaActions = () => {
  return (
    <section data-testid="BoloIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage />
      <ContributionActions
        initiativeType={INITIATIVES_MEDIA_MAPPING.bolo}
        initiative={INITIATIVES_MAPPING.bolo}
      />
    </section>
  );
};

export default BoloIndiaActions;
