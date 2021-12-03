/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/suno-india/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Suno Validate Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the suno india validator component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
