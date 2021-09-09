import { render, verifyAxeTest } from 'utils/testUtils';

import UserOptions from '../UserOptions';

describe('UserOptions', () => {
  const setup = () => render(<UserOptions />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
