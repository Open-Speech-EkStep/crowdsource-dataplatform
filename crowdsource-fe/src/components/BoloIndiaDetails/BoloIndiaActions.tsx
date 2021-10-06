import { useEffect } from 'react';

import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';

const BoloIndiaActions = () => {
  useEffect(() => {
    if (!localStorage.getItem(localStorageConstants.contributionLanguage))
      localStorage.setItem(localStorageConstants.contributionLanguage, RAW_LANGUAGES[DEFAULT_LOCALE]);
  });

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
