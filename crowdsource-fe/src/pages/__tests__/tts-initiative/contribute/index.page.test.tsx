/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/tts-initiative/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Tts Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the tts Initiative record component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
