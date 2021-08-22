import { render } from 'utils/testUtils';

import Layout from '../Layout';

describe('Layout', () => {
  const setup = () => {
    return render(
      <Layout>
        <div>Hello World</div>
      </Layout>
    );
  };

  it('should render the Header component', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Header')).toBeInTheDocument();
  });

  it('should render the Body component', () => {
    const { getByTestId, getByText } = setup();

    expect(getByTestId('Body')).toBeInTheDocument();
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('should render the Footer component', () => {
    const { getByTestId } = setup();

    expect(getByTestId('Footer')).toBeInTheDocument();
  });
});
