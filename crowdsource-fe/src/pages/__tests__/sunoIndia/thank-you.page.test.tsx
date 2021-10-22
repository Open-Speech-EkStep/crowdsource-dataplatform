/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import ThankYouPage from '../../sunoIndia/thank-you.page';

describe('Suno Thank you page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
