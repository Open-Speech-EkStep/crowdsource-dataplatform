import { render, verifyAxeTest } from 'utils/testUtils';

import TargetProgress from '../TargetProgress';

describe('TargetProgress', () => {
  const setup = () => render(<TargetProgress initiative="'suno'" initiativeMedia="'asr'" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
