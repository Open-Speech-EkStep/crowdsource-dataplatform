import { render, screen, verifyAxeTest } from 'utils/testUtils';

import FourOFour from '../404.page';

describe('FourOFour', () => {
  const setup = () => render(<FourOFour />);

  verifyAxeTest(setup());

  it('should render the 404 page', () => {
    setup();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404Title.')).toBeInTheDocument();
  });
});
