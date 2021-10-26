import { SWRConfig } from 'swr';

import { render, verifyAxeTest, screen, waitForElementToBeRemoved } from 'utils/testUtils';

import ContributionStatsByLanguage from '../ContributionStatsByLanguage';

describe('ContributionStatsByLanguage', () => {
  const setup = async (initiative: 'suno' | 'bolo' | 'likho' | 'dekho') => {
    fetchMock.doMockOnceIf('/aggregated-json/cumulativeDataByLanguage.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'English',
          total_speakers: 8,
          total_contributions: 0.039,
          total_validations: 0.0,
          total_contribution_count: 24,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          language: 'Hindi',
          total_speakers: 6,
          total_contributions: 0.021,
          total_validations: 0.05,
          total_contribution_count: 20,
          total_validation_count: 2,
          type: 'asr',
        },
      ])
    );

    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ContributionStatsByLanguage initiative={initiative} language="Hindi" handleNoData={() => {}} />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup('suno'));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('suno');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for initiative home page', async () => {
    await setup('suno');
    expect(screen.getByText('peopleParticipated')).toBeInTheDocument();
    expect(screen.getByText('durationTranscribed')).toBeInTheDocument();
    expect(screen.getByText('durationValidated')).toBeInTheDocument();
    expect(screen.getByText('1 minutes1')).toBeInTheDocument();
    expect(screen.getByText('3 minutes1')).toBeInTheDocument();
  });

  it('should display zeros when no data found for initiative', async () => {
    await setup('dekho');
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
