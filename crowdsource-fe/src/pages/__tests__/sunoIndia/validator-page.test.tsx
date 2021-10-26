/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import Validator from '../../sunoIndia/validator-page.page';

describe('Validator page', () => {
  const setup = () => {
    return render(<Validator />);
  };

  it('should render the suno india validator component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
