import { render, userEvent, verifyAxeTest, screen } from 'utils/testUtils';

import QuickTips from '../QuickTips';

describe('QuickTips', () => {
  const setup = () => render(<QuickTips showQuickTips={true} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should close the quick tips when user click on cross button', () => {
    setup();

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByTestId('QuickTips')).not.toBeInTheDocument();
  });
});
