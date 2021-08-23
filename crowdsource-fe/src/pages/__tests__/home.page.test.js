import { axe } from 'jest-axe';

import { render } from 'utils/testUtils';

import Home from '../home.page';

describe('Home', () => {
  const setup = () => render(<Home />);

  it('should not fail an axe audit', async () => {
    const { container } = setup();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Home')).toBeInTheDocument();
  });
});
