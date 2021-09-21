import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import BadgesIntro from 'components/BadgesIntro';
import BronzeContribute from 'components/BronzeContribute';
import ContributionStats from 'components/ContributionStats';
import Hero from 'components/Hero';
import HomePageBackground from 'components/HomePageBackground';
import InitiativesCarousel from 'components/InitiativesCarousel';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

import styles from './pages.module.scss';

const Home: NextPage = () => {
  const { t } = useTranslation();

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
            <ContributionStats>
              <header className="d-flex flex-column align-items-center flex-md-row justify-content-md-between">
                <h1 className={`${styles.header} mb-0`}>{t('totalParticipation')}</h1>
              </header>
            </ContributionStats>
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
