import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function SunoIndiaHome() {
  const { t } = useTranslation();

  return (
    <h1>
      {t('suno')} {t('india')}
    </h1>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default SunoIndiaHome;
