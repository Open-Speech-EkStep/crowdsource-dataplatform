/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/tts-initiative/index.page';
import { render, screen } from 'utils/testUtils';

describe('Tts Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the tts Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('TtsInitiativeActions')).toBeInTheDocument();
    expect(screen.getByTestId('TtsInitiativeDetails')).toBeInTheDocument();
  });
});
