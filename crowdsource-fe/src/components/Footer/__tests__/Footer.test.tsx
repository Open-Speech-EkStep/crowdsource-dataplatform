import { render, verifyAxeTest } from 'utils/testUtils';

import Footer from '../Footer';

describe('Footer', () => {
  const setup = () => render(<Footer />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
