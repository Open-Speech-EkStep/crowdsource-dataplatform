import { useTranslation } from 'next-i18next';

import styles from './Footer.module.css';

function Footer() {
  const { t } = useTranslation();

  return <footer className={styles.root}>{t('termsAndConditions')}</footer>;
}

export default Footer;
