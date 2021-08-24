import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ErrorComponent from 'next/error';

function FourOFour() {
  const { t } = useTranslation();

  return <ErrorComponent statusCode={404} title={t('404Title')} />;
}

/* istanbul ignore next */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default FourOFour;
