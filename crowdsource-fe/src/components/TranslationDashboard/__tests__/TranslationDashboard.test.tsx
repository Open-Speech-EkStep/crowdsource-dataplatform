import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { screen, userEvent } from 'utils/testUtils';

jest.mock('components/Charts/MapChart', () => () => 'MapChart');
jest.mock('components/Charts/LineChart', () => () => 'LineChart');
jest.mock('components/DataLastUpdated', () => () => 'DataLastUpdated');
import TranslationDashboard from '../TranslationDashboard';

describe('TranslationDashboard', () => {
  global.document.getElementById = jest.fn().mockReturnValue({
    style: {
      width: '50%',
    },
  });

  const fromLanguageElement = () => screen.getByRole('combobox', { name: 'Select From Language' });
  const toLanguageElement = () => screen.getByRole('combobox', { name: 'Select To Language' });

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
          count: 10,
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
          type: 'parallel',
        },
      ])
    );
    fetchMock.doMockIf('/aggregated-json/cumulativeDataByLanguage.json').mockResponse(
      JSON.stringify([
        {
          language: 'English-Hindi',
          total_contribution_count: 36,
          total_contributions: 0.057,
          total_speakers: 9,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'parallel',
        },
      ])
    );
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TranslationDashboard />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    return renderResult;
  };

  it('should contain language selector', async () => {
    await setup();
    expect(fromLanguageElement()).toBeInTheDocument();
    expect(toLanguageElement()).toBeInTheDocument();
    expect(toLanguageElement()).toBeDisabled();
  });

  it('changing language in language pair selector should update stats', async () => {
    await setup();
    userEvent.selectOptions(fromLanguageElement(), 'English');
    expect(toLanguageElement()).toBeEnabled();
    userEvent.selectOptions(toLanguageElement(), 'Hindi');
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    expect(screen.queryByText('languages')).not.toBeInTheDocument();
  });

  it('changing from language back to all should show all language stats', async () => {
    await setup();
    userEvent.selectOptions(fromLanguageElement(), 'English');
    expect(toLanguageElement()).toBeEnabled();
    userEvent.selectOptions(fromLanguageElement(), 'all');
    expect(fromLanguageElement()).toHaveValue('all');
    expect(toLanguageElement()).toHaveValue('all');
  });

  it('should show default languages when all languages selected in to language dropdown', async () => {
    await setup();
    userEvent.selectOptions(fromLanguageElement(), 'English');
    userEvent.selectOptions(toLanguageElement(), 'Hindi');
    userEvent.selectOptions(toLanguageElement(), 'all');
    await waitFor(() => expect(fromLanguageElement()).toHaveValue('all'));
    await waitFor(() => expect(toLanguageElement()).toHaveValue('all'));
  });

  it('changing language from language pair selector should display nodata message when data not available', async () => {
    await setup();
    userEvent.selectOptions(fromLanguageElement(), 'English');
    userEvent.selectOptions(toLanguageElement(), 'Hindi');
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    userEvent.selectOptions(toLanguageElement(), 'Bengali');
    await waitFor(() => expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json'));
    await waitFor(() => expect(screen.getByText('noDataMessageDashboard')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('noDataMessageDashboard')).not.toBeInTheDocument());
    expect(screen.queryByText('languages')).not.toBeInTheDocument();
  });

  it('changing to language where data not available and clicking contribute now should display change user modal for new user', async () => {
    await setup();
    userEvent.selectOptions(fromLanguageElement(), 'English');
    userEvent.selectOptions(toLanguageElement(), 'Bengali');
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
    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'Hindi');
    await setup();
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    userEvent.selectOptions(fromLanguageElement(), 'English');
    userEvent.selectOptions(toLanguageElement(), 'Bengali');
    await waitFor(() => {
      expect(screen.getByText('noDataMessageDashboard')).toBeInTheDocument();
    });
    userEvent.click(screen.getByRole('button', { name: 'contributeNow' }));
    await waitFor(() => expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument());
    expect(localStorage.setItem).toBeCalledWith('contributionLanguage', 'English');
    expect(localStorage.setItem).toBeCalledWith('translatedLanguage', 'Bengali');
  });
});
