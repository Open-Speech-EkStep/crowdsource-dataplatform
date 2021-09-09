import { render, verifyAxeTest } from 'utils/testUtils';

import MapChart from '../MapChart';

describe('Hero', () => {
  const setup = () => render(<MapChart id="chart_id" data={[]} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
