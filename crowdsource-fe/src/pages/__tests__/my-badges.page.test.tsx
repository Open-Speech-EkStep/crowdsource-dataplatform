import { render, screen } from 'utils/testUtils';

import MyBadgesPage from '../my-badges.page';

describe('MyBadgesPage', () => {
  it('should render the MyBadgesPage', () => {
    render(<MyBadgesPage />);

    expect(screen.getByText('medalGalleryText')).toBeInTheDocument();
    expect(screen.getByText('translation initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('tts initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('ocr initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('asr initiativeTextSuffix')).toBeInTheDocument();
  });
});
