/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouPage from 'pages/bolo-india/contribute/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Bolo Contribute Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the bolo india homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
