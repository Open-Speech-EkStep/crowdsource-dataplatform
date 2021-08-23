import { render, verifyAxeTest } from 'utils/testUtils';

import SunoIndiaHome from '../home.page';

describe('SunoIndiaHome', () => {
  const setup = () => render(<SunoIndiaHome />);

  verifyAxeTest(setup());

  it('should render the suno India homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('SunoIndiaHome')).toBeInTheDocument();
  });
});
