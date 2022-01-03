import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import nodeConfig from 'constants/nodeConfig';
import routePaths from 'constants/routePaths';
import type { Initiative } from 'types/Initiatives';

import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsPorpsInterface {
  initiative: Initiative;
  path: string;
}

const Breadcrumbs = ({ initiative, path }: BreadcrumbsPorpsInterface) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  const initiativeName = `${t(initiative)} ${t('initiativeTextSuffix')}`;

  return (
    <div className={`${styles.root} d-flex align-items-center`} data-testid="Breadcrumbs">
      <Link href={routePaths[`${initiative}InitiativeHome`]}>
        <a className={styles.link}>
          <div className="d-flex align-items-center cursor-pointer">
            <div className={`${styles.icon} d-flex`}>
              <ImageBasePath
                src={`/images/${nodeConfig.brand}/${currentLocale}/logos/${currentLocale}-${INITIATIVES_MAPPING[initiative]}InitiativeLogo.svg`}
                alt={t(`${initiative}Logo`)}
                width="47"
                height="42"
              />
            </div>
            <span className={`${styles.initiative} d-none d-md-block ms-1 ms-md-3 font-family-rowdies`}>
              {initiativeName}
            </span>
          </div>
        </a>
      </Link>
      <span className="mx-1 mx-md-3 text-primary-40">/</span>
      <span className="display-5">{t(path)}</span>
    </div>
  );
};

export default Breadcrumbs;
