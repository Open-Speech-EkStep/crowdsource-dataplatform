import { render, screen, verifyAxeTest } from 'utils/testUtils';

import FourOFour from '../404.page';

describe('404Page', () => {
  const setup = () => render(<FourOFour />);

  verifyAxeTest(setup());

  it('should render the 404 page', () => {
    setup();

    expect(screen.getByText('404 Error')).toBeInTheDocument();
  });
});
