/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/likho-india/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Likho Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the likho india translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
