/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import HomePage from '../../boloIndia/home.page';

describe('Bolo Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the bolo india homepage', () => {
    setup();

    expect(screen.getByTestId('BoloIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('BoloIndiaDetails')).toBeInTheDocument();
  });
});
