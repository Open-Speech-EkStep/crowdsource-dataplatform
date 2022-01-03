import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import SocialShareIcons from 'components/SocialShareIcons';
import nodeConfig from 'constants/nodeConfig';
import { capitalizeFirstLetter } from 'utils/utils';

import styles from './ThankYou.module.scss';

interface ShareOnProps {
  initiativeName: string;
  rank: Number;
  language: string;
}

const ShareOn = ({ initiativeName, rank, language }: ShareOnProps) => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const socialSharingTextWithRank = t('socialSharingTextWithRank', {
    rank: rank,
    initiativeName: initiativeName,
    language: capitalizeFirstLetter(language),
    url: `${nodeConfig.appUrl}${nodeConfig.contextRoot}/${locale}/home`,
  });

  return (
    <div
      className={`${styles.socialShare} d-inline-flex align-items-center border border-1 border-primary px-4`}
    >
      <span className="me-3">{t('shareOn')}</span>
      <SocialShareIcons socialShareText={socialSharingTextWithRank} />
    </div>
  );
};

export default ShareOn;
