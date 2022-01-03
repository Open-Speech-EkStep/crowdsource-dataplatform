import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import AsrValidate from 'components/AsrValidate';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const ValidatePage: NextPage = () => (
  <FunctionalPageBackground>
    <AsrValidate />
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

export default ValidatePage;
