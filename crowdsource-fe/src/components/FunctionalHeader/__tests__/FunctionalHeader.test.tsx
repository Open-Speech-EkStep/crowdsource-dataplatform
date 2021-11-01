import { render, verifyAxeTest } from 'utils/testUtils';

import FunctionalHeader from '../FunctionalHeader';

describe('FunctionalHeader', () => {
  const setup = () =>
    render(
      <FunctionalHeader
        onSuccess={() => {}}
        initiative="suno"
        initiativeMediaType="sentence"
        action="transcribe"
        showSpeaker={true}
      />
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
