/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import DekhoIndiaDetails from '../DekhoIndiaDetails';

describe('Dekho Actions', () => {
  const setup = () => {
    return render(<DekhoIndiaDetails />);
  };

  it('should render the dekho india homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
