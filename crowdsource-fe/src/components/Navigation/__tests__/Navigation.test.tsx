import { render, verifyAxeTest } from 'utils/testUtils';

import Navigation from '../Navigation';

describe('Navigation', () => {
  const setup = () => render(<Navigation />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
