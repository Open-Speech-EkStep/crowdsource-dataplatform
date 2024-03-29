import { renderHook, waitFor } from 'utils/testUtils';

import useFetch, { useFetchWithInit } from '../useFetch';

describe('#useFetch', () => {
  const setup = (url: string) => {
    const renderHookResult = renderHook(() => useFetch(url, { dedupingInterval: 0 }));

    return renderHookResult;
  };

  it('should use fetch and gets the success response', async () => {
    const url = '/some-url';
    const successResponse = { key: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    const { result } = setup(url);

    await waitFor(() => expect(result.current.data).toStrictEqual(successResponse));
  });

  it('should use fetch and gets the failed response', async () => {
    const url = '/some-url';
    const errorResponse = new Error('Some error');

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    const { result } = setup(url);

    await waitFor(() => expect(result.current.error).toStrictEqual(errorResponse));
  });
});

describe('#useFetchWithInit', () => {
  const setup = (url: string) => {
    const renderHookResult = renderHook(() => useFetchWithInit(url, { dedupingInterval: 0 }));

    return renderHookResult;
  };

  it('should use fetch and gets the success response', async () => {
    const url = '/some-url';
    const successResponse = { key: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    const { result } = setup(url);

    await waitFor(() => expect(result.current.data).toStrictEqual(successResponse));
  });

  it('should use fetch and gets the failed response', async () => {
    const url = '/some-url';
    const errorResponse = new Error('Some error');

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    const { result } = setup(url);

    await waitFor(() => expect(result.current.error).toStrictEqual(errorResponse));
  });
});
