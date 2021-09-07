import { render, verifyAxeTest } from 'utils/testUtils';

import Feedback from '../Feedback';

describe('Feedback', () => {
  const setup = () => render(<Feedback />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
