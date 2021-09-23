import { useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';

import { useTranslation } from 'next-i18next';
import Form from 'react-bootstrap/Form';

import { BarChart } from 'components/Charts';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
// import useLocalStorage from 'hooks/useLocalStorage';
import type { TopLanguagesByHours, TopLanguagesBySpeaker } from 'types/Chart';

import styles from './ContributionTracker.module.scss';

// import localStorageConstants from 'constants/localStorageConstants';

type ChartFilterType = 'byDuration' | 'bySpeaker';

// const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

// const mapChartData = (data: any, key: string) => {
//   if (contributionLanguage && data && data.length) {
//     const contributedLanguageHours = data.find(
//       (item: any) => item.language === contributionLanguage && item.type === 'asr'
//     );
//     let topLanguages = [];
//     const topLanguageArray = [];
//     console.log(contributedLanguageHours);
//     if (contributedLanguageHours && contributedLanguageHours.language != data[0].language) {
//       topLanguageArray.push(contributedLanguageHours);
//       let remainingLanguage = data.filter((item: any) => item?.language !== contributionLanguage);
//       remainingLanguage = remainingLanguage.sort((a: any, b: any) =>
//         Number(a[key]) > Number(b[key]) ? -1 : 1
//       );
//       topLanguages = remainingLanguage.slice(0, 3);
//     }
//     console.log(topLanguageArray.concat(topLanguages).reverse());
//     return topLanguageArray.concat(topLanguages).reverse();
//   }
// };

const getTopLanguagesByHoursChartData = (topLanguagesByHours?: TopLanguagesByHours[]) => {
  return (
    topLanguagesByHours?.map(topLanguageByHours => ({
      category: topLanguageByHours.language,
      value: topLanguageByHours.total_contributions,
    })) ?? []
  );
};

const getTopLanguagesBySpeakerChartData = (topLanguagesBySpeaker?: TopLanguagesBySpeaker[]) => {
  return (
    topLanguagesBySpeaker?.map(topLanguagesBySpeaker => ({
      category: topLanguagesBySpeaker.language,
      value: topLanguagesBySpeaker.total_speakers,
    })) ?? []
  );
};

const ContributionTracker = () => {
  const { t } = useTranslation();
  const [chartFilterType, setChartFilterType] = useState<ChartFilterType>('byDuration');

  const { data: topLanguagesByHoursData } = useFetch<Array<TopLanguagesByHours>>(
    apiPaths.topLanguagesByHoursContributed
  );

  const { data: topLanguagesBySpeakerData } = useFetch<Array<TopLanguagesBySpeaker>>(
    apiPaths.topLanguagesBySpeakerContributions
  );

  const chartLegendDeails = useMemo(
    () => ({
      colors: ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'],
      xAxisLabel: t('Month'),
      yAxisLabel: t('Contribution (in hours)'),
    }),
    [t]
  );

  const barChartData = useMemo(
    () => ({
      data:
        chartFilterType === 'byDuration'
          ? getTopLanguagesByHoursChartData(topLanguagesByHoursData)
          : getTopLanguagesBySpeakerChartData(topLanguagesBySpeakerData),
      ...chartLegendDeails,
    }),
    [chartFilterType, chartLegendDeails, topLanguagesByHoursData, topLanguagesBySpeakerData]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChartFilterType(e.target.value as ChartFilterType);
  };

  return barChartData.data.length ? (
    <div className="" data-testid="ContributionTracker">
      <Form.Group className="py-3" controlId="recommended">
        <Form.Label className="mb-1 w-100">Your language and top 3 contributed languages</Form.Label>
        <Form.Check
          inline
          type="radio"
          label={t('yes')}
          value="byDuration"
          name="recommended"
          id="feedbackFormYesCheckbox"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
        <Form.Check
          inline
          type="radio"
          label={t('no')}
          value="bySpeaker"
          name="recommended"
          id="feedbackFormNoCheckbox"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
      </Form.Group>
      <BarChart id="bar_chart" data={barChartData} />
    </div>
  ) : null;
};

export default ContributionTracker;
