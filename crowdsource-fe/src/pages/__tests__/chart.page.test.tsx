import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import ChartPage from '../chart.page';

describe('Chart', () => {
  const setup = () => render(<ChartPage />);

  verifyAxeTest(setup());

  it('should render the homepage', () => {
    setup();

    expect(screen.getByTestId('PieChart')).toBeInTheDocument();
    expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    expect(screen.getByTestId('LineChart')).toBeInTheDocument();
  });
});
