import { render, verifyAxeTest } from 'utils/testUtils';

import ShareOn from '../ShareOn';

describe('BadgeEarned', () => {
  const setup = () => render(<ShareOn initiativeName="Suno India" language="Hindi" rank={2} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
