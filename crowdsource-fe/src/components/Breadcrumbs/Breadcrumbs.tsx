import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div className="d-flex align-items-center" data-testid="Breadcrumbs">
      <Link href={routePaths.sunoIndiaHome}>
        <div className="d-flex align-items-center">
          <div className={`${styles.icon} d-flex`}>
            <Image
              src={`/images/${currentLocale}/logos/${currentLocale}-sunoIndiaLogo.svg`}
              alt={t(`sunoLogo`)}
              width="47"
              height="42"
            />
          </div>
          <span className={`${styles.initiative} ms-1 ms-md-3 font-family-rowdies`}>
            Suno <span className="text-warning">India</span>
          </span>
        </div>
      </Link>
      <span className="mx-1 mx-md-3 text-primary-40">/</span>
      <span className="display-5">Transcribe</span>
    </div>
  );
};

export default Breadcrumbs;
