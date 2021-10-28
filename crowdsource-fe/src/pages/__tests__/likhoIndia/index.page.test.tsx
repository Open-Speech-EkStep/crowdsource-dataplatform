/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/likho-india/index.page';
import { render, screen } from 'utils/testUtils';

describe('Likho Home Page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the likho india homepage', () => {
    setup();

    expect(screen.getByTestId('LikhoIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('LikhoIndiaDetails')).toBeInTheDocument();
  });
});
