import { render, verifyAxeTest } from 'utils/testUtils';

import Button from '../Button';

describe('Button', () => {
  const setup = () => render(<Button>some text</Button>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
