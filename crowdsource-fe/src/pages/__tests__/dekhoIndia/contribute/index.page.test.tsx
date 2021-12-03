/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/dekho-india/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Dekho Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the dekho india contribute component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
