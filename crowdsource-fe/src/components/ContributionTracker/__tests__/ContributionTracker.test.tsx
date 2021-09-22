import { render } from 'utils/testUtils';

import ContributionTracker from '../ContributionTracker';

describe('ContributionActions', () => {
  const setup = () => render(<ContributionTracker />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
