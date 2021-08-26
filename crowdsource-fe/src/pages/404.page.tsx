import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ErrorComponent from 'next/error';

import { DEFAULT_LOCALE } from 'constants/localesConstants';

const FourOFour: NextPage = () => {
  const { t } = useTranslation();

  return <ErrorComponent statusCode={404} title={t('404Title')} />;
};

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default FourOFour;
