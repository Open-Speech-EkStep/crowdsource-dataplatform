/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';
import { render } from 'utils/testUtils';

jest.mock('next/dynamic', () => () => () => 'ContributionTracker');

import AsrInitiativeDetails from '../AsrInitiativeDetails';

describe('AsrInitiativeDetails', () => {
  const setup = async () => {
    return render(<AsrInitiativeDetails />);
  };

  it('should render the asr Initiative homepage', async () => {
    const { asFragment } = await setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
