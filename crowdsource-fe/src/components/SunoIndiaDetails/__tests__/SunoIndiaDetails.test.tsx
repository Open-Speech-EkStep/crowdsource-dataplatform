/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import SunoIndiaDetails from '../SunoIndiaDetails';

describe('Suno Actions', () => {
  const setup = () => {
    return render(<SunoIndiaDetails />);
  };

  it('should render the suno india homepage', () => {
    setup();
    expect(screen.getByTestId('TargetProgress')).toBeInTheDocument();
    expect(screen.getByText('ContributionStats')).toBeInTheDocument();
  });
});
