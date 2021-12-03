import { render, verifyAxeTest } from 'utils/testUtils';

import HomepageLink from '../HomepageLink';

describe('HomepageLink', () => {
  const setup = () => render(<HomepageLink />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
