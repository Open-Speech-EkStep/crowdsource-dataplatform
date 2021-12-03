/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/dekho-india/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Dekho Validate Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the dekho india validate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
