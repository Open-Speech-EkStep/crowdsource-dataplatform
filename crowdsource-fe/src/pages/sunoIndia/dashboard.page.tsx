import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import Breadcrumbs from 'components/Breadcrumbs';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import SunoDashboard from 'components/SunoDashboard';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const DashboardPage: NextPage = () => (
  <Fragment>
    <FunctionalPageBackground>
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative="suno" path="dashboard" />
      </header>
      <Container fluid="lg" className="mt-5">
        <SunoDashboard />
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

export default DashboardPage;
