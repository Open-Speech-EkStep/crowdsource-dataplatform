import React, { useMemo, useEffect } from 'react';

import { useTranslation, i18n } from 'next-i18next';

import { BarChart } from 'components/Charts';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
  INITIATIVES_MEDIA_TYPE_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeDataByLanguage } from 'types/CumulativeCount';
import type { Initiative } from 'types/Initiatives';
import type { InitiativeType } from 'types/InitiativeType';
import type { TopLanguagesByHours } from 'types/TopLanguages';
import { convertTimeFormat, isSunoOrBoloInitiative } from 'utils/utils';

import styles from './CompareLanguages.module.scss';

const mapChartData = (
  data: Array<CumulativeDataByLanguage> | undefined,
  key: string,
  langauge: string,
  initiativeMedia: InitiativeType,
  value: string
) => {
  if (langauge && data && data.length) {
    const contributedLanguageHours = data.find(
      (item: CumulativeDataByLanguage) => item.language === langauge && item.type === initiativeMedia
    );
    const topLanguageArray = [];
    if (contributedLanguageHours) {
      topLanguageArray.push(contributedLanguageHours);
    } else {
      topLanguageArray.push({
        language: langauge,
        [value]: 0.0,
      });
    }
    let remainingLanguage = data.filter((item: CumulativeDataByLanguage) => item?.language !== langauge);
    remainingLanguage = remainingLanguage.sort((a: any, b: any) =>
      Number(a[key]) > Number(b[key]) ? -1 : 1
    );
    return topLanguageArray.concat(remainingLanguage.slice(0, 3));
  }
};

const translateCategory = (language: string) => {
  return language
    .split('-')
    .map(language => i18n?.t(language.toLowerCase()))
    .join('-');
};

const getTopLanguagesByHoursChartData = (
  contributionValue: string,
  initiative: InitiativeType,
  topLanguagesByHours?: TopLanguagesByHours[]
) => {
  return (
    topLanguagesByHours?.map(topLanguageByHours => ({
      category: translateCategory(topLanguageByHours?.language),
      value: (topLanguageByHours as any)[contributionValue],
      tooltipText: isSunoOrBoloInitiative(initiative)
        ? convertTimeFormat(topLanguageByHours?.total_contributions)
        : `${topLanguageByHours?.total_contribution_count} ${INITIATIVES_MEDIA_TYPE_MAPPING[initiative]}`,
    })) ?? []
  );
};

interface CompareLanguagesProps {
  initiative: Initiative;
  dataBindigValue: string;
  graphLabel: string;
}

const CompareLanguages = (props: CompareLanguagesProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);
  const { data: cumulativeDataByLanguage, mutate: hrsMutate } = useFetch<Array<CumulativeDataByLanguage>>(
    apiPaths.cumulativeDataByLanguage,
    { revalidateOnMount: false }
  );

  useEffect(() => {
    if (contributionLanguage) {
      hrsMutate();
    }
  }, [contributionLanguage, translatedLanguage, hrsMutate]);

  let cumulativeData: Array<CumulativeDataByLanguage> | undefined;

  cumulativeData = cumulativeDataByLanguage?.filter(
    topLanguageByHours => topLanguageByHours.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  );

  const language =
    INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.parallel
      ? `${contributionLanguage}-${translatedLanguage}`
      : contributionLanguage;

  const topLanguageHrsData = mapChartData(
    cumulativeData,
    props.dataBindigValue,
    language as string,
    INITIATIVES_MEDIA_MAPPING[props.initiative],
    props.dataBindigValue
  );

  const chartLegendDetails = useMemo(
    () => ({
      colors: ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'],
      xAxisLabel: t('month'),
    }),
    [t]
  );

  const barChartData = useMemo(
    () => ({
      data: getTopLanguagesByHoursChartData(
        props.dataBindigValue,
        INITIATIVES_MEDIA_MAPPING[props.initiative],
        topLanguageHrsData
      ),
      yAxisLabel: props.graphLabel,
      ...chartLegendDetails,
    }),
    [chartLegendDetails, props.dataBindigValue, props.graphLabel, props.initiative, topLanguageHrsData]
  );

  return barChartData.data.length ? (
    <div data-testid="CompareLanguages">
      <div className={styles.chartContainer}>
        <BarChart id="tybar_chart" data={barChartData} />
      </div>
    </div>
  ) : null;
};

export default CompareLanguages;
