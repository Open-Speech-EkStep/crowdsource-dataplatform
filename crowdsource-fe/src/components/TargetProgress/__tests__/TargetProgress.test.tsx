import { when } from 'jest-when';

import { render, screen, waitFor } from 'utils/testUtils';

import TargetProgress from '../TargetProgress';

describe('TargetProgress', () => {
  const setup = async (
    initiative: any,
    initiativeMedia: string,
    source?: string,
    contributionLanguage?: string
  ) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('likho_to-language')
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
          total_contribution_count: 45,
          total_contributions: 0.0,
          total_languages: 3,
          total_speakers: 11,
          total_validation_count: 9,
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
    const { asFragment } = await setup('suno', 'asr');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for suno initiative home page', async () => {
    await setup('suno', 'asr', 'contribute');
    expect(screen.getByText('progressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('1 minutes/60 hours');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for dekho initiative validate', async () => {
    await setup('dekho', 'ocr', 'validate');
    expect(screen.getByText('progressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('9/60000 images');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for likho initiative contribute', async () => {
    await setup('likho', 'parallel', 'contribute');

    expect(screen.getByText('progressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('45/60000 sentences');
      })
    ).toBeInTheDocument();
  });

  it('should render the result for likho initiative', async () => {
    await setup('likho', 'parallel');

    expect(screen.getByText('progressStatus')).toBeInTheDocument();
    expect(
      screen.getByText(content => {
        return content.includes('53/120000 sentences');
      })
    ).toBeInTheDocument();
  });

  it('should print goal as 1 if goal is undefined', async () => {
    await setup('bolo', 'text', 'validate');

    expect(
      screen.getByText(content => {
        return content.includes('/1 hours');
      })
    ).toBeInTheDocument();
  });
});
