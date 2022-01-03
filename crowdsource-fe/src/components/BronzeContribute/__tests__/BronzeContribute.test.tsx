import { render, verifyAxeTest } from 'utils/testUtils';

import BronzeContribute from '../BronzeContribute';

describe('BronzeContribute', () => {
  const setup = () => render(<BronzeContribute />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
