import { render, verifyAxeTest } from 'utils/testUtils';

import InfoMessage from '../InfoMessage';

describe('InfoMessage', () => {
  const setup = () => render(<InfoMessage text="Info message" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
