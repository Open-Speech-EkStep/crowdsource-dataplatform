import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import ProgressBar from 'react-bootstrap/ProgressBar';

import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING, INITIATIVE_ACTIONS } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeCount } from 'types/Chart';
import { capitalizeFirstLetter, convertIntoHrsFormat, formatTime, roundOffValue } from 'utils/utils';

import styles from './TargetProgress.module.scss';

interface TargetProgressProps {
  initiative: string;
  initiativeMedia: string;
  source?: string;
  language?: string;
}

const TargetProgress = (props: TargetProgressProps) => {
  const { data: cumulativeCountData, mutate: cumulativeMutate } = useFetch<Array<CumulativeCount>>(
    apiPaths.cumulativeCount,
    { revalidateOnMount: false }
  );
  const { t } = useTranslation();
  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const { data: initiativeGoalData, mutate: initiativeGoalMutate } = useFetch<
    Array<{ contribution_goal: number; type: string; validation_goal: number }>
  >(apiPaths.initiativeGoals, { revalidateOnMount: false });

  useEffect(() => {
    if (contributionLanguage) {
      cumulativeMutate();
      initiativeGoalMutate();
    }
  }, [initiativeGoalMutate, cumulativeMutate, contributionLanguage]);

  let totalProgress;
  let formattedAverage;
  let initiativeGoal;
  let currentInitiativeProgress;
  let initiativeUnit;

  const getSourceCount = (source: string | undefined, contributionCount: number, validationCount: number) => {
    if (source === INITIATIVE_ACTIONS.contribute) {
      return contributionCount;
    } else if (source == INITIATIVE_ACTIONS.validate) {
      return validationCount;
    }
    return contributionCount + validationCount;
  };

  const languageFilter = (data: any, initiativeType: any, language: any) => {
    if (initiativeType === INITIATIVES_MAPPING.likho && language) {
      language = language.split('-')[0];
    }
    return data;
  };

  const reduceList = (dataList: any) => {
    return dataList.reduce((accumulator: any, item: any) => {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'string') return;
        accumulator[key] = (accumulator[key] || 0) + item[key];
      });
      return accumulator;
    }, {});
  };

  const getInitiativeGoal = (data: any) => {
    let goalDataList = data.filter((d: any) => d.type === props.initiativeMedia) || [];
    goalDataList = languageFilter(goalDataList, props.initiative, props.language);
    const goalData = reduceList(goalDataList);
    const totalGoal = getSourceCount(props.source, goalData.contribution_goal, goalData.validation_goal) || 1;
    return totalGoal;
  };

  if (cumulativeCountData && cumulativeCountData.length && initiativeGoalData && initiativeGoalData.length) {
    const initiativeCumulativeData: any =
      cumulativeCountData && cumulativeCountData.find(item => item.type === props.initiativeMedia);
    if (props.initiative === INITIATIVES_MAPPING.suno || props.initiative === INITIATIVES_MAPPING.bolo) {
      initiativeUnit = 'Hour(s)';
      totalProgress =
        props.source && props.source === INITIATIVE_ACTIONS.contribute
          ? initiativeCumulativeData.total_contributions
          : initiativeCumulativeData.total_validations
          ? initiativeCumulativeData.total_contributions + initiativeCumulativeData.total_validations || 0
          : 0;
      const { hours, minutes, seconds } = convertIntoHrsFormat(totalProgress * 60 * 60);
      currentInitiativeProgress = formatTime(hours, minutes, seconds);
    } else {
      initiativeUnit = props.initiative === INITIATIVES_MAPPING.likho ? 'Sentence(s)' : 'Image(s)';
      totalProgress =
        props.source && props.source === INITIATIVE_ACTIONS.contribute
          ? initiativeCumulativeData.total_contribution_count
          : initiativeCumulativeData.total_validation_count
          ? initiativeCumulativeData.total_contribution_count +
              initiativeCumulativeData.total_validation_count || 0
          : 0;
      currentInitiativeProgress = totalProgress;
    }
    initiativeGoal = getInitiativeGoal(initiativeGoalData);
    formattedAverage = roundOffValue((totalProgress / initiativeGoal) * 100, 1);
  }

  return (
    <div className={`${styles.root} d-flex flex-column`} data-testid="TargetProgress">
      <div className={`${styles.details} d-flex justify-content-between align-items-center`}>
        <div className={styles.percentage}>
          <span className={styles.count}>{formattedAverage}%</span> {t('of')}{' '}
          {t(capitalizeFirstLetter(props.initiative))} {t('India Target Achieved')}
        </div>
        <span className={`${styles.hours} d-none d-md-block`}>
          {currentInitiativeProgress}/{initiativeGoal} {t(`${initiativeUnit}`)}
        </span>
      </div>
      <ProgressBar now={formattedAverage} className="mt-2 mt-md-1" />
      <span className={`${styles.hours} d-md-none mt-2 align-self-end`}>
        {currentInitiativeProgress}/{initiativeGoal} {t(`${initiativeUnit}`)}
      </span>
    </div>
  );
};

export default TargetProgress;
