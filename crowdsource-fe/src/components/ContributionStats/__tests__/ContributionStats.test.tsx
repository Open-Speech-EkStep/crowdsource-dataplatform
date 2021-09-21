import { render, verifyAxeTest, screen, waitForElementToBeRemoved } from 'utils/testUtils';

import ContributionStats from '../ContributionStats';

describe('ContributionStats', () => {
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

    const renderResult = render(<ContributionStats initiativeMedia="'asr'" />);
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
});
