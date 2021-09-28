import { render, verifyAxeTest } from 'utils/testUtils';

import ActionCard from '../ActionCard';

describe('ActionCard', () => {
  const setup = () =>
    render(
      <ActionCard
        icon="some-icon.svg"
        type="transcribe"
        text="some-text"
        initiative="suno"
        warningMsg="Only contributions invited for the selected language"
      />
    );

  verifyAxeTest(setup());

  it('should render the component and match it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
