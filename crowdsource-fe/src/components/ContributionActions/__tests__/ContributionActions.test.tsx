import { when } from 'jest-when';

import { render, verifyAxeTest, screen, waitFor } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = async (initiativeType: string, initiative: string, language: string) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    fetchMock.doMockOnceIf('/aggregated-json/cumulativeCount.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Assamese',
          type: 'ocr',
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
          hastarget: true,
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
        {
          hastarget: false,
          isallcontributed: false,
          language: 'Assamese',
          type: 'text',
        },
      ])
    );

    const renderResult = render(
      <ContributionActions
        initiativeType={initiativeType}
        initiative={initiative}
        contributionLanguage={language}
      />
    );
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeCount.json');
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/enableDisableCards.json');
    });
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup('asr', 'suno', 'Hindi'));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('text', 'bolo', 'Assamese');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should handle both cards enable', async () => {
    await setup('asr', 'suno', 'Hindi');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).toHaveClass('d-none');
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).toHaveClass('d-none');
    });
  });

  it('should handle both cards disable', async () => {
    await setup('text', 'bolo', 'Assamese');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).not.toHaveClass('d-none');
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
    });
  });
});
