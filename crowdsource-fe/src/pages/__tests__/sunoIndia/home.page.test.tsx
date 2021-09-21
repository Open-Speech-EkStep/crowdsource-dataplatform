/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import HomePage from '../../sunoIndia/home.page';

describe('Suno Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  verifyAxeTest(setup());

  it('should render the homepage', () => {
    setup();

    expect(screen.getByTestId('PageHeader')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('TargetProgress')).toBeInTheDocument();
    expect(screen.getByText('ContributionStats')).toBeInTheDocument();
    expect(screen.getByText('ContributionTracker')).toBeInTheDocument();
  });
});
