import React, { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import SunoTranscribe from 'components/SunoTranscribe';
// import TestSpeakerMic from 'components/TestSpeakerMic';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const RecordPage: NextPage = () => (
  <Fragment>
    <FunctionalPageBackground>
      {/* <ChromeExtension /> */}

      <SunoTranscribe />
    </FunctionalPageBackground>
  </Fragment>
);

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default RecordPage;
