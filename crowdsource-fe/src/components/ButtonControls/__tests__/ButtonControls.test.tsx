import { render, verifyAxeTest } from 'utils/testUtils';

import ButtonControls from '../ButtonControls';

describe('ButtonControls', () => {
  const setup = () => render(<ButtonControls />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
