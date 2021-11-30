import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './Logo.module.scss';

const Logo = () => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div data-testid="Logo" className="d-flex">
      <a href={routePaths.root} className="d-flex align-items-center d-md-none">
        <ImageBasePath
          src={`/images/${currentLocale}/logos/${currentLocale}-logo-sm.svg`}
          alt="Bhashini Logo"
          width="48"
          height="48"
        />
      </a>
      <a href={routePaths.root} className="d-none align-items-center d-md-flex ms-0 ms-lg-3">
        <ImageBasePath
          src={`/images/${currentLocale}/logos/${currentLocale}-logo.svg`}
          alt="Bhashini Logo"
          width="192"
          height="70"
        />
      </a>
      <span className={`${styles.sep} d-flex align-self-center border border-1 border-primary mx-3`} />
      <Link href={routePaths.home}>
        <a className={`${styles.label} d-flex align-items-center text-primary px-xl-2 position-relative`}>
          {t('bhasha')}
          <span className={styles.labelSecondHalf}>{t('daan')}</span>
          <span className={`${styles.betaText} display-9 position-absolute`}>Beta</span>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
