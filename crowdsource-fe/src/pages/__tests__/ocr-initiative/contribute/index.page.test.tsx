/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import ContributePage from 'pages/ocr-initiative/contribute/index.page';
import { render, screen } from 'utils/testUtils';

describe('Ocr Contribute Page', () => {
  const setup = () => {
    return render(<ContributePage />);
  };

  it('should render the ocr Initiative contribute component', () => {
    setup();

    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
