import React from 'react';

import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';

import Button from 'components/Button';
import ContributionDetails from 'components/ContributionDetails';
import TwoColumn from 'components/TwoColumn';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import { capitalizeFirstLetter, downloadBadge } from 'utils/utils';

import ShareOn from './ShareOn';
import styles from './ThankYou.module.scss';

interface DownloadBadgeProps {
  initiative: string;
  badgeType: string;
  source: string;
  winningBadge?: any;
}

const BadgeImage = ({ initiative, badgeType, source }: DownloadBadgeProps) => {
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  return (
    <div className={`${styles.medal} mx-auto`}>
      <Image
        src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_${badgeType}_${source}.svg`}
        width="140"
        height="180"
        alt={`Bronze Badge english`}
      />
    </div>
  );
};

const DownloadAndShare = ({ initiative, badgeType, source, winningBadge }: DownloadBadgeProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const download = (badgeType: string, badgeId: string) => {
    downloadBadge(LOCALE_LANGUAGES[contributionLanguage ?? ''], initiative, source, badgeType, badgeId);
  };

  return (
    <div className="d-flex flex-column align-items-center flex-md-row align-items-md-baseline">
      <Button variant="normal" onClick={() => download(badgeType, winningBadge.generated_badge_id)}>
        <a
          className={`${styles.download} d-inline-flex align-items-center border border-1 border-primary px-4`}
        >
          {t('download')}
          <span className="d-flex ms-2">
            <Image src="/images/download_icon.svg" width="12" height="15" alt="download-image" />
          </span>
        </a>
      </Button>

      <div className="mt-4 mt-md-0 ms-md-4">
        <ShareOn />
      </div>
    </div>
  );
};

interface BadgeEarnedProps {
  initiative: Initiative;
  badgeType: string;
  contributionCount: number;
  pageMediaTypeStr: string;
  language: string;
  source: string;
  winningBadge: any;
}

const BadgeEarned = ({
  initiative,
  badgeType,
  contributionCount,
  pageMediaTypeStr,
  language,
  source,
  winningBadge,
}: BadgeEarnedProps) => {
  const { t } = useTranslation();

  const initiativeName = `${t(INITIATIVES_MAPPING[initiative])} ${t('india')}`;
  const subHeaderKey =
    source === 'contribute'
      ? `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(source)}EarnedBadgeSubheader`
      : `${source}EarnedBadgeSubheader`;

  return (
    <ContributionDetails
      top={
        <TwoColumn
          left={
            <BadgeImage
              initiative={initiative}
              badgeType={badgeType}
              source={source}
              winningBadge={winningBadge}
            />
          }
          right={
            <div className="text-center text-md-start">
              <h4 className="px-8 px-md-0">
                <Trans
                  i18nKey="badgeEarnedText"
                  defaults="badgeEarnedText"
                  values={{
                    initiativeName: initiativeName,
                    badge: capitalizeFirstLetter(t(badgeType)),
                  }}
                  components={{ span: <span className="text-strong-warning" /> }}
                />
              </h4>
              <p className="display-3 mt-5 mt-6">
                <Trans
                  i18nKey={subHeaderKey}
                  defaults={subHeaderKey}
                  values={{
                    count: contributionCount,
                    sourceType: t(pageMediaTypeStr),
                    language: language,
                  }}
                  components={{ strong: <strong /> }}
                />
              </p>
            </div>
          }
          withSep={false}
        />
      }
      bottom={
        <DownloadAndShare
          initiative={initiative}
          badgeType={badgeType}
          source={source}
          winningBadge={winningBadge}
        />
      }
    />
  );
};

export default BadgeEarned;
