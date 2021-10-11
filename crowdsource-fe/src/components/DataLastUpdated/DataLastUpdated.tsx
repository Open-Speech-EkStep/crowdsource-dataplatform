import { useTranslation } from 'next-i18next';

import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { DataLastUpdated as DataLastUpdatedType } from 'types/DataLastUpdated';

function DataLastUpdated() {
  const { t } = useTranslation();

  const { data: dateTime } = useFetch<Array<DataLastUpdatedType>>(apiPaths.lastUpdatedTime);

  if (dateTime) {
    return (
      <div>
        {t('dataLastUpdated')}: {dateTime[0].timezone}
      </div>
    );
  } else {
    return <div>Hello</div>;
  }
}

export default DataLastUpdated;
