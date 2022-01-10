import { render, screen } from 'utils/testUtils';

import AsrInitiativeActions from '../AsrInitiativeActions';

describe('AsrInitiativeActions', () => {
  const setup = () => {
    return render(<AsrInitiativeActions />);
  };

  it('should render the asr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
