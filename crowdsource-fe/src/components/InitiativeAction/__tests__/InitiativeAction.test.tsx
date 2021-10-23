import { render, verifyAxeTest } from 'utils/testUtils';

import InitiativeAction from '../InitiativeAction';

describe('InitiativeAction', () => {
  const setup = (action: any) =>
    render(<InitiativeAction actionIcon="some-action-icon.svg" type="asr" action={action} />);

  verifyAxeTest(setup('contribue'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(undefined);

    expect(asFragment()).toMatchSnapshot();
  });
});
