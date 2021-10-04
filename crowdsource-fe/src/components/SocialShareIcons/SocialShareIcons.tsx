import { Fragment } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './SocialShareIcons.module.scss';

const SocialShareIcons = () => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <Fragment>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=bhashini.gov.in/bhashadaan/${currentLocale}/home.html`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block ms-0`}
      >
        <Image src="/images/fb-icon.svg" width="24" height="24" alt="Share on Facebook" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=https://bhashini.gov.in/bhashadaan/${currentLocale}/home.html`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block`}
      >
        <Image src="/images/linkedin-icon.svg" width="24" height="24" alt="Share on LinkedIn" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${t('socialSharingTextWithoutRank')}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block`}
      >
        <Image src="/images/twitter-icon.svg" width="24" height="24" alt="Share on Twitter" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${t('socialSharingTextWithoutRank')}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialShareLink} mx-2 d-inline-block me-0`}
      >
        <Image src="/images/whatsapp.svg" width="24" height="24" alt="Share on Whatsapp" />
      </a>
    </Fragment>
  );
};

export default SocialShareIcons;
