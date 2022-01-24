import { act, renderHook, waitFor } from 'utils/testUtils';

import useSubmit from '../useSubmit';

describe('#useSubmit', () => {
  const setup = (url: string, withHeaders: boolean) => {
    return renderHook(() => useSubmit(url, withHeaders));
  };

  it('should use fetch and gets the success response', async () => {
    const url = '/some-url';
    const successResponse = { key: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    const { result } = setup(url, true);

    act(() => {
      result.current.submit();
    });

    await waitFor(() => expect(result.current.isLoading).toStrictEqual(false));
    await waitFor(() => expect(result.current.data).toStrictEqual(successResponse));
    await waitFor(() => expect(result.current.error).toStrictEqual(undefined));
  });

  it('should use fetch and gets the failed response', async () => {
    const url = '/some-url';
    const errorResponse = new Error('Some error');

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    const { result } = setup(url, false);

    act(() => {
      result.current.submit();
    });

    await waitFor(() => expect(result.current.isLoading).toStrictEqual(false));
    await waitFor(() => expect(result.current.data).toStrictEqual(undefined));
    await waitFor(() => expect(result.current.error).toStrictEqual(errorResponse));
  });
});
