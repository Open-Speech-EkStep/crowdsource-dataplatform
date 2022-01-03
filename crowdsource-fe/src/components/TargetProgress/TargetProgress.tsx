import { useEffect } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import ProgressBar from 'react-bootstrap/ProgressBar';

import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING, INITIATIVES_REVERSE_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeCount } from 'types/CumulativeCount';
import type { Initiative } from 'types/Initiatives';
import type { InitiativeType } from 'types/InitiativeType';
import type { SourceType } from 'types/SourceType';
import { convertTimeFormat, roundOffValue } from 'utils/utils';

import styles from './TargetProgress.module.scss';

const getSourceCount = (
  source: SourceType | undefined,
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
  initiative: Initiative;
  initiativeType: InitiativeType;
  source?: SourceType;
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
  const [translatedLanguage] = useLocalStorage<string>(localStorageConstants.translatedLanguage);

  useEffect(() => {
    if (contributionLanguage) {
      cumulativeMutate();
      initiativeGoalMutate();
    }
  }, [initiativeGoalMutate, cumulativeMutate, contributionLanguage, translatedLanguage]);

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

  if (cumulativeCountData && initiativeGoalData && initiativeGoalData.length) {
    const initiativeCumulativeData = cumulativeCountData.find(item => item.type === props.initiativeType);
    if (props.initiative === INITIATIVES_MAPPING.tts || props.initiative === INITIATIVES_MAPPING.asr) {
      initiativeUnit = t('hours1');
      totalProgress = getSourceCount(
        props.source,
        initiativeCumulativeData?.total_contributions,
        initiativeCumulativeData?.total_validations
      );

      currentInitiativeProgress = convertTimeFormat(totalProgress);
    } else {
      initiativeUnit = props.initiative === INITIATIVES_MAPPING.translation ? t('sentences') : t('images');
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

  if (!cumulativeCountData) return null;
  return (
    <div className={`${styles.root} d-flex flex-column`} data-testid="TargetProgress">
      <div className="d-flex justify-content-between align-items-center">
        <div className={`${styles.percentage} font-family-rowdies`}>
          <Trans
            i18nKey={`${INITIATIVES_REVERSE_MEDIA_MAPPING[props.initiativeType]}ProgressStatus`}
            defaults={`${INITIATIVES_REVERSE_MEDIA_MAPPING[props.initiativeType]}ProgressStatus`}
            values={{ average: formattedAverage }}
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
