/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/suno-india/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Suno Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the suno india record component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
