import '__fixtures__/mockComponentsWithSideEffects';

import { when } from 'jest-when';

import { render, screen, waitFor } from 'utils/testUtils';

import CompareLanguages from '../CompareLanguages';

describe('CompareLanguages', () => {
  const setup = async (initiative: 'tts' | 'translation' | 'asr' | 'ocr', source: string) => {
    const language = 'Hindi';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'English');

    fetchMock.doMockOnceIf('/aggregated-json/cumulativeDataByLanguage.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'English',
          total_contribution_count: 37,
          total_contributions: 0.058,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'asr',
        },
        {
          language: 'English',
          total_contribution_count: 37,
          total_contributions: 0.058,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'ocr',
        },
        {
          language: 'Hindi',
          total_contribution_count: 37,
          total_contributions: 0.058,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.06,
          type: 'text',
        },
        {
          language: 'Hindi',
          total_contribution_count: 37,
          total_contributions: 0.068,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'asr',
        },
        {
          language: 'Hindi-English',
          total_contribution_count: 37,
          total_contributions: 0.058,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'parallel',
        },
        {
          language: 'Kannada',
          total_contribution_count: 37,
          total_contributions: 0.054,
          total_speakers: 10,
          total_validation_count: 2,
          total_validations: 0.001,
          type: 'asr',
        },
      ])
    );

    const renderResult = render(
      <CompareLanguages
        initiative={initiative}
        dataBindigValue="total_contributions"
        graphLabel="ttsContributionGraphYLabel3"
        isTopLanguage={() => {}}
        graphHeading="Participate to keep Bengali in top 3"
        showHeader={true}
        source={source}
      />
    );
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('tts', 'contribute');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the chart component after api gives data', async () => {
    await setup('translation', 'contribute');

    expect(screen.getByTestId('CompareLanguages').children.length).toBe(3);
  });

  it('should render the chart component for asr Initiative after api gives data', async () => {
    await setup('asr', 'validate');

    expect(screen.getByTestId('CompareLanguages').children.length).toBe(3);
  });
});
