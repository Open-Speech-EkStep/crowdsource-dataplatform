import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const LikhoIndiaActions = () => {
  return (
    <section data-testid="LikhoIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.likho} />
      <ContributionActions initiative={INITIATIVES_MAPPING.likho} />
    </section>
  );
};

export default LikhoIndiaActions;
