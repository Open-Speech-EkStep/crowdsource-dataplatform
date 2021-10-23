import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Button from 'components/Button';
import LineChart from 'components/LineChart';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { ApiPathsKey } from 'types/ApiPathsKey';
import type { CumulativeDataByDateAndLanguage } from 'types/CumulativeDataByDateAndLanguage';
import type { InitiativeType } from 'types/InitiativeType';
import { convertTimeFormat } from 'utils/utils';

const getTimelineUrl = (language: string | undefined, timeframe: string) => {
  let url = timeframe + 'Timeline';
  if (!language) {
    url += 'Cumulative';
  }
  return url;
};

const ProgressChart = ({ type, language }: { type: InitiativeType; language?: string }) => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');
  const jsonUrl = getTimelineUrl(language, timeframe) as ApiPathsKey;

  const { data } = useFetch<Array<CumulativeDataByDateAndLanguage>>(apiPaths[jsonUrl]);

  let timelineData = [{}];

  let chartData = data?.filter(d => d.type === type) || [];
  if (language) {
    chartData = chartData.filter(d => d.language === language) || [];
  }
  for (let i = 0; i < chartData.length; i++) {
    const duration = chartData[i].month || chartData[i].quarter * 3;
    timelineData.push({
      month: duration,
      category: new Date(chartData[i].year, duration - 1, 1),
      year: String(chartData[i].year),
      value1: chartData[i].cumulative_contributions,
      contributionText: convertTimeFormat(chartData[i].cumulative_contributions || 0),
      value2: chartData[i].cumulative_validations,
      validationText: convertTimeFormat(chartData[i].cumulative_validations || 0),
    });
  }

  const line1Tooltip = `<div style="padding: 10px;">
  <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
  <div>${t('transcribed')}: <label>{contributionText}</label></div></div>`;
  const line2Tooltip = `<div style="padding: 10px;">
<h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
<div style="text-align: left;">${t('validated')}: <label>{validationText}</label></div></div>`;

  return (
    <Container fluid="lg" className="pt-7 pt-md-9">
      <h3>{t('lineChartTitle')}</h3>
      <Row>
        <Button onClick={() => setTimeframe('monthly')}>{t('monthly')}</Button>
        <Button onClick={() => setTimeframe('quarterly')}>{t('quarterly')}</Button>
      </Row>
      <LineChart
        data={timelineData}
        xAxisLabel={t('month')}
        yAxisLabel={t(`${type}ContributionGraphYLabel1`)}
        line1Text={t('transcribed')}
        line2Text={t('validated')}
        line1Tooltip={line1Tooltip}
        line2Tooltip={line2Tooltip}
      />
    </Container>
  );
};

export default ProgressChart;
