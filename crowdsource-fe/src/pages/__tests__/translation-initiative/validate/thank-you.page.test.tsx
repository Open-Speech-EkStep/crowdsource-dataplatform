/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouValidatePage from 'pages/translation-initiative/validate/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Translation Validate Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouValidatePage />);
  };

  it('should render the translation Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
