/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../bolo-india/dashboard.page';

describe('Bolo Dashboard page', () => {
  const setup = () => {
    return render(<DashboardPage />);
  };

  it('should render the boloDashboard component', () => {
    setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
