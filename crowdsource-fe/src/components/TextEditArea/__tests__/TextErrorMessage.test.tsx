import { render, verifyAxeTest } from 'utils/testUtils';

import TextErrorMessage from '../TextErrorMessage';

describe('TextErrorMessage', () => {
  const setup = () => render(<TextErrorMessage />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
