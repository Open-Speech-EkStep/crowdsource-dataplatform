import { useCallback, useState } from 'react';

const useSubmit = <Data = any, Error = any>(
  key: string,
  { method = 'POST', headers = { 'Content-Type': 'application/json' } } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const [error, setError] = useState<Error>();

  const submit = useCallback(
    async (body?) => {
      try {
        setIsLoading(true);

        const res = await fetch(key, {
          method,
          body,
          headers,
        });

        setIsLoading(false);
        setData(await res.json());
        setError(undefined);
      } catch (err: any) {
        setIsLoading(false);
        setData(undefined);
        setError(err);
      }
    },
    [key, method, headers]
  );

  return {
    isLoading,
    data,
    error,
    submit,
  };
};

export default useSubmit;
