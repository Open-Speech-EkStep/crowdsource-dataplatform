/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/asr-initiative/index.page';
import { render, screen } from 'utils/testUtils';

describe('Asr Home Page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the asr Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('AsrInitiativeActions')).toBeInTheDocument();
    expect(screen.getByTestId('AsrInitiativeDetails')).toBeInTheDocument();
  });
});
