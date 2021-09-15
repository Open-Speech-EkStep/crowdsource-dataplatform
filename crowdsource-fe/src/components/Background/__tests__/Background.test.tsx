import { render, verifyAxeTest } from 'utils/testUtils';

import Background from '../Background';

describe('Background', () => {
  const setup = () =>
    render(
      <Background image="some-image.svg" size="cover">
        <div>Child Component</div>
      </Background>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
