/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/asr-initiative/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Asr Validate Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the asr Initiative translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
