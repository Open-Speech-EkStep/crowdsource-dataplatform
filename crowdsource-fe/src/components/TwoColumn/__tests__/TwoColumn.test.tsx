import { render, verifyAxeTest } from 'utils/testUtils';

import TwoColumn from '../TwoColumn';

describe('TwoColumn', () => {
  const setup = () => render(<TwoColumn />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
