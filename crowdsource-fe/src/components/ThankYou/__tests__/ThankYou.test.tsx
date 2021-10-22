import { render } from 'utils/testUtils';

import ThankYou from '../ThankYou';

describe('ThankYou', () => {
  const setup = () => render(<ThankYou initiative="suno" />);

  // verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
