import { useCallback, useState } from 'react';

const useSubmit = <Data = any, Error = any>(key: string, { method = 'POST' } = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const [error, setError] = useState<Error>();

  const submit = useCallback(async (body?) => {
    try {
      setIsLoading(true);

      const res = await fetch(key, { method, body });

      setIsLoading(false);
      setData(await res.json());
      setError(undefined);
    } catch (err: any) {
      setIsLoading(false);
      setData(undefined);
      setError(err);
    }
  }, []);

  return {
    isLoading,
    data,
    error,
    submit,
  };
};

export default useSubmit;
