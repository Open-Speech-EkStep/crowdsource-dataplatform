import { when } from 'jest-when';

import { render, screen, waitFor } from 'utils/testUtils';

import TargetProgress from '../TargetProgress';

describe('TargetProgress', () => {
  const setup = async (
    initiative: 'tts' | 'asr' | 'ocr' | 'translation',
    initiativeMedia: 'asr' | 'ocr' | 'parallel' | 'text',
    source?: 'contribute' | 'validate',
    contributionLanguage?: string
  ) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'English');

    fetchMock.doMockOnceIf('/aggregated-json/cumulativeCount.json').mockResponseOnce(
      JSON.stringify([
        {
          total_contribution_count: 45,
          total_contributions: 0.031,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.002,
          type: 'asr',
        },
        {
          total_contribution_count: 9,
          total_contributions: 0.0,
          total_languages: 3,
          total_speakers: 11,
          total_validation_count: 0,
          total_validations: 0.0,
          type: 'ocr',
        },
        {
          total_contribution_count: 45,
          total_contributions: 0.0,
          total_languages: 2,
          total_speakers: 10,
          total_validation_count: 8,
          total_validations: 0.0,
          type: 'parallel',
        },
        {
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

    fetchMock.doMockOnceIf('/aggregated-json/initiativeGoals.json').mockResponseOnce(
      JSON.stringify([
        {
          contribution_goal: 60000,
          type: 'parallel',
          validation_goal: 60000,
        },
        {
          contribution_goal: 60000,
          type: 'ocr',
          validation_goal: 60000,
        },
        {
          contribution_goal: 60,
          type: 'asr',
          validation_goal: 60,
        },
        {
          contribution_goal: 60,
          type: 'text',
        },
      ])
    );

    const renderResult = render(
      <TargetProgress
        initiative={initiative}
        initiativeType={initiativeMedia}
        source={source}
        language={contributionLanguage}
      />
    );
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeCount.json');
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/initiativeGoals.json');
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('tts', 'asr');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for tts initiative home page', async () => {
    await setup('tts', 'asr', 'contribute');
    expect(screen.getByText('ttsProgressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('1 minutes1/60 hours1');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for ocr initiative validate', async () => {
    await setup('ocr', 'ocr', 'validate');
    expect(screen.getByText('ocrProgressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('0/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for ocr initiative contribute', async () => {
    await setup('ocr', 'ocr', 'contribute');
    expect(screen.getByText('ocrProgressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('9/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for translation initiative contribute', async () => {
    await setup('translation', 'parallel', 'contribute');

    expect(screen.getByText('translationProgressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('45/60000 sentences');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for translation initiative', async () => {
    await setup('translation', 'parallel');

    expect(screen.getByText('translationProgressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('53/120000 sentences');
      })
    ).toBeInTheDocument();
  });

  it('should print goal as 1 if goal is undefined', async () => {
    await setup('asr', 'text', 'validate');

    expect(
      screen.getByText(content => {
        return content.includes('/1 hours');
      })
    ).toBeInTheDocument();
  });
});
