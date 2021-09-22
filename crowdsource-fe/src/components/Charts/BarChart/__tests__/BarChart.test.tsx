import { render } from 'utils/testUtils';

import BarChart from '../BarChart';

describe('BarChart', () => {
  const chartData = {
    data: [],
    isScrollbar: true,
  };
  const setup = () => render(<BarChart id="chart_id" data={chartData} />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
