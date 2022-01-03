/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../asr-initiative/dashboard.page';

describe('asr Dashboard page', () => {
  const setup = () => {
    return render(<DashboardPage />);
  };

  it('should render the asrDashboard component', () => {
    setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
