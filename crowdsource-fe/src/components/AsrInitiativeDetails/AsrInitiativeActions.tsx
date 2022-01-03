import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const AsrInitiativeActions = () => {
  return (
    <section data-testid="AsrInitiativeActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.asr} />
      <ContributionActions initiative={INITIATIVES_MAPPING.asr} />
    </section>
  );
};

export default AsrInitiativeActions;
