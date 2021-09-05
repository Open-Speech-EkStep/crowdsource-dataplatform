import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import BadgesIntro from 'components/BadgesIntro';
import BronzeContribute from 'components/BronzeContribute';
import ContributionStats from 'components/ContributionStats';
import Hero from 'components/Hero';
import InitiativesCarousel from 'components/InitiativesCarousel';
import PageBackground from 'components/PageBackground';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const Home: NextPage = () => {
  return (
    <PageBackground image="home-page-bg.svg" imageMobile="landingpage_bg_sm.svg">
      <Container fluid="lg" className="py-7 py-md-9">
        <section className="py-8 py-md-9">
          <Hero />
        </section>
        <section className="py-8 py-md-9">
          <InitiativesCarousel />
        </section>
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
    </PageBackground>
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
