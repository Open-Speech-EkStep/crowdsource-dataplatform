import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import TranslationDashboard from 'components/TranslationDashboard';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const DashboardPage: NextPage = () => (
  <FunctionalPageBackground>
    <TranslationDashboard />
  </FunctionalPageBackground>
);

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default DashboardPage;
