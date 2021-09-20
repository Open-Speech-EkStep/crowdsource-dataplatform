import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

type ValueKey = string | any[] | null;

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const useFetch = <Data = any, Error = any>(key: ValueKey | (() => ValueKey), options?: SWRConfiguration) => {
  return useSWR<Data, Error>(key, fetcher, options);
};

export default useFetch;
