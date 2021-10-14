/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import HomePage from '../../dekhoIndia/home.page';

describe('Dekho Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the dekho india homepage', () => {
    setup();

    expect(screen.getByTestId('DekhoIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('DekhoIndiaDetails')).toBeInTheDocument();
  });
});
