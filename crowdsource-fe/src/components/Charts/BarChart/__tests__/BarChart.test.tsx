import { render, verifyAxeTest } from 'utils/testUtils';

import BarChart from '../BarChart';

describe('BarChart', () => {
  const setup = () => render(<BarChart id="chart_id" chartData={[]} data={[]} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
