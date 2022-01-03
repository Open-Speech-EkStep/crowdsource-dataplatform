import { render, verifyAxeTest } from 'utils/testUtils';

import SocialShare from '../SocialShare';

describe('SocialShare', () => {
  const setup = () => render(<SocialShare />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
