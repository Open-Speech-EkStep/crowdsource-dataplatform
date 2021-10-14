import React, { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useTranslation, i18n } from 'next-i18next';
import Form from 'react-bootstrap/Form';

import { BarChart } from 'components/Charts';
import ViewAllDetailButton from 'components/ViewAllDetailButton';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import type { TopLanguagesByHours, TopLanguagesBySpeaker } from 'types/TopLanguages';
import { convertTimeFormat } from 'utils/utils';

import styles from './ContributionTracker.module.scss';

type ChartFilterType = 'byDuration' | 'bySpeaker';

const mapChartData = (data: any, key: string, langauge: string, initiativeMedia: string) => {
  if (langauge && data && data.length) {
    const contributedLanguageHours = data.find(
      (item: any) => item.language === langauge && item.type === initiativeMedia
    );
    const topLanguageArray = [];
    if (contributedLanguageHours) {
      topLanguageArray.push(contributedLanguageHours);
    } else {
      topLanguageArray.push({ language: langauge, total_contributions: 0.0 });
    }
    let remainingLanguage = data.filter((item: any) => item?.language !== langauge);
    remainingLanguage = remainingLanguage.sort((a: any, b: any) =>
      Number(a[key]) > Number(b[key]) ? -1 : 1
    );
    return topLanguageArray.concat(remainingLanguage.slice(0, 3));
  }
};

const getTopLanguagesByHoursChartData = (topLanguagesByHours?: TopLanguagesByHours[]) => {
  return (
    topLanguagesByHours?.map(topLanguageByHours => ({
      category: i18n?.t((topLanguageByHours?.language).toLowerCase()),
      value: topLanguageByHours?.total_contributions,
      tooltipText: convertTimeFormat(topLanguageByHours?.total_contributions),
    })) ?? []
  );
};

const getTopLanguagesBySpeakerChartData = (topLanguagesBySpeaker?: TopLanguagesBySpeaker[]) => {
  return (
    topLanguagesBySpeaker?.map(topLanguagesBySpeaker => ({
      category: i18n?.t((topLanguagesBySpeaker?.language).toLowerCase()),
      value: topLanguagesBySpeaker?.total_speakers,
      tooltipText: topLanguagesBySpeaker?.total_speakers + ' Sentences',
    })) ?? []
  );
};

interface ContributionTrackerProps {
  initiative: Initiative;
  graphTitle: string;
}

const ContributionTracker = (props: ContributionTrackerProps) => {
  const { t } = useTranslation();
  const [chartFilterType, setChartFilterType] = useState<ChartFilterType>('byDuration');
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const { data: topLanguagesByHoursData, mutate: hrsMutate } = useFetch<Array<TopLanguagesByHours>>(
    apiPaths.topLanguagesByHoursContributed,
    { revalidateOnMount: false }
  );

  const { data: topLanguagesBySpeakerData, mutate: speakerMutate } = useFetch<Array<TopLanguagesBySpeaker>>(
    apiPaths.topLanguagesBySpeakerContributions,
    { revalidateOnMount: false }
  );

  useEffect(() => {
    if (contributionLanguage) {
      setChartFilterType('byDuration');
      hrsMutate();
      speakerMutate();
    }
  }, [contributionLanguage, speakerMutate, hrsMutate]);

  let hoursData = topLanguagesByHoursData;
  let speakersData = topLanguagesBySpeakerData;

  hoursData = topLanguagesByHoursData?.filter(
    topLanguageByHours => topLanguageByHours.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  );
  const topLanguageHrsData = mapChartData(
    hoursData,
    'total_contributions',
    contributionLanguage ?? '',
    INITIATIVES_MEDIA_MAPPING[props.initiative]
  );

  speakersData = topLanguagesBySpeakerData?.filter(
    topLanguagesBySpeaker => topLanguagesBySpeaker.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  );
  const topSpeakersData = mapChartData(
    speakersData,
    'total_speakers',
    contributionLanguage ?? '',
    INITIATIVES_MEDIA_MAPPING[props.initiative]
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
      data:
        chartFilterType === 'byDuration'
          ? getTopLanguagesByHoursChartData(topLanguageHrsData)
          : getTopLanguagesBySpeakerChartData(topSpeakersData),
      yAxisLabel:
        chartFilterType === 'byDuration' ? t('contributionGraphYLabel1') : t('contributionGraphYLabel2'),
      ...chartLegendDetails,
    }),
    [chartFilterType, chartLegendDetails, t, topLanguageHrsData, topSpeakersData]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChartFilterType(e.target.value as ChartFilterType);
  };

  return barChartData.data.length ? (
    <div data-testid="ContributionTracker">
      <h3>{t('contributionTrackerHeader')}</h3>
      <Form.Group
        controlId="recommended"
        className="mt-4 d-flex flex-column flex-md-row align-items-md-center"
      >
        <Form.Label className="display-3 mb-0 mb-md-0 font-family-rowdies">
          {t('contributionTrackerSubHeader')}
        </Form.Label>
        {(INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.text ||
          INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.asr) && (
          <div className="d-md-flex ms-md-9 mt-4 mt-md-0">
            <Form.Check
              inline
              type="radio"
              label={t('byHours')}
              value="byDuration"
              name="recommended"
              id="feedbackFormYesCheckbox"
              className={`${styles.radio} me-8 mb-0`}
              onChange={handleChange}
              checked={chartFilterType === 'byDuration'}
            />
            <Form.Check
              inline
              type="radio"
              label={t('bySentences')}
              value="bySpeaker"
              name="recommended"
              id="feedbackFormNoCheckbox"
              className={`${styles.radio} me-8 mb-0 mt-2 mt-md-0`}
              onChange={handleChange}
            />
          </div>
        )}
      </Form.Group>
      <div className="bg-secondary p-5 p-md-8 mt-4 mt-md-5">
        <div className="d-md-flex justify-content-between display-5 mb-5 mb-md-6">
          <p>{props.graphTitle}</p>
          <div className="mt-3 mt-md-0 display-6">
            <span className={`${styles.chartLabel} ${styles.chartLabelOrange}`}>
              {t('yourSelectedLanguage')}
            </span>
            <span className={`${styles.chartLabel} ${styles.chartLabelYellow} ms-4`}>
              {t('topLanguages')}
            </span>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <BarChart id="bar_chart" data={barChartData} />
        </div>
      </div>
      <div className="mt-9 mt-md-12">
        <ViewAllDetailButton initiative={props.initiative} />
      </div>
    </div>
  ) : null;
};

export default ContributionTracker;
