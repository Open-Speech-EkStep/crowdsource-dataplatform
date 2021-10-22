import Image from 'next/image';

import Button from 'components/Button';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './ContributeMore.module.scss';

const ContributeMore = () => {
  return (
    <div
      className={`${styles.root} d-flex align-items-md-center flex-column flex-md-row mx-auto justify-content-md-between p-5 py-md-4 px-md-5 bg-light text-center text-md-start`}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <p className="mt-3 mt-md-0 ms-md-3 display-4">
          Contribute <strong>45 sentence(s)</strong> to earn your Silver Badge.
        </p>
        <div className={`${styles.disabled} d-flex justify-content-center mt-4 mt-md-0`}>
          <div className={`${styles.medal}  d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/en/badges/en_bolo_bronze_contribute.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge english`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/en/badges/en_bolo_bronze_contribute.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge english`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/en/badges/en_bolo_bronze_contribute.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge english`}
            />
          </div>
          <div className={`${styles.medal} d-flex mx-2 flex-shrink-0`}>
            <Image
              src={`/images/en/badges/en_bolo_bronze_contribute.svg`}
              width="48"
              height="60"
              alt={`Bronze Badge english`}
            />
          </div>
        </div>
        <Link href={routePaths.badges}>
          <a className="mt-7 mt-md-0 display-5 ms-md-3 flex-shrink-0">
            <b>Know More</b>
          </a>
        </Link>
      </div>
      <Button className="mt-8 mt-md-0 ms-3">Contribute More</Button>
    </div>
  );
};

export default ContributeMore;
