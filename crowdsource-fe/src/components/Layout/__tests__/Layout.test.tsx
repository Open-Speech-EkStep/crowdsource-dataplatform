import { render, screen, verifyAxeTest } from 'utils/testUtils';

import Layout from '../Layout';

describe('Layout', () => {
  const setup = () =>
    render(
      <Layout>
        <div>Hello World</div>
      </Layout>
    );

  verifyAxeTest(setup());

  it('should render the Header component', () => {
    setup();

    expect(screen.getByTestId('Header')).toBeInTheDocument();
  });

  it('should render the Body component', () => {
    setup();

    expect(screen.getByTestId('Body')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render the Footer component', () => {
    setup();

    expect(screen.getByTestId('Footer')).toBeInTheDocument();
  });
});
