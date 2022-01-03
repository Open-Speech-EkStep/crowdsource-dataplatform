/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../tts-initiative/dashboard.page';

describe('Tts Dashboard page', () => {
  const setup = () => {
    return render(<DashboardPage />);
  };

  it('should render the ttsDashboard component', () => {
    setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
