import { useCallback, useState } from 'react';

const useSubmit = <Data = any, Error = any>(key: string, withHeaders: boolean = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const [error, setError] = useState<Error>();

  const submit = useCallback(
    async (body?) => {
      try {
        setIsLoading(true);

        const res = await fetch(key, {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          body,
          headers: withHeaders ? { 'Content-type': 'application/json' } : undefined,
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
    [key, withHeaders]
  );

  return {
    isLoading,
    data,
    error,
    submit,
  };
};

export default useSubmit;
