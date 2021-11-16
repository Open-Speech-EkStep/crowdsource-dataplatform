/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/bolo-india/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Bolo Validate Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the bolo india translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
