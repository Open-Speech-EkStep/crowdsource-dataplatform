import React from 'react';

import { Trans, useTranslation } from 'next-i18next';

import Button from 'components/Button';
import ContributionDetails from 'components/ContributionDetails';
import ImageBasePath from 'components/ImageBasePath';
import TwoColumn from 'components/TwoColumn';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import nodeConfig from 'constants/nodeConfig';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import { capitalizeFirstLetter, downloadBadge, isLanguageImageAvailable } from 'utils/utils';

import ShareOn from './ShareOn';
import styles from './ThankYou.module.scss';

interface DownloadBadgeProps {
  initiative: Initiative;
  badgeType: string;
  source: string;
  winningBadge?: any;
  language?: string;
  rank?: Number;
}

const BadgeImage = ({ initiative, badgeType, source }: DownloadBadgeProps) => {
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  const language = isLanguageImageAvailable(currentContributionAlias);

  return (
    <div className={`${styles.medal} mx-auto`}>
      <ImageBasePath
        src={`/images/${nodeConfig.brand}/${language}/badges/${language}_${INITIATIVES_MAPPING[initiative]}_${badgeType}_${source}.svg`}
        width="140"
        height="180"
        alt={`Bronze Badge english`}
      />
    </div>
  );
};

const DownloadAndShare = ({
  initiative,
  badgeType,
  source,
  winningBadge,
  language,
  rank = 0,
}: DownloadBadgeProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  const languagePrefix = isLanguageImageAvailable(currentContributionAlias);

  const download = (badgeType: string, badgeId: string) => {
    downloadBadge(languagePrefix, initiative, source, badgeType, badgeId);
  };

  return (
    <div className="d-flex flex-column align-items-center flex-md-row align-items-md-baseline">
      <Button variant="normal" onClick={() => download(badgeType, winningBadge.generated_badge_id)}>
        <a
          className={`${styles.download} d-inline-flex align-items-center border border-1 border-primary px-4`}
        >
          {t('download')}
          <span className="d-flex ms-2">
            <ImageBasePath src="/images/download_icon.svg" width="12" height="15" alt="download-image" />
          </span>
        </a>
      </Button>

      <div className="mt-4 mt-md-0 ms-md-4">
        <ShareOn
          rank={rank}
          language={`${language ? t(language) : contributionLanguage}`}
          initiativeName={`${t(initiative)} ${t('initiativeTextSuffix')}`}
        />
      </div>
    </div>
  );
};

interface BadgeEarnedProps {
  initiative: Initiative;
  badgeType: string;
  contributionCount: number;
  language: string;
  source: string;
  winningBadge: any;
  rank: Number;
}

const BadgeEarned = ({
  initiative,
  badgeType,
  contributionCount,
  language,
  source,
  winningBadge,
  rank,
}: BadgeEarnedProps) => {
  const { t } = useTranslation();

  const subHeaderKey = `${INITIATIVES_MAPPING[initiative]}${capitalizeFirstLetter(
    source
  )}EarnedBadgeSubheader`;

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
                  i18nKey={`${INITIATIVES_MAPPING[initiative]}BadgeEarnedText`}
                  defaults={`${INITIATIVES_MAPPING[initiative]}BadgeEarnedText`}
                  values={{
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
          language={language}
          rank={rank}
        />
      }
    />
  );
};

export default BadgeEarned;
