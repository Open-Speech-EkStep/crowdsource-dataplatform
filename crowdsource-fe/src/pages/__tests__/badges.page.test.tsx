import { render, screen } from 'utils/testUtils';

import BadgesPage from '../badges.page';

describe('BadgePage', () => {
  it('should render the BadgePage', () => {
    render(<BadgesPage />);

    expect(screen.getByText('likho india')).toBeInTheDocument();
    expect(screen.getByText('suno india')).toBeInTheDocument();
    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('bolo india')).toBeInTheDocument();
    expect(screen.getByTestId('BadgeDetail')).toBeInTheDocument();
  });
});
