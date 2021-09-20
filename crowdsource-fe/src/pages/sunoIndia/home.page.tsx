import { Fragment } from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import ContributionActions from 'components/ContributionActions';
import ContributionStats from 'components/ContributionStats';
import PageBackground from 'components/PageBackground';
import PageHeader from 'components/PageHeader';
import TargetProgress from 'components/TargetProgress';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const HomePage: NextPage = () => (
  <Fragment>
    <PageBackground>
      <Container fluid="lg">
        <header>
          <PageHeader initiative={INITIATIVES_MAPPING.suno} />
        </header>
        <section className="mt-7 mt-md-9">
          <ContributionActions initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno} />
        </section>
      </Container>
    </PageBackground>
    <section className="py-9 py-md-11 px-2 px-lg-0">
      <Container fluid="lg">
        <section>
          <TargetProgress
            initiative={INITIATIVES_MAPPING.suno}
            initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
          />
        </section>
        <section className="mt-9 mt-md-12">
          <ContributionStats
            initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
            initiative={INITIATIVES_MAPPING.suno}
          />
        </section>
      </Container>
    </section>
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

export default HomePage;
