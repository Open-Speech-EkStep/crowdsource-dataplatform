import { render, verifyAxeTest } from 'utils/testUtils';

import TriColorBorder from '../TriColorBorder';

describe('TriColorBorder', () => {
  const setup = () => render(<TriColorBorder />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
