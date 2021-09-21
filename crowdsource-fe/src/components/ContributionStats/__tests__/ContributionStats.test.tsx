import { render, verifyAxeTest, screen, waitForElementToBeRemoved } from 'utils/testUtils';

import ContributionStats from '../ContributionStats';

describe('ContributionStats', () => {
  const setup = async (value: any) => {
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

    const renderResult = render(<ContributionStats initiativeMedia={value}> </ContributionStats>);
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup(undefined));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup(undefined);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for initiative home page', async () => {
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
          type: 'ocr',
        },
        {
          total_contribution_count: 45,
          total_contributions: 0.031,
          total_languages: 2,
          total_speakers: 11,
          total_validation_count: 8,
          total_validations: 0.002,
          type: 'text',
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
    await setup('asr');
    expect(screen.getByText('People Participated')).toBeInTheDocument();
  });

  it('should render the result for landing page', async () => {
    await setup(undefined);
    expect(screen.getByText('Suno India')).toBeInTheDocument();
  });
});
