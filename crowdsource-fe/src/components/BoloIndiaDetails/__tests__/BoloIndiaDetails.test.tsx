/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import BoloIndiaDetails from '../BoloIndiaDetails';

describe('Bolo Actions', () => {
  const setup = () => {
    return render(<BoloIndiaDetails />);
  };

  it('should render the bolo india homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
