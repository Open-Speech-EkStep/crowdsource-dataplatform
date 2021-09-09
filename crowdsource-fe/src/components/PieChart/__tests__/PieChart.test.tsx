import { render, verifyAxeTest } from 'utils/testUtils';

import PieChart from '../PieChart';

describe('Hero', () => {
  const setup = () => render(<PieChart id="chart_id" data={[]} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
