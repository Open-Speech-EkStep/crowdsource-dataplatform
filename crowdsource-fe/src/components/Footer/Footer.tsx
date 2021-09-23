import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import Link from 'components/Link';
import SocialShare from 'components/SocialShare';
import routePaths from 'constants/routePaths';

import styles from './Footer.module.scss';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      data-testid="Footer"
      className={`${styles.root} d-flex align-items-center bg-light text-primary py-4`}
    >
      <Container fluid="lg" className="d-flex flex-column flex-lg-row">
        <div className="d-flex flex-column flex-lg-row align-items-center order-2 order-lg-1">
          <Link href={routePaths.termsAndConditions}>
            <a target="_blank" className={`${styles.link} me-lg-12 py-2 py-lg-0 text-primary`}>
              {t('termsAndConditions')}
            </a>
          </Link>
          <Link href={routePaths.privacyPolicy}>
            <a target="_blank" className={`${styles.link} py-2 py-lg-0 text-primary`}>
              {t('privacyPolicy')}
            </a>
          </Link>
        </div>
        <div className="order-1 order-lg-2 ms-lg-12">
          <SocialShare />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
