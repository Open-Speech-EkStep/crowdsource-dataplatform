import { render, verifyAxeTest } from 'utils/testUtils';

import AudioController from '../AudioController';

describe('PageBackground', () => {
  const setup = () => render(<AudioController />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
