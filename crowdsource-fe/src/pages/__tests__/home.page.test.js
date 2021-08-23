import { render, verifyAxeTest } from 'utils/testUtils';

import Home from '../home.page';

describe('Home', () => {
  const setup = () => render(<Home />);

  verifyAxeTest(setup());

  it('should render the homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Home')).toBeInTheDocument();
  });
});
