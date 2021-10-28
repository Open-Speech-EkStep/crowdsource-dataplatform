import { useTranslation } from 'next-i18next';

import SocialShareIcons from 'components/SocialShareIcons';

import styles from './ThankYou.module.scss';

const ShareOn = () => {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.socialShare} d-inline-flex align-items-center border border-1 border-primary px-4`}
    >
      <span className="me-3">{t('shareOn')}</span>
      <SocialShareIcons />
    </div>
  );
};

export default ShareOn;
