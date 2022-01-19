import { when } from 'jest-when';

import { render, verifyAxeTest, screen, waitFor } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = async (
    initiative: 'tts' | 'asr' | 'translation' | 'ocr',
    language: string,
    translatedLanguage?: string
  ) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    when(localStorage.getItem)
      .calledWith('translatedLanguage')
      .mockImplementation(() => translatedLanguage || 'Hindi');

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
        {
          language: 'Odia',
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
        {
          hastarget: true,
          isallcontributed: true,
          language: 'English-Tamil',
          type: 'parallel',
        },
        {
          hastarget: true,
          isallcontributed: false,
          language: 'Odia-English',
          type: 'parallel',
        },
        {
          hastarget: true,
          isallcontributed: false,
          language: 'Odia-Hindi',
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

  it('should set empty object when no value found in enable disable card api', async () => {
    await setup('ocr', 'English');

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).toHaveClass('d-none');
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
    });
  });

  describe('test enable disable cards for translation initiative', () => {
    it('both cards should be disabled for translation on English-Hindi pair', async () => {
      await setup('translation', 'English', 'Hindi');

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).not.toHaveClass('d-none');
      });

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
      });
    });

    it('translate card should be disabled for translation on pairs with fromLanguage=English if all data are paired for English', async () => {
      await setup('translation', 'English', 'Punjabi');

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).not.toHaveClass('d-none');
      });

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
      });
    });

    it('translate card should be enabled for translation on pairs when unpaired data present for fromLanguage', async () => {
      await setup('translation', 'Odia', 'Tamil');

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[0]).toHaveClass('d-none');
      });

      await waitFor(() => {
        expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).not.toHaveClass('d-none');
      });
    });
  });
});
