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
  showComponent?: boolean;
}

const ContributionStats = ({
  initiative,
  header,
  subHeader,
  showComponent = false,
}: ContributionStatsProps) => {
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
    (cumulativeData && cumulativeData.find(item => item.type === INITIATIVES_MEDIA_MAPPING[initiative])) ||
    {};
  const participationCount = participationStats?.find(
    item => item.type === INITIATIVES_MEDIA_MAPPING[initiative]
  )?.count;
  if (participationCount) {
    initiativeData.peopleParticipated = participationCount;
  }
  INITIATIVE_CUMULATIVE_VALUE[initiative].forEach((ele, index) => {
    let statValue;
    if (isSunoOrBoloInitiative(INITIATIVES_MEDIA_MAPPING[initiative]) && ele.isFormat === 'true') {
      statValue = convertTimeFormat(
        initiativeData[Object.values(ele)[0]!] ? initiativeData[Object.values(ele)[0]!] : '0'
      );
    } else {
      statValue = initiativeData[Object.values(ele)[0]!] ? initiativeData[Object.values(ele)[0]!] : '0';
    }

    statsContents.push({
      id: index.toString(),
      stat: cumulativeData && statValue,
      label: `${t(Object.keys(ele)[0])}`,
    });
  });

  const componentStatsUI = () => (
    <div data-testid="ContributionStats">
      {(header || subHeader) && (
        <header className="d-flex flex-column">
          {header && <h3 className="w-100 mb-4">{header}</h3>}
          {subHeader && <span className={`font-family-rowdies display-3 mb-0`}>{subHeader}</span>}
        </header>
      )}
      <div className="mt-4 mt-md-5">
        <Stats contents={statsContents} />
      </div>
    </div>
  );

  return showComponent
    ? componentStatsUI()
    : initiativeData && Object.keys(initiativeData).length
    ? componentStatsUI()
    : null;
};

export default ContributionStats;
