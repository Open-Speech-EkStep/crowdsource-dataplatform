import { render, screen } from 'utils/testUtils';

import LikhoIndiaActions from '../LikhoIndiaActions';

describe('Likho Actions', () => {
  const setup = () => {
    return render(<LikhoIndiaActions />);
  };

  it('should render the likho india homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
