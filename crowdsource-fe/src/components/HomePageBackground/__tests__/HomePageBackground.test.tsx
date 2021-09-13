import { render, screen, verifyAxeTest } from 'utils/testUtils';

import HomePageBackground from '../HomePageBackground';

describe('HomePageBackground', () => {
  const setup = () => render(<HomePageBackground />);

  verifyAxeTest(setup());

  it('should render the home page background', () => {
    setup();

    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('InitiativesCarousel')).toBeInTheDocument();
  });
});
