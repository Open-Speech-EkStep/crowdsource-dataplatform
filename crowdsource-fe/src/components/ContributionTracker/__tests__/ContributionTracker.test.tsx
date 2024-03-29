import '__fixtures__/mockComponentsWithSideEffects';

import { when } from 'jest-when';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import ContributionTracker from '../ContributionTracker';

describe('ContributionTracker', () => {
  const setup = async (initiative: 'tts' | 'translation' | 'asr' | 'ocr') => {
    const language = 'Hindi';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'English');

    fetchMock.doMockOnceIf('/aggregated-json/topLanguagesByHoursContributed.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'ocr',
        },
        {
          language: 'English',
          total_contributions: 0.049,
          type: 'asr',
        },
        {
          language: 'Punjabi',
          total_contributions: 0.069,
          type: 'asr',
        },
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
        {
          language: 'English-Hindi',
          total_contribution_count: 10,
          type: 'parallel',
        },
      ])
    );

    fetchMock.doMockOnceIf('/aggregated-json/topLanguagesBySpeakerContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'ocr',
        },
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'ocr',
        },
        {
          language: 'Hindi',
          total_speakers: 15,
          type: 'asr',
        },
        {
          language: 'Tamil',
          total_speakers: 14,
          type: 'asr',
        },
        {
          language: 'English',
          total_speakers: 13,
          type: 'asr',
        },
        {
          language: 'Punjabi',
          total_speakers: 13,
          type: 'asr',
        },
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'text',
        },
      ])
    );

    const renderResult = render(<ContributionTracker initiative={initiative} />);
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/topLanguagesByHoursContributed.json');
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/topLanguagesBySpeakerContributions.json');
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('tts');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the chart component after api gives data', async () => {
    await setup('translation');

    expect(screen.getByTestId('ContributionTracker').children.length).toBe(4);
    expect(screen.getByText('contributionTrackerSubHeader2')).toBeInTheDocument();
  });

  it('should render the chart for sentence data', async () => {
    await setup('tts');

    userEvent.click(screen.getAllByRole('radio')[1]);
    expect(screen.getByTestId('ContributionTracker').children.length).toBe(4);
  });

  it('should render the chart for speaker data', async () => {
    await setup('asr');

    userEvent.click(screen.getAllByRole('radio')[1]);
    expect(screen.getByTestId('ContributionTracker').children.length).toBe(4);
  });
});
