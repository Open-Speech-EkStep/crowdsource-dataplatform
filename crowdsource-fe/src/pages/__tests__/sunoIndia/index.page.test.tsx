/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/suno-india/index.page';
import { render, screen } from 'utils/testUtils';

describe('Suno Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('SunoIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('SunoIndiaDetails')).toBeInTheDocument();
  });
});
