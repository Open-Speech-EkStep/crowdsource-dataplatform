// import { useTranslation } from 'next-i18next';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import Link from 'components/Link';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { pageSourceConstants } from 'constants/pageRouteConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';
import { capitalizeFirstLetter, downloadBadge } from 'utils/utils';

import styles from './ContributeMore.module.scss';

interface ContributeMoreProps {
  initiative: string;
  source: string;
  url: string;
  nextMileStone: number;
  contributionCount: number;
  nextBadgeType: string;
  pageMediaTypeStr: string;
  badges: Array<any> | undefined;
  isTopLanguage?: string;
  badgeType?: string;
}

const ContributeMore = ({
  initiative,
  source,
  nextMileStone,
  url,
  contributionCount,
  nextBadgeType,
  pageMediaTypeStr,
  badges,
  isTopLanguage,
  badgeType,
}: ContributeMoreProps) => {
  const { t } = useTranslation();
  const route = useRouter();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const currentContributionAlias = LOCALE_LANGUAGES[contributionLanguage ?? ''];

  const download = (badgeType: string, badgeId: string) => {
    downloadBadge(currentContributionAlias, initiative, source, badgeType, badgeId);
  };

  return (
    <div
      className={`${styles.root} d-flex align-items-md-center flex-column flex-md-row mx-auto justify-content-md-between p-5 py-md-4 px-md-5 bg-light text-center text-md-start`}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        {badges?.map((item, index) => (
          <div
            key={index}
            title={`Download ${item.grade} Badge`}
            className={`${styles.medal} d-flex mx-2 flex-shrink-0`}
          >
            <Image
              onClick={() => download(item.grade.toLowerCase(), item.generated_badge_id)}
              src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_${item.grade.toLowerCase()}_${source}.svg`}
              width="48"
              height="60"
              alt={`${item.grade.toLowerCase()}Download`}
            />
          </div>
        ))}
        {badgeType === 'Platinum' ? (
          <p>
            {t('afterPlatinumBadgeText', {
              source: capitalizeFirstLetter(pageSourceConstants[route.asPath]),
              value: isTopLanguage,
            })}
          </p>
        ) : (
          <p className="mt-3 mt-md-0 ms-md-3 display-4">
            <Trans
              i18nKey="remainingContributionText"
              defaults="remainingContributionText"
              values={{
                source: capitalizeFirstLetter(source),
                count: nextMileStone - contributionCount,
                sourceType: pageMediaTypeStr,
                nextBadgeType: nextBadgeType,
              }}
              components={{ strong: <strong /> }}
            />
          </p>
        )}

        <div className={`${styles.disabled} d-flex justify-content-center mt-4 mt-md-0`}>
          {!badges ||
          badges.length === 0 ||
          (badges && badges.length !== 0 && badges[0].grade !== 'Bronze') ? (
            <div className={`${styles.medal}  d-flex mx-2 flex-shrink-0`}>
              <Image
                src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_bronze_${source}.svg`}
                width="48"
                height="60"
                alt={`Bronze Badge`}
              />
            </div>
          ) : null}
          {!badges ||
          badges.length === 0 ||
          (badges && badges.length !== 0 && badges[1]?.grade !== 'Silver') ? (
            <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
              <Image
                src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_silver_${source}.svg`}
                width="48"
                height="60"
                alt={`Silver Badge`}
              />
            </div>
          ) : null}
          {!badges ||
          badges.length === 0 ||
          (badges && badges.length !== 0 && badges[2]?.grade !== 'Gold') ? (
            <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
              <Image
                src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_gold_${source}.svg`}
                width="48"
                height="60"
                alt={`Gold Badge`}
              />
            </div>
          ) : null}
          {!badges ||
          badges.length === 0 ||
          (badges && badges.length !== 0 && badges[3]?.grade !== 'Platinum') ? (
            <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
              <Image
                src={`/images/${currentContributionAlias}/badges/${currentContributionAlias}_${initiative}_platinum_${source}.svg`}
                width="48"
                height="60"
                alt={`Platinum Badge`}
              />
            </div>
          ) : null}
        </div>
        <Link href={routePaths.badges}>
          <a className="mt-7 mt-md-0 display-5 ms-md-3 flex-shrink-0">
            <b>{t('knowMore')}</b>
          </a>
        </Link>
      </div>
      <Link href={url}>
        <Button className="mt-8 mt-md-0 ms-3">
          {t('moreBtn', { source: capitalizeFirstLetter(source) })}
        </Button>
      </Link>
    </div>
  );
};

export default ContributeMore;
