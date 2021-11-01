import { render } from 'utils/testUtils';

import PieChart from '../PieChart';

describe('PieChart', () => {
  const setup = () =>
    render(
      <PieChart
        id="chart_id"
        data={{
          data: [
            { category: 'a', value: 10 },
            { category: 'b', value: 7 },
          ],
        }}
      />
    );

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
