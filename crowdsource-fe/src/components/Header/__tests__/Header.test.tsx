import { render, verifyAxeTest, screen } from 'utils/testUtils';

import Header from '../Header';

describe('Header', () => {
  const setup = () => render(<Header />);

  verifyAxeTest(() => setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render LanguageSwitcher', () => {
    setup();

    expect(screen.getByTestId('LanguageSwitcher')).toBeInTheDocument();
  });

  it('should not render UserOptions', () => {
    setup();

    expect(screen.queryByTestId('UserOptions')).not.toBeInTheDocument();
  });
});
