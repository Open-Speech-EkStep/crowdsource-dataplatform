import React from 'react';

import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { MEDALS } from 'constants/medalConstants';
import nodeConfig from 'constants/nodeConfig';
import { pageSourceConstants } from 'constants/pageRouteConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import { capitalizeFirstLetter, downloadBadge, isLanguageImageAvailable } from 'utils/utils';

import styles from './ContributeMore.module.scss';

interface ContributeMoreProps {
  initiative: Initiative;
  source: string;
  url: string;
  nextMileStone: number;
  contributionCount: number;
  nextBadgeType: string;
  badges: Array<any> | undefined;
  isTopLanguage?: string;
  badgeType?: string;
}

const badgeArray = [
  {
    id: 1,
    type: 'Bronze',
  },
  {
    id: 2,
    type: 'Silver',
  },
  {
    id: 3,
    type: 'Gold',
  },
  {
    id: 4,
    type: 'Platinum',
  },
];

const ContributeMore = ({
  initiative,
  source,
  nextMileStone,
  url,
  contributionCount,
  nextBadgeType,
  badges,
  isTopLanguage,
  badgeType,
}: ContributeMoreProps) => {
  const { t } = useTranslation();
  const route = useRouter();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  const language = isLanguageImageAvailable(currentContributionAlias);

  const download = (badgeType: string, badgeId: string) => {
    downloadBadge(language, initiative, source, badgeType, badgeId);
  };

  return (
    <div
      className={`${styles.root} d-flex align-items-md-center flex-column flex-md-row mx-auto justify-content-md-between p-5 py-md-4 px-md-5 bg-light text-center text-md-start`}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <div className="d-flex justify-content-center">
          {badges?.map((item, index) => (
            <Button
              variant="normal"
              key={index}
              title={`Download ${item.grade} Badge`}
              onClick={() => download(item.grade.toLowerCase(), item.generated_badge_id)}
              className={`${styles.medal} d-flex mx-2 flex-shrink-0`}
            >
              <ImageBasePath
                src={`/images/${nodeConfig.brand}/${language}/badges/${language}_${
                  INITIATIVES_MAPPING[initiative]
                }_${item.grade.toLowerCase()}_${source}.svg`}
                width="48"
                height="60"
                alt={`${item.grade.toLowerCase()}Download`}
              />
            </Button>
          ))}
        </div>
        {badgeType === 'Platinum' ? (
          <p className={`${styles.text} mt-3 mt-md-0 ms-md-3 display-4`}>
            {t(`${isTopLanguage}${capitalizeFirstLetter(pageSourceConstants[route.asPath])}Text`, {})}
          </p>
        ) : (
          <p className={`${styles.text} mt-3 mt-md-0 ms-md-3 display-4`}>
            <Trans
              i18nKey={`${INITIATIVES_MAPPING[initiative]}${capitalizeFirstLetter(source)}RemainingText`}
              defaults={`${INITIATIVES_MAPPING[initiative]}${capitalizeFirstLetter(source)}RemainingText`}
              values={{
                count: nextMileStone - contributionCount,
                nextBadgeType: capitalizeFirstLetter(t(nextBadgeType.toLowerCase())),
              }}
              components={{ strong: <strong /> }}
            />
          </p>
        )}

        {badges && badges.length !== 4 && (
          <div className={`${styles.disabled} d-flex justify-content-center mt-4 mt-md-0 mb-3 mb-md-0`}>
            {badgeArray.map((item, index) => {
              return !badges ||
                badges.length === 0 ||
                !badges[index] ||
                (badges && badges.length !== 0 && badges[index] && badges[index].grade !== item.type) ? (
                <div
                  key={index}
                  className={`${styles.medal} ${
                    index === badges.length ? styles.upcomingBadge : styles.otherBadges
                  }  d-flex mx-2 flex-shrink-0`}
                >
                  <ImageBasePath
                    src={`/images/${nodeConfig.brand}/${language}/badges/${language}_${
                      INITIATIVES_MAPPING[initiative]
                    }_${item.type.toLowerCase()}_${source}.svg`}
                    width="48"
                    height="60"
                    alt={`Bronze Badge`}
                  />
                </div>
              ) : null;
            })}
          </div>
        )}
        <Link
          href={`${routePaths.badgeDetail}?initiative=${INITIATIVES_MEDIA_MAPPING[initiative]}&language=${contributionLanguage}&source=${source}&badge=${MEDALS[0]}`}
        >
          <a className={`${styles.text} mt-4 mt-md-0 display-5 ms-md-3 flex-shrink-0`}>
            <b>{t('knowMore')}</b>
          </a>
        </Link>
      </div>
      <Link href={url}>
        <Button className="mt-8 mt-md-0 ms-md-3">{t(`${source}More`)}</Button>
      </Link>
    </div>
  );
};

export default ContributeMore;
