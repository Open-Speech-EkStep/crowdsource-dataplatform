import { render } from 'utils/testUtils';

import Footer from '../Footer';

describe('Footer', () => {
  const setup = () => render(<Footer />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
