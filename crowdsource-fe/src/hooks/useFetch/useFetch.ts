import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

type ValueKey = string | any[] | null;

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const useFetch = <Data = any, Error = any>(key: ValueKey | (() => ValueKey), options?: SWRConfiguration) => {
  return useSWR<Data, Error>(key, fetcher, { ...options, revalidateOnFocus: false });
};

const paramFetcher = (key: string) =>
  fetch(key, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());

export const useFetchWithHeader = <Data = any, Error = any>(
  key: ValueKey | (() => ValueKey),
  options?: SWRConfiguration
) => {
  return useSWR<Data, Error>(key, paramFetcher, { ...options, revalidateOnFocus: false });
};

export default useFetch;
