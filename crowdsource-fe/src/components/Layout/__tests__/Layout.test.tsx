import { render, screen } from 'utils/testUtils';

import Layout from '../Layout';

describe('Layout', () => {
  const setup = () => {
    return render(
      <Layout>
        <div>Hello World</div>
      </Layout>
    );
  };

  // verifyAxeTest(setup());

  it('should render the Header component', async () => {
    setup();

    expect(screen.getByTestId('Header')).toBeInTheDocument();
  });

  it('should render the Body component', async () => {
    setup();

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render the Footer component', async () => {
    setup();

    expect(screen.getByTestId('Footer')).toBeInTheDocument();
  });
});
