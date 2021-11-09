import { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useTranslation, i18n } from 'next-i18next';
import Form from 'react-bootstrap/Form';

import { BarChart } from 'components/Charts';
import ViewAllDetailButton from 'components/ViewAllDetailButton';
import apiPaths from 'constants/apiPaths';
import {
  INITIATIVE_MEDIA_CONTRIBUTION_MAPPING,
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import type { InitiativeType } from 'types/InitiativeType';
import type { TopLanguagesByHours, TopLanguagesBySpeaker } from 'types/TopLanguages';
import { convertTimeFormat, isSunoOrBoloInitiative } from 'utils/utils';

import styles from './ContributionTracker.module.scss';

type ChartFilterType = 'byDuration' | 'bySpeaker';

const mapChartData = (data: any, key: string, langauge: string, initiativeMedia: InitiativeType) => {
  if (langauge && data && data.length) {
    const contributedLanguageHours = data.find(
      (item: any) => item.language === langauge && item.type === initiativeMedia
    );
    const topLanguageArray = [];
    if (contributedLanguageHours) {
      topLanguageArray.push(contributedLanguageHours);
    } else {
      topLanguageArray.push({
        language: langauge,
        [INITIATIVE_MEDIA_CONTRIBUTION_MAPPING[initiativeMedia]]: 0.0,
      });
    }
    const topLanguage = data.sort((a: any, b: any) => (Number(a[key]) > Number(b[key]) ? -1 : 1));
    const isSelectedLanguageTop = topLanguage[0].language === topLanguageArray[0].language;

    console.log(topLanguage, isSelectedLanguageTop);
    let remainingLanguage = data.filter((item: any) => item?.language !== langauge);
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
  initiativeMedia: InitiativeType,
  topLanguagesByHours?: TopLanguagesByHours[]
) => {
  return (
    topLanguagesByHours?.map(topLanguageByHours => ({
      category: translateCategory(topLanguageByHours?.language),
      value: (topLanguageByHours as any)[contributionValue],
      tooltipText: isSunoOrBoloInitiative(initiativeMedia)
        ? convertTimeFormat(topLanguageByHours?.total_contributions)
        : `${topLanguageByHours?.total_contribution_count} ${i18n
            ?.t(`${initiativeMedia}BarGraphTooltip`)
            ?.toLocaleLowerCase()}`,
    })) ?? []
  );
};

const getTopLanguagesBySpeakerChartData = (
  type: InitiativeType,
  topLanguagesBySpeaker?: TopLanguagesBySpeaker[]
) => {
  return (
    topLanguagesBySpeaker?.map(topLanguagesBySpeaker => ({
      category: i18n?.t((topLanguagesBySpeaker?.language).toLowerCase()),
      value: topLanguagesBySpeaker?.total_speakers,
      tooltipText: (topLanguagesBySpeaker?.total_speakers || '0') + ' ' + i18n?.t(`${type}BarGraphTooltip`),
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
  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);
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
  }, [contributionLanguage, translatedLanguage, speakerMutate, hrsMutate]);

  let hoursData = topLanguagesByHoursData;
  let speakersData = topLanguagesBySpeakerData;

  hoursData = topLanguagesByHoursData?.filter(
    topLanguageByHours => topLanguageByHours.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  );

  const language =
    INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.parallel
      ? `${contributionLanguage}-${translatedLanguage}`
      : contributionLanguage;

  const topLanguageHrsData = mapChartData(
    hoursData,
    INITIATIVE_MEDIA_CONTRIBUTION_MAPPING[INITIATIVES_MEDIA_MAPPING[props.initiative]],
    language as string,
    INITIATIVES_MEDIA_MAPPING[props.initiative]
  );

  speakersData = topLanguagesBySpeakerData?.filter(
    topLanguagesBySpeaker => topLanguagesBySpeaker.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  );
  const topSpeakersData = mapChartData(
    speakersData,
    'total_speakers',
    language as string,
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
          ? getTopLanguagesByHoursChartData(
              INITIATIVE_MEDIA_CONTRIBUTION_MAPPING[INITIATIVES_MEDIA_MAPPING[props.initiative]],
              INITIATIVES_MEDIA_MAPPING[props.initiative],
              topLanguageHrsData
            )
          : getTopLanguagesBySpeakerChartData(INITIATIVES_MEDIA_MAPPING[props.initiative], topSpeakersData),
      yAxisLabel:
        chartFilterType === 'byDuration'
          ? t(`${INITIATIVES_MEDIA_MAPPING[props.initiative]}ContributionGraphYLabel1`)
          : t(`${INITIATIVES_MEDIA_MAPPING[props.initiative]}ContributionGraphYLabel2`),
      bgColor: '#333',
      ...chartLegendDetails,
    }),
    [chartFilterType, chartLegendDetails, props.initiative, t, topLanguageHrsData, topSpeakersData]
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
          {INITIATIVES_MEDIA_MAPPING[props.initiative] === INITIATIVES_MEDIA.parallel
            ? t('contributionTrackerSubHeader2')
            : t('contributionTrackerSubHeader1')}
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
      <div className="bg-secondary p-5 p-md-8 mt-4 mt-md-5 rounded-8">
        <div className="d-md-flex justify-content-between display-5 mb-5 mb-md-6">
          <p>{props.graphTitle}</p>
          <div className="d-flex align-items-center mt-3 mt-md-0 display-6">
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
