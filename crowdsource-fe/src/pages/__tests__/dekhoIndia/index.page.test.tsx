/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import HomePage from 'pages/dekho-india/index.page';
import { render, screen } from 'utils/testUtils';

describe('Dekho Home Page', () => {
  const setup = () => {
    return render(<HomePage />);
  };

  it('should render the dekho india homepage', () => {
    setup();

    expect(screen.getByTestId('DekhoIndiaActions')).toBeInTheDocument();
    expect(screen.getByTestId('DekhoIndiaDetails')).toBeInTheDocument();
  });
});
