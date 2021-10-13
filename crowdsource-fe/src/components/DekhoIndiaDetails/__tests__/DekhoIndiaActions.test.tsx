import { render, screen } from 'utils/testUtils';

import DekhoIndiaActions from '../DekhoIndiaActions';

describe('Dekho Actions', () => {
  const setup = () => {
    return render(<DekhoIndiaActions />);
  };

  it('should render the dekho india homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
