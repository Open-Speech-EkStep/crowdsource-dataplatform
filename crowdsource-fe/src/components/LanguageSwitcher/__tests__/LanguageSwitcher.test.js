import router from 'next/router';

import { render, fireEvent, screen, verifyAxeTest } from 'utils/testUtils';

import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  const setup = () => render(<LanguageSwitcher />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the locale to hindi', () => {
    setup();

    fireEvent.click(screen.getByRole('link', { name: 'हिंदी' }));

    expect(router.locale).toBe('hi');
  });
});
