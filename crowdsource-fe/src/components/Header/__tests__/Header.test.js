import router from 'next/router';

import routePaths from 'constants/routePaths';
import { render, fireEvent } from 'utils/testUtils';

import Header from '../Header';

describe('Header', () => {
  const setup = () => render(<Header />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the url to suno India homepage when navigated through its nav link', () => {
    const { getByRole } = setup();

    fireEvent.click(getByRole('link', { name: 'suno india' }));

    expect(router.pathname).toBe(routePaths.sunoIndiaHome);
  });

  it('should change the url to homepage when navigated through its nav link', () => {
    const { getByRole } = setup();

    fireEvent.click(getByRole('link', { name: 'home' }));

    expect(router.pathname).toBe(routePaths.home);
  });
});
