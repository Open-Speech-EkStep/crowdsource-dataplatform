// import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';
import { capitalizeFirstLetter } from 'utils/utils';

import styles from './ContributeMore.module.scss';

interface ContributeMoreProps {
  initiative: string;
  source: string;
  url: string;
  nextMileStone: number;
  contributionCount: number;
  nextBadgeType: string;
  pageMediaTypeStr: string;
}

const ContributeMore = ({
  initiative,
  source,
  nextMileStone,
  url,
  contributionCount,
  nextBadgeType,
  pageMediaTypeStr,
}: ContributeMoreProps) => {
  // const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div
      className={`${styles.root} d-flex align-items-md-center flex-column flex-md-row mx-auto justify-content-md-between p-5 py-md-4 px-md-5 bg-light text-center text-md-start`}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
          <Image
            src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_bronze_${source}.svg`}
            width="48"
            height="60"
            alt={`Bronze Badge`}
          />
        </div>
        <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
          <Image
            src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_silver_${source}.svg`}
            width="48"
            height="60"
            alt={`Silver Badge`}
          />
        </div>
        <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
          <Image
            src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_gold_${source}.svg`}
            width="48"
            height="60"
            alt={`Bronze Badge`}
          />
        </div>
        <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
          <Image
            src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_platinum_${source}.svg`}
            width="48"
            height="60"
            alt={`Bronze Badge`}
          />
        </div>
        <p className="mt-3 mt-md-0 ms-md-3 display-4">
          {capitalizeFirstLetter(source)}{' '}
          <strong>
            {nextMileStone - contributionCount} {pageMediaTypeStr}
          </strong>{' '}
          to earn your {nextBadgeType} Badge.
        </p>
        <div className={`${styles.disabled} d-flex justify-content-center mt-4 mt-md-0`}>
          <div className={`${styles.medal}  d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_bronze_${source}.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_silver_${source}.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_gold_${source}.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/${currentLocale}/badges/${currentLocale}_${initiative}_platinum_${source}.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge`}
            />
          </div>
        </div>
        <Link href={routePaths.badges}>
          <a className="mt-7 mt-md-0 display-5 ms-md-3 flex-shrink-0">
            <b>Know More</b>
          </a>
        </Link>
      </div>
      <Link href={url}>
        <Button className="mt-8 mt-md-0 ms-3">{capitalizeFirstLetter(source)} More</Button>
      </Link>
    </div>
  );
};

export default ContributeMore;
