import { render, verifyAxeTest } from 'utils/testUtils';

import SocialShareIcons from '../SocialShareIcons';

describe('SocialShareIcons', () => {
  const setup = () => render(<SocialShareIcons />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
