import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const useFetch = (key: string, options: SWRConfiguration) => {
  return useSWR(key, fetcher, options);
};

export default useFetch;
