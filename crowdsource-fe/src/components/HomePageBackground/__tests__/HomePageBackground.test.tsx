import { render, screen, verifyAxeTest } from 'utils/testUtils';

import HomePageBackground from '../HomePageBackground';

describe('HomePageBackground', () => {
  const setup = () =>
    render(
      <HomePageBackground>
        <div>Some Content</div>
      </HomePageBackground>
    );

  verifyAxeTest(setup());

  it('should render the home page background child component', () => {
    setup();

    expect(screen.getByText('Some Content')).toBeInTheDocument();
  });
});
