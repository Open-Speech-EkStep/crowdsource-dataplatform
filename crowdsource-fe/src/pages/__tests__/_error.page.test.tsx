import { render, screen, verifyAxeTest } from 'utils/testUtils';

import Error from '../_error.page';

describe('Error', () => {
  const setup = (statusCode: number) => render(<Error statusCode={statusCode} />);

  verifyAxeTest(setup(404));

  it('should render the 404 page', () => {
    setup(404);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404Title.')).toBeInTheDocument();
  });

  it('should render the some other error page', () => {
    setup(500);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error.')).toBeInTheDocument();
  });
});
