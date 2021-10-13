import { SWRConfig } from 'swr';

import { render, verifyAxeTest, screen, waitForElementToBeRemoved } from 'utils/testUtils';

import ContributionStats from '../ContributionStats';

describe('ContributionStats', () => {
  const setup = async (value?: any) => {
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

    fetchMock.doMockOnceIf('/aggregated-json/cumulativeCount.json').mockResponseOnce(
      JSON.stringify([
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

    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ContributionStats initiative={value} />
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
    expect(screen.getByText('languages')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('should render the result for likho initiative home page', async () => {
    await setup('bolo');
    expect(screen.getByText('peopleParticipated')).toBeInTheDocument();
    expect(screen.getByText('durationTranscribed')).toBeInTheDocument();
    expect(screen.getByText('durationValidated')).toBeInTheDocument();
    expect(screen.getByText('languages')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('283')).toBeInTheDocument();
  });
});
