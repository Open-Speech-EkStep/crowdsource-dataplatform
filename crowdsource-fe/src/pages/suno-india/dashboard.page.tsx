import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import SunoDashboard from 'components/SunoDashboard';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const DashboardPage: NextPage = () => (
  <FunctionalPageBackground>
    <SunoDashboard />
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
