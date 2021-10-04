import { useTranslation } from 'next-i18next';

import SocialShareIcons from 'components/SocialShareIcons';

const SocialShare = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="SocialShare" className="d-flex flex-column flex-lg-row align-items-center">
      <span className="fw-bold">{t('footerSocialShareText')}</span>
      <div className="d-flex py-3 mt-lg-0 ms-lg-6 py-md-0">
        <SocialShareIcons />
      </div>
    </div>
  );
};

export default SocialShare;
