/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouValidatePage from 'pages/ocr-initiative/validate/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Ocr Validate Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouValidatePage />);
  };

  it('should render the ocr Initiative validate thankyou page', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });

  it('should have respective breadcrumb value', () => {
    setup();

    expect(screen.getByText('ocr initiativeTextSuffix')).toBeInTheDocument();
    expect(screen.getByText('validate')).toBeInTheDocument();
  });
});
