import { render, verifyAxeTest } from 'utils/testUtils';

import ContributionTracker from '../ContributionTracker';

describe('ContributionActions', () => {
  const setup = () => render(<ContributionTracker />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
