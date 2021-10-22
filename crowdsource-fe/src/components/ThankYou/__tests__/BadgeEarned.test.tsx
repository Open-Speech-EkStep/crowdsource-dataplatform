import { render, verifyAxeTest } from 'utils/testUtils';

import BadgeEarned from '../BadgeEarned';

describe('BadgeEarned', () => {
  const setup = () => render(<BadgeEarned />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
