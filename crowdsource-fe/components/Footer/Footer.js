import useTranslate from 'hooks/useTranslate';

import styles from './Footer.module.css';

function Footer() {
  const { translate } = useTranslate();

  return <footer className={styles.root}>{translate('termsAndConditions')}</footer>;
}

export default Footer;
