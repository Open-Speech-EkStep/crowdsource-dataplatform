import { render } from 'utils/testUtils';

import LineChart from '../LineChart';

describe('Hero', () => {
  const setup = () =>
    render(
      <LineChart
        data={[
          {
            month: 2,
            category: 3,
            year: 2020,
            value1: 0.5,
            contributionText: 'text1',
            value2: 0.3,
            validationText: 'text2',
          },
        ]}
        line1Tooltip={'<div>{contributionText}</div>'}
        line2Tooltip={'<div>{validationText}</div>'}
      />
    );

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
