import { render, screen, verifyAxeTest } from 'utils/testUtils';

import App from '../_app.page';

describe('App', () => {
  const setup = () => {
    const Component = () => <div>Hello World</div>;

    return render(<App Component={Component} />);
  };

  verifyAxeTest(setup());

  it('should render the Layout component', () => {
    setup();

    expect(screen.getByTestId('Layout')).toBeInTheDocument();
  });

  it('should render the passed component', () => {
    setup();

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
