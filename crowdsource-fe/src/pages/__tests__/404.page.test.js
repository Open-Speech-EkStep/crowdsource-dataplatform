import { axe } from 'jest-axe';

import { render } from 'utils/testUtils';

import FourOFour from '../404.page';

describe('FourOFour', () => {
  const setup = () => render(<FourOFour />);

  it('should not fail an axe audit', async () => {
    const { container } = setup();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the 404 page', () => {
    const { getByText } = setup();

    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('404Title.')).toBeInTheDocument();
  });
});
