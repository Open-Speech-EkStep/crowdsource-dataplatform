import { when } from 'jest-when';

import { render, screen, waitFor } from 'utils/testUtils';

import TyTargetProgress from '../TyTargetProgress';

describe('TyTargetProgress', () => {
  const setup = async (
    initiative: 'tts' | 'asr' | 'translation' | 'ocr',
    initiativeMedia: 'asr' | 'ocr' | 'parallel' | 'text',
    source?: string,
    contributionLanguage?: string
  ) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'English');

    fetchMock.doMockOnceIf('/aggregated-json/cumulativeDataByLanguage.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi',
          total_contribution_count: 45,
          total_contributions: 0.031,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.002,
          type: 'asr',
        },
        {
          language: 'English',
          total_contribution_count: 45,
          total_contributions: 0.0,
          total_languages: 3,
          total_speakers: 11,
          total_validation_count: 9,
          total_validations: 0.0,
          type: 'ocr',
        },
        {
          language: 'Hindi-English',
          total_contribution_count: 45,
          total_contributions: 0.0,
          total_languages: 2,
          total_speakers: 10,
          total_validation_count: 8,
          total_validations: 0.0,
          type: 'parallel',
        },
        {
          language: 'English',
          total_contribution_count: 45,
          total_contributions: 6.3,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.2,
          type: 'text',
        },
      ])
    );

    fetchMock.doMockOnceIf('/aggregated-json/initiativeGoalsByLanguage.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi-English',
          contribution_goal: 60000,
          type: 'parallel',
          validation_goal: 60000,
        },
        {
          language: 'English',
          contribution_goal: 60000,
          type: 'ocr',
          validation_goal: 60000,
        },
        {
          language: 'Hindi',
          contribution_goal: 60,
          type: 'asr',
          validation_goal: 60,
        },
        {
          language: 'Hindi',
          contribution_goal: 60,
          type: 'text',
        },
      ])
    );

    const renderResult = render(
      <TyTargetProgress
        initiative={initiative}
        initiativeType={initiativeMedia}
        source={source ?? ''}
        language={contributionLanguage ?? ''}
      />
    );
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguage.json');
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/initiativeGoalsByLanguage.json');
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('tts', 'asr', 'contribute', 'English');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for tts initiative home page', async () => {
    await setup('tts', 'asr', 'contribute', 'Hindi');
    expect(screen.getByText('ttsProgressStatusWithLanguage')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('1 minutes1/60 hours1');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for ocr initiative validate', async () => {
    await setup('ocr', 'ocr', 'validate', 'English');
    expect(screen.getByText('ocrProgressStatusWithLanguage')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('9/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for ocr initiative contribute', async () => {
    await setup('ocr', 'ocr', 'contribute', 'English');
    expect(screen.getByText('ocrProgressStatusWithLanguage')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('45/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for ocr initiative validate without language', async () => {
    await setup('ocr', 'ocr', 'validate');
    expect(screen.getByText('ocrProgressStatusWithLanguage')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('0/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for translation initiative contribute', async () => {
    await setup('translation', 'parallel', undefined, 'English');

    expect(screen.getByText('translationProgressStatusWithLanguage')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('0/1 sentences');
      })
    ).toBeInTheDocument();
  });

  it('should print goal as 1 if goal is undefined', async () => {
    await setup('asr', 'text', 'validate', 'Hindi');

    expect(
      screen.getByText(content => {
        return content.includes('/1 hours');
      })
    ).toBeInTheDocument();
  });
});
