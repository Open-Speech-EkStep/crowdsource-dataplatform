/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouPage from 'pages/translation-initiative/contribute/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Translation Contribute Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the translation Initiative contribute thank you page', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });

  it('should have respective breadcrumb value', () => {
    setup();

    expect(screen.getByText('translation initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('translate')).toBeInTheDocument();
  });
});
