import { Fragment } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ImageBasePath from 'components/ImageBasePath';
import nodeConfig from 'constants/nodeConfig';

import styles from './SocialShareIcons.module.scss';

interface SocialShareIconsProps {
  socialShareText: string;
}

const SocialShareIcons = ({ socialShareText }: SocialShareIconsProps) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <Fragment>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${nodeConfig.appUrl}${nodeConfig.contextRoot}/${currentLocale}/home&quote=${socialShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block ms-0`}
      >
        <ImageBasePath src="/images/fb-icon.svg" width="24" height="24" alt="Share on Facebook" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${nodeConfig.appUrl}${
          nodeConfig.contextRoot
        }/${currentLocale}/home&title=${t('metaOGTitle')}&summary=${socialShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block`}
      >
        <ImageBasePath src="/images/linkedin-icon.svg" width="24" height="24" alt="Share on LinkedIn" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${socialShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block`}
      >
        <ImageBasePath src="/images/twitter-icon.svg" width="24" height="24" alt="Share on Twitter" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${socialShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block me-0`}
      >
        <ImageBasePath src="/images/whatsapp.svg" width="24" height="24" alt="Share on Whatsapp" />
      </a>
    </Fragment>
  );
};

export default SocialShareIcons;
