/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import AsrInitiativeDetails from '../AsrInitiativeDetails';

describe('Asr Actions', () => {
  const setup = () => {
    return render(<AsrInitiativeDetails />);
  };

  it('should render the asr Initiative homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
