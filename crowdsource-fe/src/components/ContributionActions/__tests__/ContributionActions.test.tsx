import { when } from 'jest-when';

import { render, verifyAxeTest, screen } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = async () => {
    const language = 'Hindi';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
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

    fetchMock.doMockOnceIf('/aggregated-json/enableDisableCards.json').mockResponseOnce(
      JSON.stringify([
        {
          hastarget: true,
          isallcontributed: true,
          language: 'Bengali',
          type: 'asr',
        },
        {
          hastarget: false,
          isallcontributed: false,
          language: 'Hindi',
          type: 'asr',
        },
        {
          hastarget: true,
          isallcontributed: true,
          language: 'English',
          type: 'asr',
        },
      ])
    );

    const renderResult = render(<ContributionActions initiativeMedia="asr" contributionLanguage="Hindi" />);
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup());
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the result of card state', async () => {
    await setup();

    expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).toHaveClass('cardWarning');
  });
});