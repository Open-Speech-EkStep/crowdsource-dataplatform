import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const DekhoIndiaActions = () => {
  return (
    <section data-testid="DekhoIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage />
      <ContributionActions
        initiativeType={INITIATIVES_MEDIA_MAPPING.dekho}
        initiative={INITIATIVES_MAPPING.dekho}
      />
    </section>
  );
};

export default DekhoIndiaActions;
