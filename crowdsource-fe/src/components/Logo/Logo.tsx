import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './Logo.module.scss';

const Logo = () => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div data-testid="Logo" className={styles.root}>
      <a href={routePaths.root} className={classnames(styles.img, styles.imgMobile)}>
        <Image src={`/images/${currentLocale}-logo-sm.svg`} alt={t('bhashiniLogo')} width="48" height="48" />
      </a>
      <a href={routePaths.root} className={classnames(styles.img, styles.imgDesktop)}>
        <Image src={`/images/${currentLocale}-logo.svg`} alt={t('bhashiniLogo')} width="192" height="70" />
      </a>
      <span className={styles.sep} />
      <Link href={routePaths.home}>
        <a className={`${styles.label} px-xl-2`}>
          {t('bhasha')}
          <span className={styles.labelSecondHalf}>{t('daan')}</span>
          <span className={styles.betaText}>{t('beta')}</span>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
