import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ImageBasePath from 'components/ImageBasePath';
import TriColorBorder from 'components/TriColorBorder';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import nodeConfig from 'constants/nodeConfig';
import type { Initiative } from 'types/Initiatives';
import { isLanguageImageAvailable } from 'utils/utils';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  initiative: Initiative;
}

const PageHeader = ({ initiative }: PageHeaderProps) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  const language = isLanguageImageAvailable(currentLocale);

  return (
    <div data-testid="PageHeader" className={styles.root}>
      <div className={`${styles.bg} pb-2 pb-md-5`}>
        <div className="d-flex">
          <div className={`${styles.pageHeaderImg} d-flex align-items-center`}>
            <ImageBasePath
              src={`/images/${nodeConfig.brand}/${language}/logos/${language}-${INITIATIVES_MAPPING[initiative]}InitiativeLogo.svg`}
              alt={t(`${initiative}Logo`)}
              width="84"
              height="76"
            />
          </div>
          <div className="d-flex flex-column justify-content-center ms-4 ms-md-6 w-100">
            <h1 className={`${styles.pageHeading} mb-0`}>
              {t(initiative)} {t('initiativeTextSuffix')}
            </h1>
            <p className={`${styles.pageHeaderText} mb-0 d-none d-md-block`}>
              {t(`${INITIATIVES_MAPPING[initiative]}SloganText`)}
            </p>
          </div>
        </div>
        <p className={`${styles.pageHeaderTextMobile} mt-4 d-md-none mb-0`}>
          {t(`${INITIATIVES_MAPPING[initiative]}SloganText`)}
        </p>
      </div>
      <TriColorBorder />
    </div>
  );
};

export default PageHeader;
