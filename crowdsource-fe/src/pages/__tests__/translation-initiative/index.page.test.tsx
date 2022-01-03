/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/translation-initiative/index.page';
import { render, screen } from 'utils/testUtils';

describe('Translation Home Page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the translation Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('TranslationInitiativeActions')).toBeInTheDocument();
    expect(screen.getByTestId('TranslationInitiativeDetails')).toBeInTheDocument();
  });
});
