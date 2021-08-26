import { render, verifyAxeTest } from 'utils/testUtils';

import Body from '../Body';

describe('Body', () => {
  const setup = () => render(<Body>Hello World</Body>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
