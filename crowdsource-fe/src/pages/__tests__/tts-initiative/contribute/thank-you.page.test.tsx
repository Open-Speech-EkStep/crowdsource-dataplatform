/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ThankYouPage from 'pages/tts-initiative/contribute/thank-you.page';
import { render, screen } from 'utils/testUtils';

describe('Tts Contribute Thank You Page', () => {
  const setup = () => {
    return render(<ThankYouPage />);
  };

  it('should render the tts Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ThankYou')).toBeInTheDocument();
    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
  });
});
