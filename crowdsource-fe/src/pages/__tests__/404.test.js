import { render } from 'utils/testUtils';

import FourOFour from '../404';

describe('FourOFour', () => {
  const setup = () => render(<FourOFour />);

  it('should render the 404 page', () => {
    const { getByText } = setup();

    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('404Title.')).toBeInTheDocument();
  });
});
