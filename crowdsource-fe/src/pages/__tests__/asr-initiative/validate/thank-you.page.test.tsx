/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouPage from 'pages/asr-initiative/validate/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Asr Validate Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the asr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
