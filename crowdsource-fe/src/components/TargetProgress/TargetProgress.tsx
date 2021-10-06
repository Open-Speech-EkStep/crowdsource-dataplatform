import { useEffect } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import ProgressBar from 'react-bootstrap/ProgressBar';

import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeCount } from 'types/CumulativeCount';
import { convertTimeFormat, roundOffValue } from 'utils/utils';

import styles from './TargetProgress.module.scss';

const getSourceCount = (
  source: string | undefined,
  contributionCount: number | undefined,
  validationCount: number | undefined
) => {
  if (source === 'contribute') {
    return contributionCount ?? 0;
  } else if (source == 'validate') {
    return validationCount ?? 0;
  }
  return (contributionCount ?? 0) + (validationCount ?? 0);
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

interface TargetProgressProps {
  initiative: string;
  initiativeType: string;
  source?: string;
  language?: string;
}

const TargetProgress = (props: TargetProgressProps) => {
  const { t } = useTranslation();

  const { data: cumulativeCountData, mutate: cumulativeMutate } = useFetch<Array<CumulativeCount>>(
    apiPaths.cumulativeCount,
    { revalidateOnMount: false }
  );

  const { data: initiativeGoalData, mutate: initiativeGoalMutate } = useFetch<
    Array<{ contribution_goal: number; type: string; validation_goal: number }>
  >(apiPaths.initiativeGoals, { revalidateOnMount: false });

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

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

  const getInitiativeGoal = (data: any) => {
    const goalDataList = data.filter((d: any) => d.type === props.initiativeType) || [];
    const goalData = reduceList(goalDataList);
    const totalGoal = getSourceCount(props.source, goalData.contribution_goal, goalData.validation_goal) || 1;
    return totalGoal;
  };

  if (cumulativeCountData && cumulativeCountData.length && initiativeGoalData && initiativeGoalData.length) {
    const initiativeCumulativeData = cumulativeCountData.find(item => item.type === props.initiativeType);
    if (props.initiative === INITIATIVES_MAPPING.suno || props.initiative === INITIATIVES_MAPPING.bolo) {
      initiativeUnit = t('hours');
      totalProgress = getSourceCount(
        props.source,
        initiativeCumulativeData?.total_contributions,
        initiativeCumulativeData?.total_validations
      );

      currentInitiativeProgress = convertTimeFormat(totalProgress);
    } else {
      initiativeUnit = props.initiative === INITIATIVES_MAPPING.likho ? t('sentences') : t('images');
      totalProgress = getSourceCount(
        props.source,
        initiativeCumulativeData?.total_contribution_count,
        initiativeCumulativeData?.total_validation_count
      );
      currentInitiativeProgress = totalProgress;
    }
    initiativeGoal = getInitiativeGoal(initiativeGoalData);
    formattedAverage = roundOffValue((totalProgress / initiativeGoal) * 100, 1);
  }

  const initiativeName = `${t(props.initiative)} ${t('india')}`;

  if (!cumulativeCountData) return null;
  return (
    <div className={`${styles.root} d-flex flex-column`} data-testid="TargetProgress">
      <div className={`${styles.details} d-flex justify-content-between align-items-center`}>
        <div className={styles.percentage}>
          <Trans
            i18nKey="progressStatus"
            defaults="progressStatus"
            values={{ average: formattedAverage, initiativeName }}
            components={{ span: <span className={styles.count} /> }}
          />
        </div>
      </div>
      <ProgressBar
        now={formattedAverage}
        className={`${styles.progressBar} mt-2 mt-md-1 border border-1 border-info`}
      />
      <span className={`${styles.hours} mt-2 align-self-end`}>
        {currentInitiativeProgress}/{initiativeGoal} {initiativeUnit}
      </span>
    </div>
  );
};

export default TargetProgress;
