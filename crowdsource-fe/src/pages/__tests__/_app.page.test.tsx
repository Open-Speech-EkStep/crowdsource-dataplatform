import jestFetchMock from 'jest-fetch-mock';
import type { Router } from 'next/router';
import router from 'next/router';

import '__fixtures__/mockComponentsWithSideEffects';
import { act, render, screen, verifyAxeTest } from 'utils/testUtils';

import App from '../_app.page';

describe('App', () => {
  jestFetchMock.enableMocks();

  const setup = () => {
    router.pathname = '/tts-initiative/dashboard';
    const mockIpAddress = '111.111.11.111';

    fetchMock
      .doMockOnceIf('https://www.cloudflare.com/cdn-cgi/trace')
      .mockResponseOnce(`ip=${mockIpAddress}`);

    fetchMock.doMockIf(`/location-info?ip=${mockIpAddress}`).mockResponse(JSON.stringify({}));

    const Component = () => <div>Hello World</div>;

    return render(<App Component={Component} pageProps={{}} router={(router as unknown) as Router} />);
  };

  verifyAxeTest(setup());

  it('should render the Layout component', () => {
    setup();

    expect(screen.getByTestId('Layout')).toBeInTheDocument();
  });

  it('should render the passed component', () => {
    setup();

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render the Feedback component', () => {
    setup();

    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('should render and close the language notification modal component', async () => {
    setup();

    const newValue = 'new value';
    const oldValue = 'old value';
    const localStorageKey = 'contributionLanguage';

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: localStorageKey,
        newValue: newValue,
        oldValue: oldValue,
      });

      window.dispatchEvent(storageEvent);
    });

    expect(screen.getByTestId('Modal')).toBeInTheDocument();
  });
});
