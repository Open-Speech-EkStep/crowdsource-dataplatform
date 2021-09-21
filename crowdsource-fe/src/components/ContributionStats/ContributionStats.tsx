import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING, INITIATIVE_CUMULATIVE_VALUE } from 'constants/initiativeConstants';
import useFetch from 'hooks/useFetch';
import type { CumulativeCountModel } from 'interface';
import { convertIntoHrsFormat, formatTime, isSunoOrBoloInitiative } from 'utils/utils';

import styles from './ContributionStats.module.scss';

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

interface ContributionStatsProps {
  initiativeMedia?: string;
}

const ContributionStats = (props: ContributionStatsProps) => {
  const { t } = useTranslation();

  const { data: participationStats, error } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.participationStats
  );

  const { data: cumulativeCountData } = useFetch<Array<CumulativeCountModel>>(apiPaths.cumulativeCount);
  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  const setStatsForInitiatives = () => {
    const initiativeData: any =
      cumulativeCountData && cumulativeCountData.find(item => item.type === props.initiativeMedia);
    if (initiativeData) {
      initiativeData.peopleParticipated = participationStats?.find(
        item => item.type === props.initiativeMedia
      )?.count;
      INITIATIVE_CUMULATIVE_VALUE.suno.forEach((ele, index) => {
        let statValue;
        if (isSunoOrBoloInitiative(INITIATIVES_MAPPING.suno) && ele.isFormat === 'true') {
          const { hours, minutes, seconds } = convertIntoHrsFormat(
            Number(initiativeData[Object.values(ele)[0]!]) * 60 * 60
          );
          statValue = formatTime(hours, minutes, seconds);
        } else {
          statValue = initiativeData[Object.values(ele)[0]!];
        }
        statsContents.push({
          id: index.toString(),
          stat: initiativeData && statValue,
          label: `${t(Object.keys(ele)[0])}`,
        });
      });
    }
  };

  if (!props.initiativeMedia) {
    initiativeOrder.forEach(initiative => {
      const stat =
        !participationStats || error
          ? null
          : participationStats.filter(stats => stats['type'] === typeMap[initiative])[0]?.count || '0';

      statsContents.push({ id: initiative, stat: stat, label: `${t(initiative)} ${t('india')}` });
    });
  } else {
    setStatsForInitiatives();
  }

  return (
    <div data-testid="ContributionStats">
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
