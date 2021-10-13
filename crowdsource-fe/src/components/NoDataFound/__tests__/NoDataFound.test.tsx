import { render, verifyAxeTest } from 'utils/testUtils';

import NoDataFound from '../NoDataFound';

describe('NoDataFound', () => {
  const setup = () => render(<NoDataFound url="/some-url" initiative="suno" language="Hindi" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
