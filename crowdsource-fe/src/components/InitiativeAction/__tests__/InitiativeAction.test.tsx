import { render, verifyAxeTest } from 'utils/testUtils';

import InitiativeAction from '../InitiativeAction';

describe('InitiativeAction', () => {
  const setup = () => render(<InitiativeAction actionIcon="some-action-icon.svg" initiative="suno" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
