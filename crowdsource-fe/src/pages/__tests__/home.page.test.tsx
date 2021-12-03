import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import Home from '../home.page';

describe('Home', () => {
  const setup = () => render(<Home />);

  verifyAxeTest(setup());

  it('should render the homepage', () => {
    setup();

    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('InitiativesCarousel')).toBeInTheDocument();
    expect(screen.getByTestId('HomePageBackground')).toBeInTheDocument();
    expect(screen.getByTestId('BronzeContribute')).toBeInTheDocument();
    expect(screen.getByTestId('BadgesIntro')).toBeInTheDocument();
    expect(screen.getByText('ParticipationStats')).toBeInTheDocument();
  });
});
