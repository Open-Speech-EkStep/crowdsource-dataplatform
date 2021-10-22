import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import CompareLanguages from 'components/CompareLanguages';
import ContributionDetails from 'components/ContributionDetails';
import SocialShareIcons from 'components/SocialShareIcons';
import TwoColumn from 'components/TwoColumn';
import TyTargetProgress from 'components/TyTargetProgress';
import {
  CONTRIBUTION_MAPPING,
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { sourcePageConstants } from 'constants/pageRouteConstants';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';

import styles from './ThankYou.module.scss';

const ShareOn = () => (
  <div
    className={`${styles.socialShare} d-inline-flex align-items-center border border-1 border-primary px-4`}
  >
    <span className="me-3">Share on</span>
    <SocialShareIcons />
  </div>
);

// const YourBadge = () => (
//   <div className="text-center">
//     <h5 className="fw-light">Your Badge</h5>
//     <div className={`${styles.badgeBg} p-3 mt-3`}>
//       <Image
//         src="/images/en/badges/en_bolo_bronze_contribute.svg"
//         width="94"
//         height="120"
//         alt="Bronze Badge en"
//       />
//     </div>
//     <span className="d-flex justify-content-center mt-3 display-5 font-family-rowdies fw-light">
//       You are a <span className="text-strong-warning ms-1">Bronze contributor</span>
//     </span>
//   </div>
// );

interface ThankYouProps {
  initiative: Initiative;
}

const ThankYou = ({ initiative }: ThankYouProps) => {
  const route = useRouter();
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  return (
    <div className={`${styles.root} mx-auto`} data-testid="ThankYou">
      <h2 className="text-center">Contribute to your language!</h2>
      <section className="mt-8">
        <TyTargetProgress
          initiative={INITIATIVES_MAPPING.suno}
          initiativeType={INITIATIVES_MEDIA_MAPPING.suno}
          source={sourcePageConstants[route.asPath] || ''}
          language={contributionLanguage ?? ''}
        />
      </section>
      {/* <section className="mt-8">
        <BadgeEarned />
        <div className="mt-8 mt-md-9">
          <TwoColumn
            left={
              <div className="d-md-flex text-center text-md-start h-100 align-items-md-center">
                <h4>Participate to see Hindi in top 3</h4>
              </div>
            }
            right={<CompareLanguages />}
          />
        </div>
      </section> */}
      <section className="mt-8">
        <ContributionDetails
          top={
            <TwoColumn
              left={
                <div className="d-md-flex text-center text-md-start h-100 align-items-md-center">
                  <h4>Participate to see {contributionLanguage} in top 3</h4>
                </div>
              }
              right={
                <CompareLanguages
                  initiative={initiative}
                  graphLabel={t('contributionGraphYLabel1')}
                  dataBindigValue={CONTRIBUTION_MAPPING[route.asPath] || ''}
                />
              }
            />
          }
          bottom={<ShareOn />}
        />
      </section>
      {/* <section className="mt-8">
        <ContributionDetails
          top={<TwoColumn left={<YourBadge />} right={<CompareLanguages />} />}
          bottom={<ShareOn />}
        />
      </section> */}
    </div>
  );
};

export default ThankYou;
