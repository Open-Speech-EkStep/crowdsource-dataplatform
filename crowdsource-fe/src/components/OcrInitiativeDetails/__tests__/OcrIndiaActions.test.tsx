import { render, screen } from 'utils/testUtils';

import OcrInitiativeActions from '../OcrInitiativeActions';

describe('Ocr Actions', () => {
  const setup = () => {
    return render(<OcrInitiativeActions />);
  };

  it('should render the ocr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
