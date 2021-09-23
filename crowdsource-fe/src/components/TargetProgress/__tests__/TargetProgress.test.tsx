import { when } from 'jest-when';

import { render, screen } from 'utils/testUtils';

import TargetProgress from '../TargetProgress';

describe('TargetProgress', () => {
  const setup = async (initiativeValue: any, sourceValue?: string, contributionLanguage?: string) => {
    const language = 'Hindi';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

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
          total_contributions: 0.031,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.002,
          type: 'asr',
        },
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
          total_contributions: 0.031,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.002,
          type: 'asr',
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
          validation_goal: 60,
        },
      ])
    );

    const renderResult = render(
      <TargetProgress
        initiative={initiativeValue}
        initiativeMedia="asr"
        source={sourceValue}
        language={contributionLanguage}
      />
    );
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('suno');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for suno and bolo initiative home page', async () => {
    await setup('suno');

    expect(screen.getByText('of Suno India Target Achieved')).toBeInTheDocument();
  });

  it('should render the result for suno and bolo initiative thank you page with source', async () => {
    await setup('bolo', 'Contribute');

    expect(screen.getByText('of Bolo India Target Achieved')).toBeInTheDocument();
  });

  it('should render the result for likho initiative home page', async () => {
    await setup('likho', 'Contribute');

    expect(screen.getByText('of Likho India Target Achieved')).toBeInTheDocument();
  });

  it('should render the result for dekho initiative home page', async () => {
    await setup('dekho', 'Validate');

    expect(screen.getByText('of Dekho India Target Achieved')).toBeInTheDocument();
  });

  it('should render the result for likho initiative dashboard page', async () => {
    await setup('likho', 'Contribute', 'English-Hindi');

    expect(screen.getByText('of Likho India Target Achieved')).toBeInTheDocument();
  });
});
