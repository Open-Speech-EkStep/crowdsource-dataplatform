import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';

import styles from './ContributionStats.module.scss';
import useFetch from 'hooks/useFetch';
import apiPaths from 'constants/apiPaths';

const SUNO = 'suno';
const BOLO = 'bolo';
const LIKHO = 'likho';
const DEKHO = 'dekho';
const initiativeOrder = [SUNO, BOLO, LIKHO, DEKHO];
const typeMap: Record<string, string> = {
  suno: 'asr',
  bolo: 'text',
  likho: 'parallel',
  dekho: 'ocr',
};

const ContributionStats = () => {
  const { t } = useTranslation();

  const { data: participationStats, error } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.participationStats
  );

  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  initiativeOrder.forEach(initiative => {
    const stat =
      !participationStats || error
        ? null
        : participationStats.filter(stats => stats['type'] === typeMap[initiative])[0]?.count || '0';

    statsContents.push({ id: initiative, stat: stat, label: `${t(initiative)} ${t('india')}` });
  });

  return (
    <div>
      <header className="d-flex flex-column align-items-center flex-md-row justify-content-md-between">
        <h1 className={`${styles.header} mb-0`}>{t('totalParticipation')}</h1>
      </header>
      <div className="mt-4 mt-md-5">
        <Stats contents={statsContents} />
      </div>
    </div>
  );
};

export default ContributionStats;
