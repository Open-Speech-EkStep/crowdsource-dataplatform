import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const SunoIndiaActions = () => {
  return (
    <section data-testid="SunoIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage />
      <ContributionActions
        initiativeType={INITIATIVES_MEDIA_MAPPING.suno}
        initiative={INITIATIVES_MAPPING.suno}
      />
    </section>
  );
};

export default SunoIndiaActions;
