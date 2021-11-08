import type { FunctionComponent } from 'react';

import { useTranslation } from 'next-i18next';
import Spinner from 'react-bootstrap/Spinner';

import { BarChart } from 'components/Charts';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { GenderGroupAndLanguageContributions } from 'types/GenderGroupAndLanguageContributions';
import { convertTimeFormat } from 'utils/utils';

import styles from './GenderChart.module.scss';

const chartTitle = 'genderChartTitle';
const chartYLabel = 'textContributionGraphYLabel1';
const othersTranslationMap = {
  'Transgender - He': 'transgenderMale',
  'Transgender - She': 'transgenderFemale',
  'Rather Not Say': 'ratherNotSayGender',
};

interface GenderChartProps {
  language: string | undefined;
}

const GenderChart: FunctionComponent<GenderChartProps> = ({ language }) => {
  const { t } = useTranslation();
  const jsonUrl = language ? apiPaths.genderGroupAndLanguageContributions : apiPaths.genderGroupContributions;
  const { data: jsonData, isValidating } = useFetch<Array<GenderGroupAndLanguageContributions>>(jsonUrl);
  let genderData = language ? jsonData?.filter(d => d.language == language) : jsonData;

  let chartData = [];
  const maleData = genderData?.filter(d => d.gender === 'male')[0];
  const maleXLabel = t('male');
  if (maleData)
    chartData.push({
      category: maleXLabel,
      value: maleData?.hours_contributed || 0,
      tooltipText: `
    <div>
        <strong>${maleXLabel}</strong>
        <div>${t('contributed')}: <label>${convertTimeFormat(maleData?.hours_contributed || 0)}</label></div>
        <div>${t('textBarGraphTooltip')}: <label>${maleData?.speakers}</label></div>
    </div>`,
    });

  const femaleData = genderData?.filter(d => d.gender === 'female')[0];
  const femaleXLabel = t('female');

  if (femaleData)
    chartData.push({
      category: femaleXLabel,
      value: femaleData?.hours_contributed || 0,
      tooltipText: `
    <div>
        <strong>${femaleXLabel}</strong>
        <div>${t('contributed')}: <label>${convertTimeFormat(
        femaleData?.hours_contributed || 0
      )}</label></div>
        <div>${t('textBarGraphTooltip')}: <label>${femaleData?.speakers}</label></div>
    </div>`,
    });

  const notSpecifiedData = genderData?.filter(d => d.gender === '')[0];
  const notSpecifiedXLabel = t('notSpecified');

  if (notSpecifiedData)
    chartData.push({
      category: notSpecifiedXLabel,
      value: notSpecifiedData?.hours_contributed,
      tooltipText: `
    <div>
        <strong>${notSpecifiedXLabel}</strong>
        <div>${t('contributed')}: <label>${convertTimeFormat(
        notSpecifiedData?.hours_contributed || 0
      )}</label></div>
        <div>${t('textBarGraphTooltip')}: <label>${notSpecifiedData?.speakers}</label></div>
    </div>`,
    });

  const othersDataList = genderData?.filter(
    d => d.gender.toLowerCase().indexOf('transgender') > -1 || d.gender.toLowerCase().indexOf('rather') > -1
  );
  const othersXLabel = t('others');

  othersDataList?.forEach(item => {
    const gender = item.gender as keyof typeof othersTranslationMap;
    chartData.push({
      category: othersXLabel,
      value: item?.hours_contributed || 0,
      tooltipText: `
      <div>
          <strong>${t(othersTranslationMap[gender])}</strong>
          <div>${t('contributed')}: <label>${convertTimeFormat(item?.hours_contributed || 0)}</label></div>
          <div>${t('textBarGraphTooltip')}: <label>${item?.speakers}</label></div>
      </div>`,
    });
  });

  if (!jsonData || isValidating) {
    return <Spinner data-testid="ChartSpinner" animation="border" />;
  }

  return (
    <div className="bg-light rounded-8 p-5 p-md-8 h-100">
      <p className="mb-5 display-2">{t(chartTitle)}</p>
      <div className={styles.chart}>
        <BarChart
          id="bar_chart"
          data={{
            data: chartData,
            yAxisLabel: t(chartYLabel),
            colors: ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'],
            strokeWidth: 1,
          }}
        />
      </div>
    </div>
  );
};

export default GenderChart;
