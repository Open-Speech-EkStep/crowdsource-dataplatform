import { render, verifyAxeTest } from 'utils/testUtils';

import FourOFour from '../FourOFour';

describe('FourOFour', () => {
  const setup = () => render(<FourOFour />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
