import { render, screen } from 'utils/testUtils';

import MyBadgesPage from '../my-badges.page';

describe('MyBadgesPage', () => {

  it('should render the MyBadgesPage', () => {
    render(<MyBadgesPage />);

    expect(screen.getByText('Your Medal Gallery')).toBeInTheDocument();
    expect(screen.getByText('likho india')).toBeInTheDocument();
    expect(screen.getByText('suno india')).toBeInTheDocument();
    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('bolo india')).toBeInTheDocument();
  });
});
