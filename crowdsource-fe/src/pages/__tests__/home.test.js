import { render } from 'utils/testUtils';

import Home from '../home';

describe('Home', () => {
  const setup = () => render(<Home />);

  it('should render the homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Home')).toBeInTheDocument();
  });
});
