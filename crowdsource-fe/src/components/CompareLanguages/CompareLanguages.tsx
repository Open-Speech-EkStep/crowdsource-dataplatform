import React, { useMemo, useEffect } from 'react';

import { useTranslation, i18n } from 'next-i18next';

import { BarChart } from 'components/Charts';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
  INITIATIVES_REVERSE_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeDataByLanguage } from 'types/CumulativeCount';
import type { Initiative } from 'types/Initiatives';
import type { InitiativeType } from 'types/InitiativeType';
import type { TopLanguagesByHours } from 'types/TopLanguages';
import { convertTimeFormat, isAsrInitiative } from 'utils/utils';

import styles from './CompareLanguages.module.scss';

const mapChartData = (
  data: Array<CumulativeDataByLanguage> | undefined,
  key: string,
  langauge: string,
  initiativeMedia: InitiativeType,
  value: string
) => {
  if (langauge && data) {
    const contributedLanguageHours = data?.find(
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
    const topLanguage = data?.sort((a: any, b: any) => (Number(a[key]) > Number(b[key]) ? -1 : 1));
    const isSelectedLanguageTop =
      topLanguage && topLanguage.length && topLanguage[0].language === topLanguageArray[0].language;
    let remainingLanguage = data.filter((item: CumulativeDataByLanguage) => item?.language !== langauge);
    remainingLanguage = remainingLanguage.sort((a: any, b: any) =>
      Number(a[key]) > Number(b[key]) ? -1 : 1
    );
    return topLanguageArray.concat(remainingLanguage.slice(0, isSelectedLanguageTop ? 2 : 3));
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
  initiativeType: InitiativeType,
  key: string,
  source: string,
  topLanguagesByHours?: TopLanguagesByHours[]
) => {
  return (
    topLanguagesByHours?.map((topLanguageByHours: any) => ({
      category: translateCategory(topLanguageByHours?.language),
      value: (topLanguageByHours as any)[contributionValue],
      tooltipText: isAsrInitiative(initiativeType)
        ? source === 'contribute'
          ? convertTimeFormat(topLanguageByHours[key])
          : `${topLanguageByHours[key]} ${i18n?.t(`ttsBarGraphTooltip`)}`
        : `${topLanguageByHours[key]} ${i18n?.t(
            `${INITIATIVES_REVERSE_MEDIA_MAPPING[initiativeType]}BarGraphTooltip`
          )}`,
    })) ?? []
  );
};

interface CompareLanguagesProps {
  initiative: Initiative;
  dataBindigValue: string;
  graphLabel: string;
  isTopLanguage: any;
  graphHeading: string;
  showHeader: boolean;
  source: string;
}

const CompareLanguages = (props: CompareLanguagesProps) => {
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);
  const { data: cumulativeDataByLanguage, mutate: hrsMutate } = useFetch<Array<CumulativeDataByLanguage>>(
    apiPaths.cumulativeDataByLanguage,
    { revalidateOnMount: false }
  );

  const translatedContributionLanguage = `${t(`${contributionLanguage?.toLowerCase()}`)}${
    props.initiative === INITIATIVES_MAPPING.translation
      ? `-${t(`${translatedLanguage?.toLowerCase()}`)}`
      : ''
  }`;

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

  useEffect(() => {
    const callbacks = {
      asr: (data: any) => data.language === contributionLanguage,
      parallel: (data: any) => data.language === `${contributionLanguage}-${translatedLanguage}`,
    };
    const sortingLanguages =
      topLanguageHrsData &&
      topLanguageHrsData.sort((a: any, b: any) =>
        Number(a[props.dataBindigValue]) > Number(b[props.dataBindigValue]) ? -1 : 1
      );
    const top3language = sortingLanguages && sortingLanguages.slice(0, 3);
    const found =
      INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.parallel
        ? top3language?.some(callbacks[INITIATIVES_MEDIA.parallel])
        : top3language?.some(callbacks[INITIATIVES_MEDIA.asr]);

    const isLanguageTop = found;
    props.isTopLanguage(isLanguageTop ? 'keep' : 'see');
  }, [contributionLanguage, props, topLanguageHrsData, translatedLanguage]);

  const barChartData = useMemo(
    () => ({
      data: getTopLanguagesByHoursChartData(
        props.dataBindigValue,
        INITIATIVES_MEDIA_MAPPING[props.initiative],
        props.dataBindigValue,
        props.source,
        topLanguageHrsData
      ),
      yAxisLabel: props.graphLabel,
      bgColor: '#333',
      ...chartLegendDetails,
    }),
    [
      chartLegendDetails,
      props.dataBindigValue,
      props.graphLabel,
      props.initiative,
      props.source,
      topLanguageHrsData,
    ]
  );

  return barChartData.data.length ? (
    <div data-testid="CompareLanguages" className={styles.chartContainer}>
      {props.showHeader && <h5 className="fw-light mb-3 text-center">{props.graphHeading}</h5>}
      <div className={styles.chart}>
        <BarChart id="tybar_chart" data={barChartData} labelClass="amThankyouXAxisLabel" />
      </div>
      <span className="display-6 d-block text-center text-primary-60">
        {t(`${props.initiative}contributionVsTopLanguage`, { language: translatedContributionLanguage })}
      </span>
    </div>
  ) : null;
};

export default CompareLanguages;
