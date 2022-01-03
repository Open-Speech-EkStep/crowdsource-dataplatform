import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import BadgesIntro from 'components/BadgesIntro';
import BronzeContribute from 'components/BronzeContribute';
import Hero from 'components/Hero';
import HomePageBackground from 'components/HomePageBackground';
import InitiativesCarousel from 'components/InitiativesCarousel';
import ParticipationStats from 'components/ParticipationStats';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const Home: NextPage = () => {
  return (
    <Fragment>
      <HomePageBackground>
        <Container fluid="lg" className="pt-7 pt-md-9">
          <section className="py-8 py-md-9 px-8 px-md-0">
            <Hero />
          </section>
          <section className="py-8 py-md-9">
            <InitiativesCarousel />
          </section>
        </Container>
      </HomePageBackground>
      <div className="px-2 px-lg-0">
        <Container fluid="lg" className="pb-7 pb-md-9">
          <section className="py-8 py-md-9">
            <ParticipationStats />
          </section>
          <section className="py-8 py-md-9">
            <BadgesIntro />
          </section>
          <section className="py-8 py-md-9">
            <BronzeContribute />
          </section>
        </Container>
      </div>
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
