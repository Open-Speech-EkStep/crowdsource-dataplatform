import router from 'next/router';

import { render, verifyAxeTest, fireEvent, screen } from 'utils/testUtils';

import NavigationList from '../NavigationList';

describe('NavigationList', () => {
  const setup = () => render(<NavigationList />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the url to suno India homepage when navigated through its nav link', () => {
    setup();

    fireEvent.click(screen.getByRole('link', { name: 'suno india' }));

    expect(router.pathname).toBe('/sunoIndia/home.html');
  });
});
