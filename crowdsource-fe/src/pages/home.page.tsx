import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import BadgesIntro from 'components/BadgesIntro';
import BronzeContribute from 'components/BronzeContribute';
import ContributionStats from 'components/ContributionStats';
import HomePageBackground from 'components/HomePageBackground';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const Home: NextPage = () => {
  return (
    <Fragment>
      <HomePageBackground />
      <Container fluid="lg" className="pb-7 pb-md-9">
        <section className="py-8 py-md-9">
          <ContributionStats />
        </section>
        <section className="py-8 py-md-9">
          <BadgesIntro />
        </section>
        <section className="py-8 py-md-9">
          <BronzeContribute />
        </section>
      </Container>
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

export default Home;
