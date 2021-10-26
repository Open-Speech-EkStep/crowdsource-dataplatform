import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA_MAPPING, INITIATIVE_CUMULATIVE_VALUE } from 'constants/initiativeConstants';
import useFetch from 'hooks/useFetch';
import type { CumulativeCount } from 'types/CumulativeCount';
import { convertTimeFormat, isSunoOrBoloInitiative } from 'utils/utils';

interface ContributionStatsProps {
  initiative: 'suno' | 'bolo' | 'likho' | 'dekho';
  header?: string;
  subHeader?: string;
}

const ContributionStats = (props: ContributionStatsProps) => {
  const { t } = useTranslation();
  const { data: participationStats } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.participationStats
  );
  const { data: cumulativeData } = useFetch<Array<CumulativeCount>>(apiPaths.cumulativeCount);

  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  const initiativeData: any =
    (cumulativeData &&
      cumulativeData.find(item => item.type === INITIATIVES_MEDIA_MAPPING[props.initiative])) ||
    {};
  initiativeData.peopleParticipated = participationStats?.find(
    item => item.type === INITIATIVES_MEDIA_MAPPING[props.initiative]
  )?.count;
  INITIATIVE_CUMULATIVE_VALUE[props.initiative].forEach((ele, index) => {
    let statValue;
    if (isSunoOrBoloInitiative(INITIATIVES_MEDIA_MAPPING[props.initiative]) && ele.isFormat === 'true') {
      statValue = convertTimeFormat(initiativeData[Object.values(ele)[0]!]);
    } else {
      statValue = initiativeData[Object.values(ele)[0]!];
    }

    statsContents.push({
      id: index.toString(),
      stat: cumulativeData && statValue,
      label: `${t(Object.keys(ele)[0])}`,
    });
  });

  return (
    <div data-testid="ContributionStats">
      {(props.header || props.subHeader) && (
        <header className="d-flex flex-column">
          {props.header && <h3 className="w-100 mb-4">{props.header}</h3>}
          {props.subHeader && <span className={`font-family-rowdies display-3 mb-0`}>{props.subHeader}</span>}
        </header>
      )}
      <div className="mt-4 mt-md-5">
        <Stats contents={statsContents} />
      </div>
    </div>
  );
};

export default ContributionStats;
