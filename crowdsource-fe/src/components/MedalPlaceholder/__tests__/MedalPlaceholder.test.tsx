import { render, verifyAxeTest } from 'utils/testUtils';

import MedalPlaceholder from '../MedalPlaceholder';

describe('MedalPlaceholder', () => {
  const setup = () => render(<MedalPlaceholder />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
