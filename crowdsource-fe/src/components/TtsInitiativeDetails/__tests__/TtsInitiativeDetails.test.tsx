/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

jest.mock('next/dynamic', () => () => () => 'ContributionTracker');

import TtsInitiativeDetails from '../TtsInitiativeDetails';

describe('TtsInitiativeDetails', () => {
  const setup = () => {
    return render(<TtsInitiativeDetails />);
  };

  it('should render the tts Initiative homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
