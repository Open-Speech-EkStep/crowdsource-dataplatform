/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/translation-initiative/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Translation Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the translation Initiative translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
