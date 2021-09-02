import { render, verifyAxeTest } from 'utils/testUtils';

import Header from '../Header';

describe('Header', () => {
  const setup = () => render(<Header />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});