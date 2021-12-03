import React, { Fragment } from 'react';

import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import Breadcrumbs from 'components/Breadcrumbs';
import FunctionalPageBackground from 'components/FunctionalPageBackground';
import ThankYou from 'components/ThankYou';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const ThankYouPage: NextPage = () => {
  return (
    <Fragment>
      <FunctionalPageBackground>
        <div className="pt-4 px-2 px-lg-0 pb-8">
          <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
            <Breadcrumbs initiative={INITIATIVES_MAPPING.likho} path="translate" />
          </header>
          <Container fluid="lg" className="mt-5">
            <ThankYou initiative={INITIATIVES_MAPPING.likho} />
          </Container>
        </div>
      </FunctionalPageBackground>
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

export default ThankYouPage;
