import router from 'next/router';

import routePaths from 'constants/routePaths';
import { render, fireEvent, screen, verifyAxeTest } from 'utils/testUtils';

import Header from '../Header';

describe('Header', () => {
  const setup = () => render(<Header />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the url to suno India homepage when navigated through its nav link', () => {
    setup();

    fireEvent.click(screen.getByRole('link', { name: 'suno india' }));

    expect(router.pathname).toBe(routePaths.sunoIndiaHome);
  });

  it('should change the url to homepage when navigated through its nav link', () => {
    setup();

    fireEvent.click(screen.getByRole('link', { name: 'home' }));

    expect(router.pathname).toBe(routePaths.home);
  });
});
