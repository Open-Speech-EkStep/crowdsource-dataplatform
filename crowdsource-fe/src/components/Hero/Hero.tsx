import { useTranslation } from 'next-i18next';

import styles from './Hero.module.scss';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section data-testid="Hero" className={styles.root}>
      <h1 className={styles.heroPrimaryHeading}>
        {t('bhasha')} <span className={styles.yellowText}>{t('daan')}</span>
      </h1>
      <p className={styles.heroSecondaryHeading}>{t('heroSecondaryHeading')}</p>
      <p className={styles.heroText}>{t('heroText')}</p>
    </section>
  );
};

export default Hero;
