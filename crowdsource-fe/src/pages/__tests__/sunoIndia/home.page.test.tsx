/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import HomePage from '../../sunoIndia/home.page';

describe('Suno Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('PageHeader')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('TargetProgress')).toBeInTheDocument();
    expect(screen.getByText('ContributionStats')).toBeInTheDocument();
  });
});
