import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

const SunoIndiaActions = () => {
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  return (
    <section data-testid="SunoIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage />
      <ContributionActions
        initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
        contributionLanguage={contributionLanguage ?? ''}
        initiative={INITIATIVES_MAPPING.suno}
      />
    </section>
  );
};

export default SunoIndiaActions;
