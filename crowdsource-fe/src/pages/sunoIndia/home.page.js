import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function SunoIndiaHome() {
  const { t } = useTranslation();

  return (
    <h1 data-testid="SunoIndiaHome">
      {t('suno')} {t('india')}
    </h1>
  );
}

/* istanbul ignore next */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default SunoIndiaHome;
