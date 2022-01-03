/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ValidatePage from 'pages/translation-initiative/validate/index.page';
import { render, screen } from 'utils/testUtils';

describe('Translation Contribute Page', () => {
  const setup = () => {
    return render(<ValidatePage />);
  };

  it('should render the translation Initiative translate component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
