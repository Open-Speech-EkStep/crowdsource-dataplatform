import { useTranslation } from 'next-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section data-testid="Hero" className="d-flex align-items-center flex-column text-center">
      <h1>
        {t('logoTitlePrefix')} <span className="text-warning">{t('logoTitleSuffix')}</span>
      </h1>
      <p className="display-1 mt-7">{t('heroSecondaryHeading')}</p>
      <p className="display-3 mt-5">{t('heroText')}</p>
    </section>
  );
};

export default Hero;
