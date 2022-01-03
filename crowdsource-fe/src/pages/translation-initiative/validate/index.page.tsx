import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import TranslationValidate from 'components/TranslationValidate';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const ValidatePage: NextPage = () => (
  <FunctionalPageBackground>
    <TranslationValidate />
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
