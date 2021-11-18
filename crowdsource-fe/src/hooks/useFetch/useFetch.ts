import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

type ValueKey = string | any[] | null;

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const useFetch = <Data = any, Error = any>(key: ValueKey | (() => ValueKey), options?: SWRConfiguration) => {
  return useSWR<Data, Error>(key, fetcher, {
    ...options,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
};

const paramFetcher = (key: string) =>
  fetch(key, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  }).then(res => res.json());

export const useFetchWithInit = <Data = any, Error = any>(
  key: ValueKey | (() => ValueKey),
  options?: SWRConfiguration
) => {
  return useSWR<Data, Error>(key, paramFetcher, {
    ...options,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
};

export default useFetch;
