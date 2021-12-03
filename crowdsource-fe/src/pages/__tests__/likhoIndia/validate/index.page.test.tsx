/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/likho-india/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Likho Contribute Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the likho india translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
