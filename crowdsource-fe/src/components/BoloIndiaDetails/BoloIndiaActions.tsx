import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

const BoloIndiaActions = () => {
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  return (
    <section data-testid="BoloIndiaActions" className="mt-7 mt-md-9">
      <ContributionLanguage />
      <ContributionActions
        initiativeType={INITIATIVES_MEDIA_MAPPING.bolo}
        contributionLanguage={contributionLanguage ?? ''}
        initiative={INITIATIVES_MAPPING.bolo}
      />
    </section>
  );
};

export default BoloIndiaActions;
