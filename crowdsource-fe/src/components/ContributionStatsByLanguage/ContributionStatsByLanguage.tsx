import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import useFetch from 'hooks/useFetch';
import type { CumulativeDataByLanguage } from 'types/CumulativeDataByLanguage';
import { convertTimeFormat } from 'utils/utils';

interface ContributionStatsByLanguageProps {
  initiative: 'suno' | 'bolo' | 'likho' | 'dekho';
  header?: string;
  subHeader?: string;
  language: string;
  handleNoData: () => any;
}

const INITIATIVE_LANGUANGE_PARTICIPATION_CONFIG = {
  suno: [
    { key: 'total_speakers', text: 'peopleParticipated' },
    { key: 'total_contributions', text: 'durationTranscribed' },
    { key: 'total_validations', text: 'durationValidated' },
  ],
  bolo: [
    { key: 'total_speakers', text: 'peopleParticipated' },
    { key: 'total_contributions', text: 'durationRecorded' },
    { key: 'total_validations', text: 'durationValidated' },
  ],
  likho: [
    { key: 'total_speakers', text: 'peopleParticipated' },
    { key: 'total_contribution_count', text: 'translationsDone' },
    { key: 'total_validation_count', text: 'translationsValidated' },
  ],
  dekho: [
    { key: 'total_speakers', text: 'peopleParticipated' },
    { key: 'total_contribution_count', text: 'imagesLabelled' },
    { key: 'total_validation_count', text: 'imagesValidated' },
  ],
};

const getValue = (key: keyof CumulativeDataByLanguage, data: CumulativeDataByLanguage) => {
  if (key === 'total_contributions' || key === 'total_validations') {
    return convertTimeFormat(data[key]);
  }
  return data[key];
};

const ContributionStatsByLanguage = ({
  initiative,
  language,
  handleNoData,
}: ContributionStatsByLanguageProps) => {
  const { t } = useTranslation();
  const { data: cumulativeData, error } = useFetch<Array<CumulativeDataByLanguage>>(
    apiPaths.cumulativeDataByLanguage
  );

  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  useEffect(() => {
    if (
      cumulativeData &&
      !cumulativeData
        ?.filter(item => item.type === INITIATIVES_MEDIA_MAPPING[initiative])
        ?.filter(d => d.language == language)[0]
    )
      handleNoData();
  }, [cumulativeData, handleNoData, initiative, language]);

  const initiativeData =
    cumulativeData?.filter(item => item.type === INITIATIVES_MEDIA_MAPPING[initiative]) || [];

  const languageData =
    !cumulativeData || error
      ? null
      : initiativeData?.filter(d => d.language == language)[0] || {
          total_speakers: 0,
          total_contributions: 0,
          total_validations: 0,
        };

  INITIATIVE_LANGUANGE_PARTICIPATION_CONFIG[initiative].forEach(stat => {
    const key = stat.key as keyof CumulativeDataByLanguage;
    statsContents.push({
      id: key,
      stat: languageData && `${getValue(key, languageData)}`,
      label: t(stat.text),
    });
  });

  return (
    <div>
      <div className="mt-4 mt-md-5">
        <Stats contents={statsContents} />
      </div>
    </div>
  );
};

export default ContributionStatsByLanguage;
