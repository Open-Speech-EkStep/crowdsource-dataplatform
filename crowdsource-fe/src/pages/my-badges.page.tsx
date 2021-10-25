import React from 'react';

import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import useFetch from 'hooks/useFetch';

import FunctionalPageBackground from 'components/FunctionalPageBackground';
import Link from 'components/Link';
import MedalGallery from 'components/MedalGallery';
import { DEFAULT_LOCALE } from 'constants/localesConstants';
import routePaths from 'constants/routePaths';
import apiPaths from 'constants/apiPaths';
import useLocalStorage from 'hooks/useLocalStorage';
import SpeakerDetails from 'types/SpeakerDetails';
import localStorageConstants from 'constants/localStorageConstants';

const MyBadgesPage: NextPage = () => {
  const { t } = useTranslation();

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const userRewardsApi = `${apiPaths.userRewards}/${speakerDetails?.userName || ''}`;

  const userBadges = useFetch<any>(userRewardsApi, {
    revalidateOnMount: true,
  });

  console.log(userBadges);
  return (
    <FunctionalPageBackground>
      <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Link href={routePaths.home}>
          <a className="d-flex align-items-center text-primary display-4">
            <Image src="/images/left_arrow.svg" width="24" height="24" alt="Left Arrow" />
            <span className="ms-3">{t('home')}</span>
          </a>
        </Link>
      </header>
      <Container fluid="lg" className="mt-5">
        <MedalGallery userName={speakerDetails?.userName} userBadges={userBadges} />
      </Container>
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
