import type { FunctionComponent } from 'react';

import { useTranslation } from 'next-i18next';
import Spinner from 'react-bootstrap/Spinner';

import { PieChart } from 'components/Charts';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { AgeGroupAndLanguageContributions } from 'types/AgeGroupAndLanguageContributions';

import styles from './AgeChart.module.scss';

const chartTitle = 'ageChartTitle';

const AGE_GROUP_CONFIG = [
  { key: 'notSpecified', value: '' },
  { key: 'ageGroup1', value: 'upto 10' },
  { key: 'ageGroup2', value: '10 - 30' },
  { key: 'ageGroup3', value: '30 - 60' },
  { key: 'ageGroup4', value: '60+' },
];

interface AgeChartProps {
  language: string | undefined;
}

const AgeChart: FunctionComponent<AgeChartProps> = ({ language }) => {
  const { t } = useTranslation();
  const jsonUrl = language ? apiPaths.ageGroupAndLanguageContributions : apiPaths.ageGroupContributions;
  const { data: jsonData, isValidating } = useFetch<Array<AgeGroupAndLanguageContributions>>(jsonUrl);
  let ageData = language ? jsonData?.filter(d => d.language === language) : jsonData;

  let chartData: Array<Object> = [];

  AGE_GROUP_CONFIG.forEach(ageConfig => {
    const data = ageData?.filter(d => d.age_group === ageConfig.value)[0];
    if (data) {
      chartData.push({
        category: t(ageConfig.key),
        value: data.speakers || 0,
      });
    }
  });

  return (
    <div className="bg-light rounded-8 p-5 p-md-8 h-100">
      <p className="mb-5 display-2">{t(chartTitle)}</p>
      <div className={styles.chart}>
        {!jsonData || isValidating ? (
          <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <Spinner data-testid="ChartSpinner" animation="border" variant="primary" />
          </div>
        ) : (
          <PieChart
            id="pie_chart"
            data={{
              data: chartData,
              colors: ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AgeChart;
