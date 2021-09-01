import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import Hero from 'components/Hero';
import PageBackground from 'components/PageBackground';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const Home: NextPage = () => {
  return (
    <PageBackground image="home-page-bg.svg">
      <Container fluid="lg">
        <Hero />
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
