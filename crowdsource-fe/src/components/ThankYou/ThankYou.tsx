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
import {
  pageMediaTypeConstants,
  pageSourceConstants,
  pageSourceConstants2,
  pageSourceConstants3,
  pageSourceConstants4,
} from 'constants/pageRouteConstants';
import routePaths from 'constants/routePaths';
import { useFetchWithInit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import type SpeakerDetails from 'types/SpeakerDetails';
import type { ThankYouReward } from 'types/ThankYou';
import { capitalizeFirstLetter } from 'utils/utils';

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
  const route = useRouter();
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
          alt={`${props.badgeType} badge`}
        />
      </div>
      <span className="d-flex justify-content-center mt-3 display-5 font-family-rowdies fw-light">
        You are a <span className="text-strong-warning ms-1"> {props.badgeType} </span>{' '}
        {capitalizeFirstLetter(pageSourceConstants4[route.asPath])}
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

  const { data: rewardData, mutate: rewardMutate } = useFetchWithInit<ThankYouReward>(
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
        {rewardData?.isNewBadge && <h2 className="text-center">{t('congratulationText')}</h2>}
        {rewardData?.badges && rewardData?.badges.length === 0 && (
          <h2 className="text-center">{t('contributeYourLanguage')}</h2>
        )}
        {rewardData?.badges && rewardData?.badges.length !== 0 && !rewardData.isNewBadge && (
          <h2 className="text-center">
            You {pageSourceConstants2[route.asPath]} {rewardData?.contributionCount}{' '}
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
              winningBadge={rewardData?.badges[rewardData?.badges.length - 1]}
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
                    graphLabel={t(
                      `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(
                        pageSourceConstants3[route.asPath]
                      )}GraphYLabel3`
                    )}
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
                      graphLabel={t(
                        `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(
                          pageSourceConstants3[route.asPath]
                        )}GraphYLabel3`
                      )}
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
                      graphLabel={t(
                        `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(
                          pageSourceConstants3[route.asPath]
                        )}GraphYLabel3`
                      )}
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
          url={`${
            routePaths[`${initiative}India${capitalizeFirstLetter(pageSourceConstants[route.asPath])}`]
          }`}
          pageMediaTypeStr={pageMediaTypeConstants[route.asPath]}
          badges={rewardData?.badges}
        />
      </section>
    </Fragment>
  );
};

export default ThankYou;
