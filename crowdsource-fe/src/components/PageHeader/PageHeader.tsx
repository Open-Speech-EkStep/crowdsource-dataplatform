import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TriColorBorder from 'components/TriColorBorder';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  initiative: string;
}

const PageHeader = ({ initiative }: PageHeaderProps) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div data-testid="PageHeader" className={styles.root}>
      <div className={`${styles.bg} pb-2 pb-md-5`}>
        <div className="d-flex">
          <div className={`${styles.pageHeaderImg} d-flex align-items-center`}>
            <Image
              src={`/images/${currentLocale}/logos/${currentLocale}-${initiative}IndiaLogo.svg`}
              alt={t(`${initiative}Logo`)}
              width="84"
              height="76"
            />
          </div>
          <div className="d-flex flex-column justify-content-center ms-4 ms-md-6">
            <h1 className={`${styles.pageHeading} mb-0`}>
              {t(initiative)} {t('india')}
            </h1>
            <p className={`${styles.pageHeaderText} mb-0 d-none d-md-block`}>
              {t(`${initiative}SloganText`)}
            </p>
          </div>
        </div>
        <p className="mt-4 d-md-none mb-0">{t(`${initiative}SloganText`)}</p>
      </div>
      <TriColorBorder />
    </div>
  );
};

export default PageHeader;