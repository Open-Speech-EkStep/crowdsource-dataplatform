/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import TtsInitiativeDetails from '../TtsInitiativeDetails';

describe('Tts Actions', () => {
  const setup = () => {
    return render(<TtsInitiativeDetails />);
  };

  it('should render the tts Initiative homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
