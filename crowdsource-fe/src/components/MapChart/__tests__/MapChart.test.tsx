import { render } from 'utils/testUtils';

import MapChart from '../MapChart';

describe('MapChart', () => {
  const setup = () =>
    render(<MapChart sourceUrl="https://test/indiaMap.json" data={[]} quarterUnit={0.25} />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
