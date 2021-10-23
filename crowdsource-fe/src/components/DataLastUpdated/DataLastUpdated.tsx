import moment from 'moment';
import { useTranslation } from 'next-i18next';

import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';
import type { DataLastUpdated as DataLastUpdatedType } from 'types/DataLastUpdated';

function DataLastUpdated() {
  const { t } = useTranslation();

  const { data } = useFetch<Array<DataLastUpdatedType>>(apiPaths.lastUpdatedTime);

  const lastUpdatedAt = data ? moment(data[0]['timezone']).format('DD-MM-YYYY, h:mm:ss a') : '';
  return (
    <div>
      {t('dataLastUpdated')}: {lastUpdatedAt}
    </div>
  );
}

export default DataLastUpdated;
