import { useState, useEffect, useCallback } from 'react';

interface RequestProps<T> {
  url: RequestInfo;
  init?: RequestInit;
  processData?: (data: any) => T;
}

const useFetch = <T>({ url, init, processData }: RequestProps<T>) => {
  // Response state
  const [data, setData] = useState<T>();

  const [error, setError] = useState<any>();

  // Turn objects into strings for useCallback & useEffect dependencies
  const [stringifiedUrl, stringifiedInit] = [JSON.stringify(url), JSON.stringify(init)];

  // If no processing function is passed just cast the object to type T
  // The callback hook ensures that the function is only created once
  // and hence the effect hook below doesn't start an infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processJson = useCallback(processData || ((jsonBody: any) => jsonBody as T), []);

  useEffect(() => {
    // Define asynchronous function
    if (!stringifiedInit) return;
    const fetchApi = async () => {
      try {
        // Fetch data from REST API
        const response = await fetch(url, init);
        /* istanbul ignore next */
        if (!response.ok) {
          throw response;
        }
        // Extract json
        const rawData: any = await response.json();
        const processedData = processJson(rawData);
        setData(processedData);
        setError(undefined);
      } catch (error) {
        setError(error);
      }
    };
    // Call async function
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedUrl, stringifiedInit, processJson]);

  return { data, error };
};

export default useFetch;
