import { render, verifyAxeTest, screen } from 'utils/testUtils';

import DashboardNotification from '../DashboardNotification';

describe('DashboardNotification', () => {
  const setup = () =>
    render(<DashboardNotification text="some-text" buttonLabel="Contribute Now" onClick={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the valid text', () => {
    setup();

    expect(screen.getByText('some-text')).toBeInTheDocument();
  });
});
