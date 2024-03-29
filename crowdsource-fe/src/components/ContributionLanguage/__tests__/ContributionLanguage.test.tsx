/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import router from 'next/router';

import type { Initiative } from 'types/Initiatives';
import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import ContributionLanguage from '../ContributionLanguage';

describe('tts Actions', () => {
  const setup = (locale: string | undefined, initiative: Initiative) => {
    router.locale = locale;
    return render(<ContributionLanguage initiative={initiative} />);
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('en', 'translation');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should select the "Hindi" contribution language', async () => {
    setup('as', 'tts');

    userEvent.selectOptions(screen.getByTestId('SelectContributionLanguage'), 'हिंदी');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'Hindi'
    );

    await waitFor(() => expect(router.locale).toBe('en'));

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');
  });

  it('should not refresh page when default and current locale are same', async () => {
    setup('en', 'tts');

    userEvent.selectOptions(screen.getByTestId('SelectContributionLanguage'), 'English');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'English'
    );

    await waitFor(() => expect(router.locale).toBe('en'));

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'English');
  });

  it('should select the value from translated dropdown', async () => {
    setup(undefined, 'translation');

    userEvent.selectOptions(screen.getByTestId('SelectTranslatedLanguage'), 'English');

    expect(screen.getByTestId('SelectTranslatedLanguage')).toHaveValue('English');

    expect(localStorage.setItem).toHaveBeenCalledWith('translatedLanguage', 'English');
  });

  it('should check the condition for contribution and translation match', async () => {
    setup('en', 'translation');
    userEvent.selectOptions(screen.getByTestId('SelectTranslatedLanguage'), 'English');

    expect(screen.getByTestId('SelectTranslatedLanguage')).toHaveValue('English');

    expect(localStorage.setItem).toHaveBeenCalledWith('translatedLanguage', 'English');

    userEvent.selectOptions(screen.getByTestId('SelectContributionLanguage'), 'English');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'English'
    );

    await waitFor(() => expect(router.locale).toBe('en'));

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'English');

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('translatedLanguage', 'Assamese');
    });
  });
});
