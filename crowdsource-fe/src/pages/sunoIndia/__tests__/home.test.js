import { render } from 'utils/testUtils';

import SunoIndiaHome from '../home';

describe('SunoIndiaHome', () => {
  const setup = () => render(<SunoIndiaHome />);

  it('should render the suno India homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('SunoIndiaHome')).toBeInTheDocument();
  });
});
