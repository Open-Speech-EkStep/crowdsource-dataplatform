import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const TtsInitiativeActions = () => {
  return (
    <section data-testid="TtsInitiativeActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.tts} />
      <ContributionActions initiative={INITIATIVES_MAPPING.tts} />
    </section>
  );
};

export default TtsInitiativeActions;
