import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const TranslationInitiativeActions = () => {
  return (
    <section data-testid="TranslationInitiativeActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.translation} />
      <ContributionActions initiative={INITIATIVES_MAPPING.translation} />
    </section>
  );
};

export default TranslationInitiativeActions;
