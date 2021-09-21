import { render, verifyAxeTest } from 'utils/testUtils';

import TargetProgress from '../TargetProgress';

describe('TargetProgress', () => {
  const setup = async () => {
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
          contribution_goal: 60000,
          type: 'asr',
          validation_goal: 60000,
        },
        {
          contribution_goal: 60000,
          type: 'text',
          validation_goal: 60000,
        },
      ])
    );

    const renderResult = render(<TargetProgress initiative="'suno'" initiativeMedia="'asr'" />);
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup());
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
