import { useEffect } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import ProgressBar from 'react-bootstrap/ProgressBar';

import apiPaths from 'constants/apiPaths';
import {
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA,
  INITIATIVES_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { sourceConstants } from 'constants/pageRouteConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { CumulativeDataByLanguage } from 'types/CumulativeCount';
import type { InitiativeGoal } from 'types/InitiativeGoal';
import type { Initiative } from 'types/Initiatives';
import { convertTimeFormat, roundOffValue } from 'utils/utils';

import styles from './TyTargetProgress.module.scss';

const getSourceCount = (
  source: string | undefined,
  contributionCount: number | undefined,
  validationCount: number | undefined
) => {
  if (source === sourceConstants.contribute) {
    return contributionCount ?? 0;
  } else if (source === sourceConstants.validate) {
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

const languageFilter = (data: Array<InitiativeGoal>, type: string, language: string) => {
  if (type === INITIATIVES_MEDIA.parallel) {
    language = language?.split('-')[0];
  }
  if (language) return data.filter((d: InitiativeGoal) => d?.language.split('-')[0] == language);
  return data;
};

interface TyTargetProgressProps {
  initiative: Initiative;
  initiativeType: string;
  source: string;
  language: string | null;
}

const TyTargetProgress = (props: TyTargetProgressProps) => {
  const { t } = useTranslation();

  const { data: cumulativeCountData, mutate: cumulativeMutate } = useFetch<Array<CumulativeDataByLanguage>>(
    apiPaths.cumulativeDataByLanguage,
    { revalidateOnMount: false }
  );

  const { data: initiativeGoalData, mutate: initiativeGoalMutate } = useFetch<Array<InitiativeGoal>>(
    apiPaths.initiativeGoalsByLanguage,
    { revalidateOnMount: false }
  );

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
    const filterdLanguageData = languageFilter(
      goalDataList,
      INITIATIVES_MEDIA_MAPPING[props.initiative],
      props.language ?? ''
    );
    const goalData = reduceList(filterdLanguageData);
    const totalGoal = getSourceCount(props.source, goalData.contribution_goal, goalData.validation_goal) || 1;
    return totalGoal;
  };

  if (cumulativeCountData && cumulativeCountData.length && initiativeGoalData && initiativeGoalData.length) {
    const initiativeCumulativeData = cumulativeCountData.find(
      item => item.type === props.initiativeType && item.language === props.language
    );
    if (props.initiative === INITIATIVES_MAPPING.suno || props.initiative === INITIATIVES_MAPPING.bolo) {
      initiativeUnit = t('hours1');
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
        <div className={`${styles.percentage} font-family-rowdies`}>
          <Trans
            i18nKey="progressStatusWithLanguage"
            defaults="progressStatusWithLanguage"
            values={{ average: formattedAverage, initiativeName, language: props.language }}
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

export default TyTargetProgress;
