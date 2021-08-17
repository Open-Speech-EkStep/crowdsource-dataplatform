import { useCallback } from 'react';

import useFetch from 'hooks/useFetch';
import { useRouter } from 'next/router';

import apiPaths from 'constants/apiPaths';

function useTranslate() {
  const { locale: currentLocale } = useRouter();
  const { data, error } = useFetch(apiPaths.locales(currentLocale), {
    dedupingInterval: 24 * 3600 * 1000,
    shouldRetryOnError: false,
  });
  const translate = useCallback(key => (!data || error ? '...' : data[key] ?? key), [data, error]);

  return {
    translate,
  };
}

export default useTranslate;
