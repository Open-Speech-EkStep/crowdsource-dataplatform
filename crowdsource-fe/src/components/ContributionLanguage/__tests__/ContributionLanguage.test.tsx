/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import router from 'next/router';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import ContributionLanguage from '../ContributionLanguage';

describe('Suno Actions', () => {
  const setup = (locale: string) => {
    router.locale = locale;
    return render(<ContributionLanguage initiative="suno" />);
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('en');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should select the "Hindi" contribution language', async () => {
    setup('as');

    userEvent.selectOptions(screen.getByTestId('SelectContributionLanguage'), 'हिंदी');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'Hindi'
    );

    await waitFor(() => expect(router.locale).toBe('en'));

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');
  });

  it('should not refresh page when default and current locale are same', async () => {
    setup('en');

    userEvent.selectOptions(screen.getByTestId('SelectContributionLanguage'), 'English');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'English'
    );

    await waitFor(() => expect(router.locale).toBe('en'));

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'English');
  });
});
