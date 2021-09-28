import { render, screen } from 'utils/testUtils';

import SunoIndiaActions from '../SunoIndiaActions';

describe('Suno Actions', () => {
  const setup = () => {
    return render(<SunoIndiaActions />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
