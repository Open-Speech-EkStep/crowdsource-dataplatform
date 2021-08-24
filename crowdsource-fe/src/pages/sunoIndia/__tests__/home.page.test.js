import { render, screen, verifyAxeTest } from 'utils/testUtils';

import SunoIndiaHome from '../home.page';

describe('SunoIndiaHome', () => {
  const setup = () => render(<SunoIndiaHome />);

  verifyAxeTest(setup());

  it('should render the suno India homepage', () => {
    setup();

    expect(screen.getByTestId('SunoIndiaHome')).toBeInTheDocument();
  });
});
