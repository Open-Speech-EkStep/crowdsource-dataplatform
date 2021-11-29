import { useTranslation } from 'next-i18next';

import SocialShareIcons from 'components/SocialShareIcons';

import styles from './SocialShare.module.scss';

const SocialShare = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="SocialShare" className="d-flex flex-column flex-lg-row align-items-center">
      <span className={`fw-bold ${styles.socialShareText}`}>{t('footerSocialShareText')}</span>
      <div className="d-flex py-3 ms-lg-6 py-lg-0">
        <SocialShareIcons />
      </div>
    </div>
  );
};

export default SocialShare;
