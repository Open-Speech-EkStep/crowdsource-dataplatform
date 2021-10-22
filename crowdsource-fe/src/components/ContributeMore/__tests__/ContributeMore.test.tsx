import { render, verifyAxeTest } from 'utils/testUtils';

import ContributeMore from '../ContributeMore';

describe('ContributeMore', () => {
  const setup = () => render(<ContributeMore />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
