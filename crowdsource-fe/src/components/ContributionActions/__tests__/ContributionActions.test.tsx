import { render, verifyAxeTest } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = async () => {
    fetchMock.doMockOnceIf('/aggregated-json/languagesWithData.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Assamese',
          type: 'asr',
        },
        {
          language: 'Hindi',
          type: 'asr',
        },
        {
          language: 'Hindi',
          type: 'ocr',
        },
        {
          language: 'Hindi',
          type: 'parallel',
        },
      ])
    );

    const renderResult = render(<ContributionActions initiativeMedia="'asr'" />);
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
