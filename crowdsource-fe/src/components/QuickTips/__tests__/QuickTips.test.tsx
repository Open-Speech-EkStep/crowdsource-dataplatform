import { render, verifyAxeTest } from 'utils/testUtils';

import QuickTips from '../QuickTips';

describe('QuickTips', () => {
  const setup = () => render(<QuickTips showQuickTips={true} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
