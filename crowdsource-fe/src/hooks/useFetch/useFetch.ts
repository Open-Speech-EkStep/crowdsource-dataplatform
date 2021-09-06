import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const useFetch = <Data = any, Error = any>(key: string, options?: SWRConfiguration) => {
  return useSWR<Data, Error>(key, fetcher, options);
};

export default useFetch;
