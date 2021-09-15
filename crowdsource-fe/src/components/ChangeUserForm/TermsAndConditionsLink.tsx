import { useTranslation } from 'next-i18next';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './ChangeUserForm.module.scss';

const TermsAndConditionsLink = () => {
  const { t } = useTranslation();

  return (
    <Link href={routePaths.termsAndConditions}>
      <a target="_blank" className={styles.termsAndConditionsLink}>
        {t('termsAndConditionsTextValue')}
      </a>
    </Link>
  );
};

export default TermsAndConditionsLink;
