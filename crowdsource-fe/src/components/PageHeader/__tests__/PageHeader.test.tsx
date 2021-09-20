import { render, verifyAxeTest } from 'utils/testUtils';

import PageHeader from '../../TriColorBorder';

describe('TriColorBorder', () => {
  const setup = () => render(<PageHeader />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
