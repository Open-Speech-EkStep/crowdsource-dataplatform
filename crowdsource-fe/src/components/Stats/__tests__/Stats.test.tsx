import { render, verifyAxeTest } from 'utils/testUtils';

import Stats from '../Stats';

describe('Stats', () => {
  const setup = () => render(<Stats />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
