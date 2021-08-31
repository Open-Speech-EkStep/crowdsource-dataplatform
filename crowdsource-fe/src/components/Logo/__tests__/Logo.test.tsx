import Logo from 'components/Logo/Logo';
import { render, verifyAxeTest } from 'utils/testUtils';

describe('Logo', () => {
  const setup = () => render(<Logo />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
