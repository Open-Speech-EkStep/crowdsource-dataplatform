/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/ocr-initiative/index.page';
import { render, screen } from 'utils/testUtils';

describe('Ocr Home Page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the ocr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('OcrInitiativeActions')).toBeInTheDocument();
    expect(screen.getByTestId('OcrInitiativeDetails')).toBeInTheDocument();
  });
});
