import { render, verifyAxeTest } from 'utils/testUtils';

import FunctionalPageBackground from '../FunctionalPageBackground';

describe('FunctionalPageBackground', () => {
  const setup = () => render(<FunctionalPageBackground>Some Content</FunctionalPageBackground>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
