import { render, screen } from 'utils/testUtils';

import OcrInitiativeActions from '../OcrInitiativeActions';

describe('OcrInitiativeActions', () => {
  const setup = () => {
    return render(<OcrInitiativeActions />);
  };

  it('should render the ocr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
