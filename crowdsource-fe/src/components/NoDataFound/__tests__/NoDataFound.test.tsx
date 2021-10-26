import { render, verifyAxeTest, screen } from 'utils/testUtils';

import NoDataFound from '../NoDataFound';

describe('NoDataFound', () => {
  const setup = () =>
    render(<NoDataFound url="/some-url" title="some-title" text="some-text" buttonLabel="some-label" />);

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
