/* eslint-disable import/no-internal-modules */
import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../tts-initiative/dashboard.page';

describe('Tts Dashboard page', () => {
  const setup = async () => {
    const result = render(<DashboardPage />);
    await screen.findByTestId('Breadcrumbs');
    return result;
  };

  it('should render the ttsDashboard component', async () => {
    await setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
