/* eslint-disable import/no-internal-modules */
import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../asr-initiative/dashboard.page';

describe('asr Dashboard page', () => {
  const setup = async () => {
    const result = render(<DashboardPage />);
    await screen.findByTestId('Breadcrumbs');
    return result;
  };

  it('should render the asrDashboard component', async () => {
    await setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
