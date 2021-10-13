import React, { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import Breadcrumbs from 'components/Breadcrumbs';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import Report from 'components/Report';
import SunoTranscribe from 'components/SunoTranscribe';
// import TestSpeakerMic from 'components/TestSpeakerMic';
import TestSpeakerMic from 'components/TestSpeakerMic';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const RecordPage: NextPage = () => (
  <Fragment>
    <FunctionalPageBackground>
      {/* <ChromeExtension /> */}
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative="suno" path="transcribe" />
        <div className="d-flex">
          <div>
            <Report />
          </div>
          <div className="ms-2 ms-md-4">
            <TestSpeakerMic showSpeaker={true} />
          </div>
        </div>
      </header>
      <Container fluid="lg" className="mt-5">
        <SunoTranscribe />
      </Container>
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
