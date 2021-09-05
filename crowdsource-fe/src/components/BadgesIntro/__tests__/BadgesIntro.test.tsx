import { render, verifyAxeTest } from 'utils/testUtils';

import BadgesIntro from '../BadgesIntro';

describe('BadgesIntro', () => {
  const setup = () => render(<BadgesIntro />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
