import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import Home from '../home.page';

describe('Home', () => {
  const setup = () => render(<Home />);

  verifyAxeTest(setup());

  it('should render the homepage', () => {
    setup();

    expect(screen.getByTestId('PageBackground')).toBeInTheDocument();
    expect(screen.getByTestId('Hero')).toBeInTheDocument();
  });
});
