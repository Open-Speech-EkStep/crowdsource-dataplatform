/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/bolo-india/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Bolo Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the bolo india translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
