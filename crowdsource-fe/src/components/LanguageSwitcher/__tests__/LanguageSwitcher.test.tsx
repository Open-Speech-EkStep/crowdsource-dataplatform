import router from 'next/router';

import { render, userEvent, screen, verifyAxeTest, waitFor } from 'utils/testUtils';

import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  const setup = () => render(<LanguageSwitcher />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the locale to hindi', async () => {
    setup();

    userEvent.click(screen.getByText('English'));

    await waitFor(() => expect(screen.getByRole('link', { name: 'हिंदी' })).toBeInTheDocument());

    userEvent.click(screen.getByRole('link', { name: 'हिंदी' }));

    expect(router.locale).toBe('hi');

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');
  });
});
