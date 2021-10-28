/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouValidatePage from 'pages/suno-india/validate/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Suno Validate Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouValidatePage />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
