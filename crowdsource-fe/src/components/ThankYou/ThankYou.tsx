import React, { Fragment, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import CompareLanguages from 'components/CompareLanguages';
import ContributeMore from 'components/ContributeMore';
import ContributionDetails from 'components/ContributionDetails';
import SocialShareIcons from 'components/SocialShareIcons';
import TwoColumn from 'components/TwoColumn';
import TyTargetProgress from 'components/TyTargetProgress';
import apiPaths from 'constants/apiPaths';
import {
  CONTRIBUTION_MAPPING,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { pageMediaTypeConstants, pageSourceConstants } from 'constants/pageRouteConstants';
import routePaths from 'constants/routePaths';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import type SpeakerDetails from 'types/SpeakerDetails';
import type { ThankYouReward } from 'types/ThankYou';

import styles from './ThankYou.module.scss';

import { BadgeEarned } from '.';

const ShareOn = () => (
  <div
    className={`${styles.socialShare} d-inline-flex align-items-center border border-1 border-primary px-4`}
  >
    <span className="me-3">Share on</span>
    <SocialShareIcons />
  </div>
);

const YourBadge = (props: any) => {
  const { locale: currentLocale } = useRouter();
  return (
    <div className="text-center">
      <h5 className="fw-light">Your Badge</h5>
      <div className={`${styles.badgeBg} p-3 mt-3`}>
        <Image
          src={`/images/${currentLocale}/badges/${currentLocale}_${
            props.initiative
          }_${props.badgeType.toLowerCase()}_${props.source}.svg`}
          width="94"
          height="120"
          alt="Bronze Badge en"
        />
      </div>
      <span className="d-flex justify-content-center mt-3 display-5 font-family-rowdies fw-light">
        You are a <span className="text-strong-warning ms-1">{props.badgeType} contributor</span>
      </span>
    </div>
  );
};

interface ThankYouProps {
  initiative: Initiative;
}

const ThankYou = ({ initiative }: ThankYouProps) => {
  const route = useRouter();
  const { t } = useTranslation();

  const [isTopLanguage, setIsTopLanguage] = useState(false);

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const { data: rewardData, mutate: rewardMutate } = useFetch<ThankYouReward>(
    `${apiPaths.rewards}?type=${
      INITIATIVES_MEDIA_MAPPING[initiative]
    }&language=${contributionLanguage}&source=${pageSourceConstants[route.asPath]}&userName=${
      speakerDetails?.userName
    }`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    if (contributionLanguage && speakerDetails) {
      rewardMutate();
    }
  }, [contributionLanguage, rewardMutate, speakerDetails]);

  return (
    <Fragment>
      <div className={`${styles.root} mx-auto`} data-testid="ThankYou">
        {rewardData?.isNewBadge && <h2 className="text-center">Congratulations on winning a new badge!</h2>}
        {rewardData?.badges && rewardData?.badges.length === 0 && (
          <h2 className="text-center">Contribute to your language!</h2>
        )}
        {rewardData?.badges && rewardData?.badges.length !== 0 && !rewardData.isNewBadge && (
          <h2 className="text-center">
            You {pageSourceConstants[route.asPath]}d {rewardData?.contributionCount}{' '}
            {pageMediaTypeConstants[route.asPath]} for your language!
          </h2>
        )}
        <section className="mt-8">
          <TyTargetProgress
            initiative={INITIATIVES_MAPPING[initiative]}
            initiativeType={INITIATIVES_MEDIA_MAPPING[initiative]}
            source={pageSourceConstants[route.asPath] || ''}
            language={contributionLanguage ?? ''}
          />
        </section>
        {rewardData?.isNewBadge && (
          <section className="mt-8">
            <BadgeEarned
              initiative={initiative}
              badgeType={rewardData?.currentBadgeType}
              contributionCount={rewardData?.contributionCount ?? 0}
              pageMediaTypeStr={pageMediaTypeConstants[route.asPath]}
              language={contributionLanguage ?? ''}
              source={pageSourceConstants[route.asPath]}
            />
            <div className="mt-8 mt-md-9">
              <TwoColumn
                left={
                  <div className="d-md-flex text-center text-md-start h-100 align-items-md-center">
                    <h4>
                      Participate to {isTopLanguage ? `keep` : `see`} {contributionLanguage} in top 3
                    </h4>
                  </div>
                }
                right={
                  <CompareLanguages
                    initiative={initiative}
                    graphLabel={t(`${INITIATIVES_MEDIA_MAPPING[initiative]}ContributionGraphYLabel1`)}
                    dataBindigValue={CONTRIBUTION_MAPPING[route.asPath] || ''}
                    isTopLanguage={setIsTopLanguage}
                  />
                }
              />
            </div>
          </section>
        )}
        {rewardData?.badges && rewardData?.badges.length === 0 && (
          <section className="mt-8">
            <ContributionDetails
              top={
                <TwoColumn
                  left={
                    <div className="d-md-flex text-center text-md-start h-100 align-items-md-center">
                      <h4>
                        Participate to {isTopLanguage ? `keep` : `see`} {contributionLanguage} in top 3
                      </h4>
                    </div>
                  }
                  right={
                    <CompareLanguages
                      initiative={initiative}
                      graphLabel={t(`${INITIATIVES_MEDIA_MAPPING[initiative]}ContributionGraphYLabel1`)}
                      dataBindigValue={CONTRIBUTION_MAPPING[route.asPath] || ''}
                      isTopLanguage={setIsTopLanguage}
                    />
                  }
                />
              }
              bottom={<ShareOn />}
            />
          </section>
        )}
        {rewardData?.badges && rewardData?.badges.length !== 0 && !rewardData.isNewBadge && (
          <section className="mt-8">
            <ContributionDetails
              top={
                <TwoColumn
                  left={
                    <YourBadge
                      badgeType={rewardData?.currentBadgeType}
                      initiative={INITIATIVES_MAPPING[initiative]}
                      source={pageSourceConstants[route.asPath] || ''}
                    />
                  }
                  right={
                    <CompareLanguages
                      initiative={initiative}
                      graphLabel={t(`${INITIATIVES_MEDIA_MAPPING[initiative]}ContributionGraphYLabel1`)}
                      dataBindigValue={CONTRIBUTION_MAPPING[route.asPath] || ''}
                      isTopLanguage={setIsTopLanguage}
                    />
                  }
                />
              }
              bottom={<ShareOn />}
            />
          </section>
        )}
      </div>
      <section className="mt-8 mt-md-12">
        <ContributeMore
          initiative={INITIATIVES_MAPPING.suno}
          source={pageSourceConstants[route.asPath]}
          nextMileStone={rewardData?.nextMilestone ?? 0}
          contributionCount={rewardData?.contributionCount ?? 0}
          nextBadgeType={rewardData?.nextBadgeType ?? ''}
          url={routePaths.sunoIndiaContribute}
          pageMediaTypeStr={pageMediaTypeConstants[route.asPath]}
        />
      </section>
    </Fragment>
  );
};

export default ThankYou;
