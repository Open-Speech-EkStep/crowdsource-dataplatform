import { render, verifyAxeTest } from 'utils/testUtils';

import ContributionDetails from '../ContributionDetails';

describe('ContributionDetails', () => {
  const setup = () => render(<ContributionDetails />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
