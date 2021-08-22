import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

function useFetch(key, options) {
  return useSWR(key, fetcher, options);
}

export default useFetch;
