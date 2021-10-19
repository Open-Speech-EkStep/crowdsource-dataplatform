import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsPorpsInterface {
  initiative: string;
  path: string;
}

const Breadcrumbs = ({ initiative, path }: BreadcrumbsPorpsInterface) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  const initiativeName = `${t(initiative)} ${t('india')}`;

  return (
    <div className="d-flex align-items-center" data-testid="Breadcrumbs">
      <Link href={`/${currentLocale}${routePaths.sunoIndiaHome}`}>
        <div className="d-flex align-items-center">
          <div className={`${styles.icon} d-flex`}>
            <Image
              src={`/images/${currentLocale}/logos/${currentLocale}-sunoIndiaLogo.svg`}
              alt={t(`sunoLogo`)}
              width="47"
              height="42"
            />
          </div>
          <span className={`${styles.initiative} d-none d-md-block ms-1 ms-md-3 font-family-rowdies`}>
            {initiativeName}
          </span>
        </div>
      </Link>
      <span className="mx-1 mx-md-3 text-primary-40">/</span>
      <span className="display-5">{t(path)}</span>
    </div>
  );
};

export default Breadcrumbs;
