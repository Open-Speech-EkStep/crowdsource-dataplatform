import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import SocialShareIcons from 'components/SocialShareIcons';
import nodeConfig from 'constants/nodeConfig';

import styles from './SocialShare.module.scss';

const SocialShare = () => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const socialSharingTextWithRank = t('socialSharingTextWithoutRank', {
    url: `${nodeConfig.appUrl}${nodeConfig.contextRoot}/${locale}/home`,
  });

  return (
    <div data-testid="SocialShare" className="d-flex flex-column flex-lg-row align-items-center">
      <span className={`fw-bold ${styles.socialShareText}`}>{t('footerSocialShareText')}</span>
      <div className="d-flex py-3 ms-lg-6 py-lg-0">
        <SocialShareIcons socialShareText={socialSharingTextWithRank} />
      </div>
    </div>
  );
};

export default SocialShare;
