import { render, verifyAxeTest } from 'utils/testUtils';

import TriColorBackground from '../TriColorBackground';

describe('TriColorBackground', () => {
  const setup = () => render(<TriColorBackground>Hello world</TriColorBackground>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
