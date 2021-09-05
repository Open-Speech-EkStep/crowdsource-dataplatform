import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';

import styles from './ContributionStats.module.scss';

const ContributionStats = () => {
  const { t } = useTranslation();

  return (
    <div>
      <header className="d-flex flex-column align-items-center flex-md-row justify-content-md-between">
        <h1 className={`${styles.header} mb-0`}>{t('totalParticipation')}</h1>
      </header>
      <div className="mt-4 mt-md-5">
        <Stats />
      </div>
    </div>
  );
};

export default ContributionStats;
