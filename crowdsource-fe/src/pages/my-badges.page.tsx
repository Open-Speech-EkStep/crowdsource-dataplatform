import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import MedalGallery from 'components/MedalGallery';
import { DEFAULT_LOCALE } from 'constants/localesConstants';
import routePaths from 'constants/routePaths';

const MyBadgesPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <FunctionalPageBackground>
      <div className="pt-4 px-2 px-lg-0 pb-8">
        <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
          <Link href={routePaths.home}>
            <a className="d-flex align-items-center text-primary display-4">
              <ImageBasePath src="/images/left_arrow.svg" width="24" height="24" alt="Left Arrow" />
              <span className="ms-3">{t('home')}</span>
            </a>
          </Link>
        </header>
        <Container fluid="lg" className="mt-5">
          <MedalGallery />
        </Container>
      </div>
    </FunctionalPageBackground>
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

export default MyBadgesPage;
