import { SWRConfig } from 'swr';

import { render, verifyAxeTest, screen, waitForElementToBeRemoved } from 'utils/testUtils';

import ParticipationStats from '../ParticipationStats';

describe('ParticipationStats', () => {
  const setup = async () => {
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

    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ParticipationStats />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup());
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result for landing page', async () => {
    await setup();
    expect(screen.getByText('BOLO INDIA')).toBeInTheDocument();
    expect(screen.getByText('SUNO INDIA')).toBeInTheDocument();
    expect(screen.getByText('DEKHO INDIA')).toBeInTheDocument();
    expect(screen.getByText('LIKHO INDIA')).toBeInTheDocument();
  });
});
