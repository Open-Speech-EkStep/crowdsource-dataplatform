/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

jest.mock('next/dynamic', () => () => () => 'ContributionTracker');

import OcrInitiativeDetails from '../OcrInitiativeDetails';

describe('Ocr Actions', () => {
  const setup = () => {
    return render(<OcrInitiativeDetails />);
  };

  it('should render the ocr Initiative homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
