import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const SunoIndiaActions = () => {
  return (
    <section data-testid="SunoIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.suno} />
      <ContributionActions initiative={INITIATIVES_MAPPING.suno} />
    </section>
  );
};

export default SunoIndiaActions;
