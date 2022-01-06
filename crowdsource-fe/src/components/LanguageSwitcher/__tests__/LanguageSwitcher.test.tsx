import router from 'next/router';

import { render, userEvent, screen, verifyAxeTest, waitFor } from 'utils/testUtils';

import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  const setup = () => {
    const renderResult = render(<LanguageSwitcher />);
    return renderResult;
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the locale to hindi', async () => {
    router.locale = undefined;
    setup();

    expect(document.cookie).toBe('');

    userEvent.click(screen.getByText('English'));

    await waitFor(() => expect(screen.getByRole('link', { name: 'हिंदी' })).toBeInTheDocument());

    userEvent.click(screen.getByRole('link', { name: 'हिंदी' }));

    expect(router.locale).toBe('hi');

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');

    expect(document.cookie).toBe('NEXT_LOCALE=hi');
  });

  it('should page not refresh when we click on same locale', async () => {
    setup();

    expect(document.cookie).toBe('NEXT_LOCALE=hi');

    userEvent.click(screen.getByText('हिंदी'));

    await waitFor(() => expect(screen.getByRole('link', { name: 'हिंदी' })).toBeInTheDocument());

    userEvent.click(screen.getByRole('link', { name: 'हिंदी' }));

    expect(router.locale).toBe('hi');

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');

    expect(document.cookie).toBe('NEXT_LOCALE=hi');
  });

  it('should change the locale to English', async () => {
    setup();

    userEvent.click(screen.getByText('हिंदी'));

    await waitFor(() => expect(screen.getByRole('link', { name: 'English' })).toBeInTheDocument());

    userEvent.click(screen.getByRole('link', { name: 'English' }));

    expect(router.locale).toBe('en');

    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'English');
  });

  it('should change the locale to English but contribution language should not select', async () => {
    router.asPath = '/tts-initiative';
    setup();

    userEvent.click(screen.getByText('English'));

    await waitFor(() => expect(screen.getByRole('link', { name: 'English' })).toBeInTheDocument());

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
