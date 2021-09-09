import { render, verifyAxeTest } from 'utils/testUtils';

import LineChart from '../LineChart';

describe('Hero', () => {
  const setup = () => render(<LineChart id="chart_id" data={{ data: [] }} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
