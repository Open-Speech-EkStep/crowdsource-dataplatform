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
}

const ContributionStatsByLanguage = (props: ContributionStatsByLanguageProps) => {
  const { t } = useTranslation();
  const { data: cumulativeData, error } = useFetch<Array<CumulativeDataByLanguage>>(
    apiPaths.cumulativeDataByLanguage
  );

  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  const initiativeData =
    cumulativeData &&
    (cumulativeData.filter(item => item.type === INITIATIVES_MEDIA_MAPPING[props.initiative]) || []);

  const languageData =
    !cumulativeData || error
      ? null
      : initiativeData?.filter(d => d.language == props.language)[0] || {
          total_speakers: 0,
          total_contributions: 0,
          total_validations: 0,
        };

  statsContents.push({
    id: '1',
    stat: languageData && `${languageData?.total_speakers}`,
    label: t('peopleParticipated'),
  });
  statsContents.push({
    id: '2',
    stat: languageData && `${convertTimeFormat(languageData?.total_contributions)}`,
    label: t('durationTranscribed'),
  });
  statsContents.push({
    id: '3',
    stat: languageData && `${convertTimeFormat(languageData?.total_validations)}`,
    label: t('durationValidated'),
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
