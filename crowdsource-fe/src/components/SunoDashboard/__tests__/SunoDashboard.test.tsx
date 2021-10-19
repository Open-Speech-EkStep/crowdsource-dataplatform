import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { screen, userEvent } from 'utils/testUtils';

jest.mock('components/MapChart', () => () => 'MapChart');
jest.mock('components/DataLastUpdated', () => () => 'DataLastUpdated');
import SunoDashboard from '../SunoDashboard';

describe('SunoDashboard', () => {
  const setup = async () => {
    fetchMock.doMockOnceIf('/aggregated-json/participationStats.json').mockResponseOnce(
      JSON.stringify([
        {
          count: '9',
          type: 'asr',
        },
        {
          count: '283',
          type: 'text',
        },
        {
          count: '53',
          type: 'ocr',
        },
        {
          count: null,
          type: 'parallel',
        },
      ])
    );
    fetchMock.doMockOnceIf('/aggregated-json/cumulativeCount.json').mockResponseOnce(
      JSON.stringify([
        {
          total_contribution_count: 37,
          total_contributions: 0.057,
          total_languages: 2,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'asr',
        },
      ])
    );
    fetchMock.doMockIf('/aggregated-json/cumulativeDataByLanguage.json').mockResponse(
      JSON.stringify([
        {
          language: 'English',
          total_contribution_count: 36,
          total_contributions: 0.057,
          total_speakers: 9,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'asr',
        },
      ])
    );
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SunoDashboard />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    return renderResult;
  };

  it('should render snapshot', async () => {
    const { asFragment } = await setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain language selector', async () => {
    await setup();
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
  });

  it('changing language from language selector should update stats', async () => {
    const renderRes = await setup();
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'English');
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    expect(screen.queryByText('languages')).not.toBeInTheDocument();
    expect(renderRes.asFragment()).toMatchSnapshot();
  });
});
