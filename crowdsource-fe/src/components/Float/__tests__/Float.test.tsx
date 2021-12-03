import { render, verifyAxeTest } from 'utils/testUtils';

import Float from '../Float';

describe('Float', () => {
  const setup = () => render(<Float />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
