import router from 'next/router';

import { render, verifyAxeTest, userEvent, screen } from 'utils/testUtils';

import NavigationList from '../NavigationList';

describe('NavigationList', () => {
  const setup = () => render(<NavigationList />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the url to tts Initiative homepage when navigated through its nav link', () => {
    setup();

    userEvent.click(screen.getByRole('link', { name: 'tts initiativeTextSuffix' }));

    expect(router.pathname).toBe('/tts-initiative');
  });
});
