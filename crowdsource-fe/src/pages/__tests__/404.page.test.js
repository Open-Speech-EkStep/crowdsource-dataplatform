import { render, verifyAxeTest } from 'utils/testUtils';

import FourOFour from '../404.page';

describe('FourOFour', () => {
  const setup = () => render(<FourOFour />);

  verifyAxeTest(setup());

  it('should render the 404 page', () => {
    const { getByText } = setup();

    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('404Title.')).toBeInTheDocument();
  });
});
