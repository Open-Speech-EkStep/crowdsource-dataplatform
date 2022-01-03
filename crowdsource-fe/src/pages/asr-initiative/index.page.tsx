import React, { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import AsrInitiativeDetails, { AsrInitiativeActions } from 'components/AsrInitiativeDetails';
import PageBackground from 'components/PageBackground';
import PageHeader from 'components/PageHeader';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const HomePage: NextPage = () => {
  return (
    <Fragment>
      <PageBackground>
        <Container fluid="lg">
          <header>
            <PageHeader initiative={INITIATIVES_MAPPING.asr} />
          </header>
          <AsrInitiativeActions />
        </Container>
      </PageBackground>
      <AsrInitiativeDetails />
    </Fragment>
  );
};

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default HomePage;
