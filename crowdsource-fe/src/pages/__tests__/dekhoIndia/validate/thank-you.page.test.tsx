/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouValidatePage from 'pages/dekho-india/validate/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Dekho Validate Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouValidatePage />);
  };

  it('should render the dekho india validate thankyou page', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });

  it('should have respective breadcrumb value', () => {
    setup();

    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('validate')).toBeInTheDocument();
  });
});
