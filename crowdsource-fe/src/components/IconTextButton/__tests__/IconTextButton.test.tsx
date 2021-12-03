import { render, verifyAxeTest } from 'utils/testUtils';

import IconTextButton from '../IconTextButton';

describe('IconTextButton', () => {
  const setup = () =>
    render(
      <IconTextButton textDesktop="some-text" onClick={() => {}} altText="text">
        <div>Child Component</div>
      </IconTextButton>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
