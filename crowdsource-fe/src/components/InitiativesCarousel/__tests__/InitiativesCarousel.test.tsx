import { render, verifyAxeTest } from 'utils/testUtils';

import InitiativesCarousel from '../InitiativesCarousel';

describe('InitiativesCarousel', () => {
  const setup = () => render(<InitiativesCarousel />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
