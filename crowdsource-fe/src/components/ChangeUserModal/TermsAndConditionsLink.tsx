import { useTranslation } from 'next-i18next';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

const TermsAndConditionsLink = () => {
  const { t } = useTranslation();

  return (
    <Link href={routePaths.termsAndConditions}>
      <a target="_blank">{t('termsAndConditionsTextValue')}</a>
    </Link>
  );
};

export default TermsAndConditionsLink;
