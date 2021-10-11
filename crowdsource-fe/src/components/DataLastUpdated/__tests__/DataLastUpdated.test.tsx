import { render, waitFor } from '@testing-library/react';

import DataLastUpdated from '../DataLastUpdated';

describe('DataLastUpdated', () => {
  const setup = async () => {
    const url = '/aggregated-json/lastUpdatedAtQuery.json';
    fetchMock
      .doMockOnceIf(url)
      .mockResponseOnce(JSON.stringify([{ timezone: '2021-10-11T13:30:05.744813' }]));

    const renderResult = render(<DataLastUpdated />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(url);
    });
    return renderResult;
  };

  it('should render snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
