import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import Breadcrumbs from 'components/Breadcrumbs';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import IconTextButton from 'components/IconTextButton';
import SunoTranscribe from 'components/SunoTranscribe';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const RecordPage: NextPage = () => (
  <Fragment>
    <FunctionalPageBackground>
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs />
        <div className="d-flex">
          <div>
            <IconTextButton icon="report.svg" textDesktop="Report" />
          </div>
          <div className="ms-2 ms-md-4">
            <IconTextButton icon="speaker.svg" textMobile="Test" textDesktop="Test your speakers" />
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
