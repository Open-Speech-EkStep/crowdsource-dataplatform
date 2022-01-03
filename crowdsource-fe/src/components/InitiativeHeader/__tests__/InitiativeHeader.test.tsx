import { render, verifyAxeTest } from 'utils/testUtils';

import InitiativeHeader from '../InitiativeHeader';

describe('InitiativeHeader', () => {
  const setup = () => render(<InitiativeHeader initiative="tts" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
