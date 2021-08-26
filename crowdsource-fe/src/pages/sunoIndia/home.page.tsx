import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE } from 'constants/localesConstants';

const SunoIndiaHome: NextPage = () => {
  const { t } = useTranslation();

  return (
    <h1 data-testid="SunoIndiaHome">
      {t('suno')} {t('india')}
    </h1>
  );
};

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default SunoIndiaHome;
