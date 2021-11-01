import { Fragment } from 'react';

import { useTranslation } from 'next-i18next';

import { MapChart } from 'components/Charts';
import MapLegend from 'components/MapLegend';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import useFetch from 'hooks/useFetch';
import type { CumulativeDataByLanguageAndState } from 'types/CumulativeDataByLanguageAndState';
import type { InitiativeType } from 'types/InitiativeType';
import { convertTimeFormat, getHoursText, getHoursValue, getMinutesText, getMinutesValue } from 'utils/utils';

import styles from './IndiaMapChart.module.scss';

const INITIATIVE_STATE_PARTICIPATION_CONFIG = {
  asr: {
    contribution: 'total_contributions',
    contributionText: 'transcribed',
    validation: 'total_validations',
    validationText: 'validated',
    legend: '',
    format: true,
    legendDefaultRange: 1,
  },

  text: {
    contribution: 'total_contributions',
    contributionText: 'contributed',
    validation: 'total_validations',
    validationText: 'validated',
    legend: '',
    format: true,
    legendDefaultRange: 1,
  },

  parallel: {
    contribution: 'total_contribution_count',
    contributionText: 'translationsDone',
    validation: 'total_validation_count',
    validationText: 'translationsValidated',
    legend: 'parallelBarGraphTooltip',
    format: false,
    legendDefaultRange: 500,
  },

  ocr: {
    contribution: 'total_contribution_count',
    contributionText: 'imagesLabelled',
    validation: 'total_validation_count',
    validationText: 'imagesValidated',
    legend: 'ocrBarGraphTooltip',
    format: false,
    legendDefaultRange: 500,
  },
};

const statesInformation = [
  { id: 'IN-TG', state: 'Telangana' },
  { id: 'IN-AN', state: 'Andaman and Nicobar Islands' },
  { id: 'IN-AP', state: 'Andhra Pradesh' },
  { id: 'IN-AR', state: 'Arunachal Pradesh' },
  { id: 'IN-AS', state: 'Assam' },
  { id: 'IN-BR', state: 'Bihar' },
  { id: 'IN-CT', state: 'Chhattisgarh' },
  { id: 'IN-GA', state: 'Goa' },
  { id: 'IN-GJ', state: 'Gujarat' },
  { id: 'IN-HR', state: 'Haryana' },
  { id: 'IN-HP', state: 'Himachal Pradesh' },
  { id: 'IN-JK', state: 'Jammu & Kashmir' },
  { id: 'IN-JH', state: 'Jharkhand' },
  { id: 'IN-KA', state: 'Karnataka' },
  { id: 'IN-KL', state: 'Kerala' },
  { id: 'IN-LD', state: 'Lakshadweep' },
  { id: 'IN-MP', state: 'Madhya Pradesh' },
  { id: 'IN-MH', state: 'Maharashtra' },
  { id: 'IN-MN', state: 'Manipur' },
  { id: 'IN-CH', state: 'Chandigarh' },
  { id: 'IN-PY', state: 'Puducherry' },
  { id: 'IN-PB', state: 'Punjab' },
  { id: 'IN-RJ', state: 'Rajasthan' },
  { id: 'IN-SK', state: 'Sikkim' },
  { id: 'IN-TN', state: 'Tamil Nadu' },
  { id: 'IN-TR', state: 'Tripura' },
  { id: 'IN-UP', state: 'Uttar Pradesh' },
  { id: 'IN-UT', state: 'Uttarakhand' },
  { id: 'IN-WB', state: 'West Bengal' },
  { id: 'IN-OR', state: 'Odisha' },
  { id: 'IN-DNDD', state: 'Dadra and Nagar Haveli and Daman and Diu' },
  { id: 'IN-ML', state: 'Meghalaya' },
  { id: 'IN-MZ', state: 'Mizoram' },
  { id: 'IN-NL', state: 'Nagaland' },
  { id: 'IN-DL', state: 'National Capital Territory of Delhi' },
  { id: 'IN-LK', state: 'Ladakh' },
];

const sourceUrl = 'https://crowdsource1.blob.core.windows.net/vakyansh-json-data/india2020Low.json';
const colors = ['#4061BF', '#6B85CE', '#92A8E8', '#CDD8F6', '#E9E9E9'];

const getTotalParticipation = (data: CumulativeDataByLanguageAndState | undefined, type: InitiativeType) => {
  if (type === INITIATIVES_MEDIA_MAPPING.likho || type === INITIATIVES_MEDIA_MAPPING.dekho) {
    return (Number(data?.total_validation_count) || 0) + (Number(data?.total_contribution_count) || 0);
  }
  return (Number(data?.total_validations) || 0) + (Number(data?.total_contributions) || 0);
};

const IndiaMapChart = ({ type, language }: { type: InitiativeType; language?: string }) => {
  const { t } = useTranslation();
  const jsonUrl = language ? apiPaths.cumulativeDataByLanguageAndState : apiPaths.cumulativeDataByState;

  const { data } = useFetch<Array<CumulativeDataByLanguageAndState>>(jsonUrl);

  let statesData: {}[] = [];
  let mapData = data?.filter(d => d.type === type) || [];
  if (language) {
    mapData = mapData.filter(d => d.language === language) || [];
  }

  const config = INITIATIVE_STATE_PARTICIPATION_CONFIG[type];

  statesInformation.forEach(state => {
    const data = mapData.find(s => state.state === s.state);
    const contribution = config.contribution as keyof CumulativeDataByLanguageAndState;
    const contributionData = data ? (data[contribution] as number) : 0;
    const validation = config.validation as keyof CumulativeDataByLanguageAndState;
    const validationData = data ? (data[validation] as number) : 0;
    const stateLabel = `state${state.id.substring(3, 5)}`;

    statesData.push({
      id: state.id,
      state: t(stateLabel),
      contribution: config.format ? convertTimeFormat(contributionData) : `${contributionData}`,
      validation: config.format ? convertTimeFormat(validationData) : `${validationData}`,
      speakers: data?.total_speakers || 0,
      value: contributionData + validationData,
    });
  });

  const tooltipTemplate = `
    <div>
      <h6>{state}</h6>
      <div>{speakers} ${t('people')}</div>
      <div>${t(config.contributionText)}:  <label>{contribution}</label></div>
      <div>${t(config.validationText)}:  <label>{validation}</label></div>
    </div>
  `;

  const maxContribution = Math.max.apply(
    Math,
    mapData.map(function (data) {
      return getTotalParticipation(data, type);
    })
  );

  const getValue = (value: number) => {
    if (config.format) {
      return maxContribution > 1 ? getHoursValue(value) : getMinutesValue(value);
    } else return value;
  };

  const getText = (value: number) => {
    if (config.format) {
      return maxContribution > 1 ? getHoursText(value) : getMinutesText(value);
    } else return `${value} ${t(config.legend)}`;
  };

  const isGreaterThanLegendDefaultRange = maxContribution > config.legendDefaultRange;
  const quarterVal = isGreaterThanLegendDefaultRange ? maxContribution / 4 : config.legendDefaultRange / 4;

  let legendData = [];
  legendData.push({
    value: `0 - ${getText(quarterVal)}`,
  });
  legendData.push({
    value: `${getValue(quarterVal)} - ${getText(quarterVal * 2)}`,
  });
  legendData.push({
    value: `${getValue(quarterVal * 2)} - ${getText(quarterVal * 3)}`,
  });
  legendData.push({
    value: `>${getText(quarterVal * 3)}`,
  });

  return (
    <Fragment>
      <p className="mb-5 display-2">{t('mapChartTitle')}</p>
      <div className={styles.chart}>
        <MapChart
          sourceUrl={sourceUrl}
          colors={colors}
          data={statesData}
          tooltipTemplate={tooltipTemplate}
          quarterUnit={quarterVal}
        />
      </div>
      <MapLegend data={legendData} />
    </Fragment>
  );
};

export default IndiaMapChart;
