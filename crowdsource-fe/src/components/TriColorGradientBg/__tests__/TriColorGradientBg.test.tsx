import { render, verifyAxeTest } from 'utils/testUtils';

import TriColorGradientBg from '../TriColorGradientBg';

describe('TriColorGradientBg', () => {
  const setup = () => render(<TriColorGradientBg>some content</TriColorGradientBg>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
