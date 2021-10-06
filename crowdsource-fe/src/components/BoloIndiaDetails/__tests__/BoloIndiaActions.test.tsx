import { render, screen } from 'utils/testUtils';

import BoloIndiaActions from '../BoloIndiaActions';

describe('Bolo Actions', () => {
  const setup = () => {
    return render(<BoloIndiaActions />);
  };

  it('should render the bolo india homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
