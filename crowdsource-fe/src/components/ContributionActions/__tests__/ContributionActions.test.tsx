import { when } from 'jest-when';

import { render, verifyAxeTest, screen, waitFor } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = async (initiative: 'tts' | 'asr' | 'translation' | 'ocr', language: string) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => 'Hindi');

    const speakerDetails = {
      userName: 'abc',
      motherTongue: '',
      age: '',
      gender: '',
      language: 'English',
      toLanguage: '',
    };

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    fetchMock.doMockOnceIf('/aggregated-json/languagesWithData.json').mockResponseOnce(
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
          language: 'English',
          type: 'ocr',
        },
        {
          language: 'English',
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
          hastarget: false,
          isallcontributed: false,
          language: 'Assamese',
          type: 'text',
        },
        {
          hastarget: false,
          isallcontributed: true,
          language: 'English-Hindi',
          type: 'parallel',
        },
      ])
    );

    const renderResult = render(<ContributionActions initiative={initiative} />);
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalled();
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/languagesWithData.json');
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/enableDisableCards.json');
    });
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup('tts', 'Hindi'));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('asr', 'Assamese');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should handle both cards enable', async () => {
    await setup('tts', 'Hindi');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).toHaveClass('d-none');
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).toHaveClass('d-none');
    });
  });

  it('should handle both cards disable', async () => {
    await setup('asr', 'Assamese');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).not.toHaveClass('d-none');
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
    });
  });

  it('should make set he "{}" value when no value found in enable disable card api', async () => {
    await setup('ocr', 'English');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).toHaveClass('d-none');
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
    });
  });

  it('should test the card enable  disable for translation', async () => {
    await setup('translation', 'English');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).not.toHaveClass('d-none');
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
    });
  });
});
