import { render, verifyAxeTest } from 'utils/testUtils';

import App from '../_app.page';

describe('App', () => {
  const setup = () => {
    const Component = () => <div>Hello World</div>;

    return render(<App Component={Component} />);
  };

  verifyAxeTest(setup());

  it('should render the Layout component', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Layout')).toBeInTheDocument();
  });

  it('should render the passed component', () => {
    const { getByText } = setup();

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
