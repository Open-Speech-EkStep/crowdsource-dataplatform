import { render, verifyAxeTest } from 'utils/testUtils';

import ContributionActions from '../ContributionActions';

describe('ContributionActions', () => {
  const setup = () => render(<ContributionActions initiativeMedia="'asr'" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
