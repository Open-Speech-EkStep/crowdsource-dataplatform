import { render, screen } from 'utils/testUtils';

import BadgesPage from '../badges.page';

describe('BadgePage', () => {
  it('should render the BadgePage', () => {
    render(<BadgesPage />);

    expect(screen.getByText('translation initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('tts initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('ocr initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('asr initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByTestId('BadgeDetail')).toBeInTheDocument();
  });
});
