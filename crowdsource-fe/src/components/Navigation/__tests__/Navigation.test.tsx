import Navigation from 'components/Navigation/Navigation';
import { render, verifyAxeTest } from 'utils/testUtils';

describe('Navigation', () => {
  const setup = () => render(<Navigation />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
