import { renderHook, waitFor } from 'utils/testUtils';

import useFetch from '../useFetch';

describe('#usePostFetch', () => {
  const setup = (url: any) => {
    const renderHookResult = renderHook(() =>
      useFetch({
        url: url,
        init: {
          body: JSON.stringify({ language: 'English', userName: 'BadgeTest' }),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      })
    );

    return renderHookResult;
  };

  it('should use fetch and gets the success response', async () => {
    const url = '/some-url';
    const successResponse = { key: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    const { result } = setup(url);

    await waitFor(() => expect(result.current.data).toStrictEqual(successResponse));
    await waitFor(() => expect(result.current.error).toStrictEqual(undefined));
  });

  it('should use fetch and gets the failed response', async () => {
    const url = '/some-url';
    const errorResponse = new Error('Some error');

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    const { result } = setup(url);

    expect(result.error).toBe(undefined);
  });
});
