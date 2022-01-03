/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/ocr-initiative/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Ocr Validate Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the ocr Initiative validate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
