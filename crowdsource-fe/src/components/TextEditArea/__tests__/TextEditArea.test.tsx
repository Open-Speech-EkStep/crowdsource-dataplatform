import { render, verifyAxeTest } from 'utils/testUtils';

import TextEditArea from '../TextEditArea';

describe('TextEditArea', () => {
  const setup = () => render(<TextEditArea />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
