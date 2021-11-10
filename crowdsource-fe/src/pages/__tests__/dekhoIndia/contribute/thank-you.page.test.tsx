/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouPage from 'pages/dekho-india/contribute/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Dekho Contribute Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the dekho india contribute thank you page', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });

  it('should have respective breadcrumb value', () => {
    setup();

    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('label')).toBeInTheDocument();
  });
});
