/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../dekho-india/dashboard.page';

describe('Dekho Dashboard page', () => {
  const setup = () => {
    return render(<DashboardPage />);
  };

  it('should render the dekhoDashboard component', () => {
    setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
