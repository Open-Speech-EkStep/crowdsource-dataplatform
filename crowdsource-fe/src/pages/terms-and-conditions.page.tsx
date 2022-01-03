import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TermsAndConditions from 'components/TermsAndConditions';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const TermsAndConditionsPage: NextPage = () => <TermsAndConditions />;

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default TermsAndConditionsPage;
