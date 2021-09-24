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
      <ContributionStats initiativeMedia={value} initiative="suno">
        {' '}
      </ContributionStats>
    );
    value !== 'asr' ? waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner')) : null;
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup(undefined));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render the data when "no" data is present for inititative', async () => {
    await setup('parallel');
    expect(screen.getByTestId('StatsRow').children.length).toEqual(0);
  });

  it('should render the result for initiative home page', async () => {
    await setup('asr');
    expect(screen.getByText('People participated')).toBeInTheDocument();
    expect(screen.getByText('Duration transcribed')).toBeInTheDocument();
    expect(screen.getByText('Duration Validated')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('should render the result for landing page', async () => {
    await setup();
    expect(screen.getByText('bolo india')).toBeInTheDocument();
    expect(screen.getByText('suno india')).toBeInTheDocument();
    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('likho india')).toBeInTheDocument();
  });
});
