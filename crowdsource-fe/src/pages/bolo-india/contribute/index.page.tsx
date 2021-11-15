import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import BoloSpeak from 'components/BoloSpeak';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const ContributePage: NextPage = () => (
  <FunctionalPageBackground>
    <BoloSpeak />
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

export default ContributePage;
