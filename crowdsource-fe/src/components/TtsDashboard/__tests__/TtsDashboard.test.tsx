import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { screen, userEvent } from 'utils/testUtils';

import TtsDashboard from '../TtsDashboard';

jest.mock('components/Charts/MapChart', () => () => 'MapChart');
jest.mock('components/Charts/LineChart', () => () => 'LineChart');
jest.mock('components/DataLastUpdated', () => () => 'DataLastUpdated');

describe('TtsDashboard', () => {
  global.document.getElementById = jest.fn().mockImplementation(
    x =>
      x === 'float' && {
        style: {
          width: '50%',
        },
      }
  );

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
        <TtsDashboard />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    return renderResult;
  };
  it('should contain language selector', async () => {
    await setup();
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
  });

  it('changing language from language selector should update stats', async () => {
    await setup();
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'English');
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    expect(screen.queryByText('languages')).not.toBeInTheDocument();
  });

  it('changing language from language selector should display nodata message when data not available', async () => {
    await setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'English');
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'Bengali');
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    });
    await waitFor(() => {
      expect(screen.getByText('noDataMessageDashboard')).toBeInTheDocument();
    });
    await waitFor(() => expect(screen.queryByText('noDataMessageDashboard')).not.toBeInTheDocument());
    expect(screen.queryByText('languages')).not.toBeInTheDocument();
  });

  it('changing to language where data not available and clicking contribute now should display change user modal for new user', async () => {
    await setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'Bengali');
    await waitFor(() => {
      expect(screen.getByText('noDataMessageDashboard')).toBeInTheDocument();
    });
    userEvent.click(screen.getByRole('button', { name: 'contributeNow' }));
    await waitFor(() => expect(screen.getByTestId('ChangeUserForm')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitForElementToBeRemoved(() => screen.queryByTestId('ChangeUserModal'));
  });

  it('changing to language where data not available and clicking contribute now should redirect for existing user', async () => {
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(
        () => '{"userName":"abc","motherTongue":"","age":"","gender":"","language":"English","toLanguage":""}'
      );
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'English');
    await setup();
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'Bengali');
    await waitFor(() => {
      expect(screen.getByText('noDataMessageDashboard')).toBeInTheDocument();
    });
    userEvent.click(screen.getByRole('button', { name: 'contributeNow' }));
    await waitFor(() => expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument());
  });
});
