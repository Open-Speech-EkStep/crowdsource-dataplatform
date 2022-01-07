/* eslint-disable import/no-internal-modules */
import { render, screen } from 'utils/testUtils';

import DashboardPage from '../../ocr-initiative/dashboard.page';

describe('ocr Dashboard page', () => {
  const setup = async () => {
    const result = render(<DashboardPage />);
    await screen.findByTestId('Breadcrumbs');
    return result;
  };

  it('should render the ocrDashboard component', async () => {
    await setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
