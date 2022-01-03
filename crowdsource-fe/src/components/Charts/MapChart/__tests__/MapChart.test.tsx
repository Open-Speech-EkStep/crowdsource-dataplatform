import { render } from 'utils/testUtils';

import MapChart from '../MapChart';

describe('MapChart', () => {
  const anonumousStateData = {
    state: 'Unspecified Location',
    contribution: 2,
    validation: 3,
    speakers: 0,
    contributionText: 'contribution',
    validationText: 'validation',
    value: 5,
  };
  const setup = (data: Object[]) =>
    render(
      <MapChart
        sourceUrl="https://test/indiaMap.json"
        data={data}
        quarterUnit={0.25}
        anonymousStateData={anonumousStateData}
      />
    );

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup([]);

    expect(asFragment()).toMatchSnapshot();
  });
});
