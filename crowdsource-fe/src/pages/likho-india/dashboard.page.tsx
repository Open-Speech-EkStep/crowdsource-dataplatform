import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import LikhoDashboard from 'components/LikhoDashboard';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const DashboardPage: NextPage = () => (
  <FunctionalPageBackground>
    <LikhoDashboard />
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
