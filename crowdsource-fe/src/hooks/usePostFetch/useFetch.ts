import { useState, useEffect, useCallback } from 'react';

interface RequestProps<T> {
  url: RequestInfo;
  init?: RequestInit;
  processData?: (data: any) => T;
}

const useFetch = <T>({ url, init, processData }: RequestProps<T>) => {
  // Response state
  const [data, setData] = useState<T>();

  // Turn objects into strings for useCallback & useEffect dependencies
  const [stringifiedUrl, stringifiedInit] = [JSON.stringify(url), JSON.stringify(init)];

  // If no processing function is passed just cast the object to type T
  // The callback hook ensures that the function is only created once
  // and hence the effect hook below doesn't start an infinite loop
  const processJson = useCallback(processData || ((jsonBody: any) => jsonBody as T), []);

  useEffect(() => {
    // Define asynchronous function
    const fetchApi = async () => {
      try {
        // Fetch data from REST API
        const response = await fetch(url, init);
        // Extract json
        const rawData: any = await response.json();
        const processedData = processJson(rawData);
        setData(processedData);
      } catch (error) {
        console.error(`Error ${error}`);
      }
    };
    // Call async function
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedUrl, stringifiedInit, processJson]);

  return data;
};

export default useFetch;
