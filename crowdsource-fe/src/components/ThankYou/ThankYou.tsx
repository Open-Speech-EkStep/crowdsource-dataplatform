import React, { Fragment, useEffect, useState } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import CompareLanguages from 'components/CompareLanguages';
import ContributeMore from 'components/ContributeMore';
import ContributionDetails from 'components/ContributionDetails';
import TwoColumn from 'components/TwoColumn';
import TyTargetProgress from 'components/TyTargetProgress';
import apiPaths from 'constants/apiPaths';
import {
  CONTRIBUTION_MAPPING,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
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

import { BadgeEarned, ShareOn } from '.';

const YourBadge = (props: any) => {
  const route = useRouter();
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  return (
    <div className="text-center">
      <h5 className="fw-light mb-3">{t('yourBadge')}</h5>
      <div className={`${styles.badgeBg} p-3`}>
        <Image
          src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${
            props.initiative
          }_${props.badgeType.toLowerCase()}_${props.source}.svg`}
          width="94"
          height="120"
          alt={`${props.badgeType} badge`}
        />
      </div>
      <span className="d-flex justify-content-center mt-3 display-5 font-family-rowdies fw-light">
        <Trans
          i18nKey={`${pageSourceConstants4[route.asPath]}Acheived`}
          defaults="contributorAcheived"
          values={{
            badgeType: capitalizeFirstLetter(t(props.badgeType.toLowerCase())),
            sourceType: capitalizeFirstLetter(t(`${pageSourceConstants4[route.asPath]}`)),
          }}
          components={{ span: <span className="text-strong-warning ms-1 me-1" /> }}
        />
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

  const [mode, setMode] = useState<string>('see');

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
        {rewardData?.badges && rewardData?.badges.length === 0 && rewardData?.contributionCount === 0 && (
          <h2 className="text-center">{t('contributeYourLanguage')}</h2>
        )}
        {!rewardData?.isNewBadge && rewardData?.contributionCount !== 0 && (
          <h2 className="text-center">
            <Trans
              i18nKey={`${pageSourceConstants2[route.asPath]}Message`}
              defaults="contributedMessage"
              values={{
                count: rewardData?.contributionCount,
                sourceType: (t(`${pageMediaTypeConstants[route.asPath]}`) as string).toLowerCase(),
              }}
              components={{ span: <span className={styles.count} /> }}
            />{' '}
            !
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
              badgeType={rewardData?.currentBadgeType.toLowerCase()}
              contributionCount={rewardData?.contributionCount}
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
                      {t(`${mode}ParticipationText`, {
                        language: t(`${contributionLanguage?.toLowerCase()}`),
                      })}
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
                    dataBindigValue={CONTRIBUTION_MAPPING[route.asPath]}
                    isTopLanguage={setMode}
                    graphHeading={t(`${mode}ParticipationText`, {
                      language: t(`${contributionLanguage?.toLowerCase()}`),
                    })}
                    showHeader={false}
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
                        {t(`${mode}ParticipationText`, {
                          language: t(`${contributionLanguage?.toLowerCase()}`),
                        })}
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
                      dataBindigValue={CONTRIBUTION_MAPPING[route.asPath]}
                      isTopLanguage={setMode}
                      graphHeading={t(`${mode}ParticipationText`, {
                        language: t(`${contributionLanguage?.toLowerCase()}`),
                      })}
                      showHeader={false}
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
                      source={pageSourceConstants[route.asPath]}
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
                      dataBindigValue={CONTRIBUTION_MAPPING[route.asPath]}
                      isTopLanguage={setMode}
                      graphHeading={t(`${mode}ParticipationText`, {
                        language: t(`${contributionLanguage?.toLowerCase()}`),
                      })}
                      showHeader={true}
                    />
                  }
                />
              }
              bottom={<ShareOn />}
            />
          </section>
        )}
      </div>
      <section className={`${styles.bar} mt-8 mt-md-12`}>
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
          isTopLanguage={mode}
          badgeType={rewardData?.currentBadgeType}
        />
      </section>
    </Fragment>
  );
};

export default ThankYou;
