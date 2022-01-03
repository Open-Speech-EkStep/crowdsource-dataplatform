/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/tts-initiative/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Tts Validate Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the tts Initiative validator component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
