import { axe } from 'jest-axe';

import { render } from 'utils/testUtils';

import SunoIndiaHome from '../home.page';

describe('SunoIndiaHome', () => {
  const setup = () => render(<SunoIndiaHome />);

  it('should not fail an axe audit', async () => {
    const { container } = setup();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the suno India homepage', () => {
    const { getByTestId } = setup();

    expect(getByTestId('SunoIndiaHome')).toBeInTheDocument();
  });
});
