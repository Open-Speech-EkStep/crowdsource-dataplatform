/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import LikhoIndiaDetails from '../LikhoIndiaDetails';

describe('Likho Actions', () => {
  const setup = () => {
    return render(<LikhoIndiaDetails />);
  };

  it('should render the likho india homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
