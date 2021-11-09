import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import Spinner from 'react-bootstrap/Spinner';

import { LineChart } from 'components/Charts';
import Switch from 'components/Switch';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { ApiPathsKey } from 'types/ApiPathsKey';
import type { CumulativeDataByDateAndLanguage } from 'types/CumulativeDataByDateAndLanguage';
import type { InitiativeType } from 'types/InitiativeType';
import { convertTimeFormat } from 'utils/utils';

import styles from './ProgressChart.module.scss';

const INITIATIVE_TIMELINE_PARTICIPATION_CONFIG = {
  asr: {
    contribution: 'cumulative_contributions',
    validation: 'cumulative_validations',
    line1Tooltip: 'transcribed',
    line2Tooltip: 'validated',
    xLabel1: 'transcribed',
    xLabel2: 'validated',
    yLabel: 'asrContributionGraphYLabel1',
    format: true,
  },

  text: {
    contribution: 'cumulative_contributions',
    validation: 'cumulative_validations',
    line1Tooltip: 'contributed',
    line2Tooltip: 'validated',
    xLabel1: 'contributed',
    xLabel2: 'validated',
    yLabel: 'textContributionGraphYLabel1',
    format: true,
  },

  parallel: {
    contribution: 'total_contribution_count',
    validation: 'total_validation_count',
    line1Tooltip: 'translated',
    line2Tooltip: 'validated',
    xLabel1: 'translationsDone',
    xLabel2: 'translationsValidated',
    yLabel: 'asrBarGraphTooltip',
    format: false,
  },

  ocr: {
    contribution: 'total_contribution_count',
    validation: 'total_validation_count',
    line1Tooltip: 'labelled',
    line2Tooltip: 'validated',
    xLabel1: 'imagesLabelled',
    xLabel2: 'imagesValidated',
    yLabel: 'ocrBarGraphTooltip',
    format: false,
  },
};

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

  const { data, isValidating } = useFetch<Array<CumulativeDataByDateAndLanguage>>(apiPaths[jsonUrl]);

  const config = INITIATIVE_TIMELINE_PARTICIPATION_CONFIG[type];

  let timelineData = [];

  let chartData = data?.filter(d => d.type === type) || [];
  if (language) {
    chartData = chartData.filter(d => d.language === language) || [];
  }
  for (let i = 0; i < chartData.length; i++) {
    const duration = chartData[i].month || chartData[i].quarter * 3 - 2;
    const contribution = config.contribution as keyof CumulativeDataByDateAndLanguage;
    const validation = config.validation as keyof CumulativeDataByDateAndLanguage;
    timelineData.push({
      month: duration,
      category: new Date(chartData[i].year, duration - 1, 1),
      year: String(chartData[i].year),
      value1: chartData[i][contribution],
      contributionText: config.format
        ? convertTimeFormat(chartData[i][contribution] || 0)
        : `${chartData[i][contribution]}`,
      value2: chartData[i][validation],
      validationText: config.format
        ? convertTimeFormat(chartData[i][validation] || 0)
        : `${chartData[i][validation]}`,
    });
  }

  const line1Tooltip = `
    <div class="p-2">
      <h6>{month}/{year}</h6>
      <div>
        ${t(config.line1Tooltip)}:
        <label>{contributionText}</label>
      </div>
    </div>
  `;

  const line2Tooltip = `
    <div class='p-2'>
      <h6>{month}/{year}</h6>
      <div>
        ${t(config.line2Tooltip)}:
        <label>{validationText}</label>
      </div>
    </div>
  `;

  return (
    <div className="bg-light rounded-8 p-5 p-md-8 h-100">
      <div className="d-md-flex justify-content-md-between mb-5 align-items-center">
        <p className="display-2">{t('lineChartTitle')}</p>
        <div className="d-flex justify-content-end mt-4 mt-md-0">
          <Switch
            optionOne="monthly"
            optionTwo="quarterly"
            toggleSwitch={option => {
              setTimeframe(option);
            }}
          />
        </div>
      </div>
      <div className={`${styles.chart}`}>
        {!data || isValidating ? (
          <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <Spinner data-testid="ChartSpinner" animation="border" variant="primary" />
          </div>
        ) : (
          <LineChart
            data={timelineData}
            xAxisLabel={t('month')}
            yAxisLabel={t(config.yLabel)}
            line1Text={t(config.xLabel1)}
            line2Text={t(config.xLabel2)}
            line1Tooltip={line1Tooltip}
            line2Tooltip={line2Tooltip}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
