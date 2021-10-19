/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import HomePage from '../../likhoIndia/home.page';

describe('Likho Home page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the likho india homepage', () => {
    setup();

    expect(screen.getByTestId('LikhoIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('LikhoIndiaDetails')).toBeInTheDocument();
  });
});
